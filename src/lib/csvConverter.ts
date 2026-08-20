export interface TransformOptions {
  filterColumn?: string;
  filterOperation?: string;
  filterValue?: string;
  limitRows?: number;
  removeEmptyRows?: boolean;
  trimWhitespace?: boolean;
  sortColumn?: string;
  sortDirection?: string;
}

/**
 * Apply filtering, sorting, whitespace trimming, and row limits to an array of objects.
 */
export function applyDataTransformations(
  rows: Record<string, unknown>[],
  options?: TransformOptions
): Record<string, unknown>[] {
  let result = [...rows];

  // 1. Trim whitespace if option enabled
  if (options?.trimWhitespace) {
    result = result.map((row) => {
      const trimmedRow: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row)) {
        trimmedRow[k] = typeof v === "string" ? v.trim() : v;
      }
      return trimmedRow;
    });
  }

  // 2. Apply column filter if specified in config
  if (
    options?.filterColumn?.trim() &&
    options?.filterValue !== undefined &&
    options.filterColumn.trim() !== ""
  ) {
    const col = options.filterColumn.trim();
    const val = String(options.filterValue).toLowerCase();
    const op = options.filterOperation || "equals";

    result = result.filter((row) => {
      const cellVal = String(row[col] ?? "").toLowerCase();
      switch (op) {
        case "equals":
          return cellVal === val;
        case "contains":
          return cellVal.includes(val);
        case "gt": {
          const numCell = parseFloat(cellVal);
          const numVal = parseFloat(val);
          return !isNaN(numCell) && !isNaN(numVal)
            ? numCell > numVal
            : cellVal > val;
        }
        case "lt": {
          const numCell = parseFloat(cellVal);
          const numVal = parseFloat(val);
          return !isNaN(numCell) && !isNaN(numVal)
            ? numCell < numVal
            : cellVal < val;
        }
        case "not_empty":
          return cellVal.trim() !== "";
        default:
          return true;
      }
    });
  }

  // 3. Apply sorting if specified
  if (options?.sortColumn && options.sortColumn.trim() !== "") {
    const sortCol = options.sortColumn.trim();
    const isDesc = options.sortDirection === "desc";

    result.sort((a, b) => {
      const valA = a[sortCol] ?? "";
      const valB = b[sortCol] ?? "";

      const numA = typeof valA === "number" ? valA : parseFloat(String(valA));
      const numB = typeof valB === "number" ? valB : parseFloat(String(valB));

      if (!isNaN(numA) && !isNaN(numB)) {
        return isDesc ? numB - numA : numA - numB;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return isDesc ? 1 : -1;
      if (strA > strB) return isDesc ? -1 : 1;
      return 0;
    });
  }

  // 4. Apply row limit
  if (options?.limitRows && options.limitRows > 0) {
    result = result.slice(0, options.limitRows);
  }

  return result;
}

/**
 * Utility function to convert array of objects into CSV formatted string.
 */
export function convertRowsToCsv(rows: Record<string, unknown>[]): string {
  if (!rows || rows.length === 0) return "";

  const headersSet = new Set<string>();
  rows.forEach((row) => {
    if (row && typeof row === "object") {
      Object.keys(row).forEach((k) => headersSet.add(k));
    }
  });

  const headers = Array.from(headersSet);
  if (headers.length === 0) return "";

  const escapeCsvCell = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    let str = typeof val === "object" ? JSON.stringify(val) : String(val);
    if (
      str.includes('"') ||
      str.includes(",") ||
      str.includes("\n") ||
      str.includes("\r")
    ) {
      str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCsvCell).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCsvCell(row[h])).join(",")
  );

  return [headerLine, ...dataLines].join("\n");
}

export function processInputData(
  content: string,
  options?: TransformOptions & { isJsonInput?: boolean }
): Record<string, unknown>[] {
  let isJson = options?.isJsonInput;

  if (isJson === undefined && content) {
    const trimmed = content.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        JSON.parse(trimmed);
        isJson = true;
      } catch {
        isJson = false;
      }
    } else {
      isJson = false;
    }
  }

  let rawRows;
  if (isJson) {
    rawRows = parseJsonToRows(content);
  } else {
    rawRows = parseCsvToRows(content, options);
  }

  return applyDataTransformations(rawRows, options);
}

export function parseJsonToRows(
  jsonContent: string
): Record<string, unknown>[] {
  if (!jsonContent || typeof jsonContent !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(jsonContent);

    if (Array.isArray(parsed)) {
      return parsed.map((item) =>
        typeof item === "object" && item !== null
          ? (item as Record<string, unknown>)
          : { value: item }
      );
    }

    if (typeof parsed === "object" && parsed !== null) {
      const possibleArrayKey = Object.keys(parsed).find((key) =>
        Array.isArray((parsed as Record<string, unknown>)[key])
      );

      if (possibleArrayKey) {
        const arr = (parsed as Record<string, unknown>)[
          possibleArrayKey
        ] as unknown[];
        return arr.map((item) =>
          typeof item === "object" && item !== null
            ? (item as Record<string, unknown>)
            : { value: item }
        );
      }

      return [parsed as Record<string, unknown>];
    }
  } catch (error) {
    console.error("Error parsing JSON content:", error);
  }

  return [];
}

export function parseCsvToRows(
  csvContent: string,
  options?: TransformOptions & { isJsonInput?: boolean }
): Record<string, unknown>[] {
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      // 1. Handle Escaped Quote khas CSV ("" atau '')
      if (inQuotes && char === quoteChar && nextChar === quoteChar) {
        current += char;
        i++;
        continue;
      }
      // 2. Handle Escaped Quote khas Programming (\" atau \')
      if (char === "\\" && (nextChar === '"' || nextChar === "'")) {
        current += nextChar;
        i++;
        continue;
      }
      // 3. Toggle state inQuotes (hanya jika menemukan quote pembuka/penutup yang cocok)
      if ((char === '"' || char === "'") && (!inQuotes || char === quoteChar)) {
        inQuotes = !inQuotes;
        quoteChar = inQuotes ? char : "";
      }
      // 4. Handle Pemisah Kolom (Koma) di luar quotes
      else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      }
      // 5. Karakter biasa
      else {
        current += char;
      }
    }

    result.push(current);

    return result.map((cell) => {
      let trimmed = cell.trim();

      if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ) {
        trimmed = trimmed.slice(1, -1);
      }

      return options?.trimWhitespace !== false ? trimmed.trim() : cell;
    });
  };

  const rows = [];
  const rawLines = csvContent.split(/\r?\n/);
  const lines = options?.removeEmptyRows
    ? rawLines.filter((l) => l.replaceAll(",", "").trim().length > 0)
    : rawLines;

  if (lines.length > 0) {
    const headers = parseLine(lines[0]);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line && !options?.removeEmptyRows) continue;
      const values = parseLine(line);
      if (
        values.length === 1 &&
        values[0] === "" &&
        !options?.removeEmptyRows
      ) {
        continue;
      }
      const rowObj: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        const key = header || `col_${index + 1}`;
        rowObj[key] = values[index] ?? "";
      });
      rows.push(rowObj);
    }
  }

  return rows;
}
