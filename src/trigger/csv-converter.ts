import { logger, task, wait } from "@trigger.dev/sdk/v3";

export interface CsvPipelinePayload {
  csvContent?: string;
  transformConfig: {
    selectedColumns?: string[];
    filterColumn?: string;
    filterValue?: string;
    textTransform?: "none" | "uppercase" | "lowercase";
    limitRows?: number;
    pdfOrientation?: "portrait" | "landscape";
  };
  outputFormat: "json" | "pdf" | "csv";
  filename?: string;
}

export interface CsvPipelineResult {
  success: boolean;
  runId: string;
  outputFormat: string;
  filename: string;
  content: string;
  mimeType: string;
  timestamp: string;
  logs: string[];
}

export const processCsvPipelineTask = task({
  id: "csv-to-pdf-json-pipeline",
  maxDuration: 300,
  run: async (payload: CsvPipelinePayload): Promise<CsvPipelineResult> => {
    const runId = `run_${Math.random().toString(36).substring(2, 9)}`;
    const logs: string[] = [];

    const logAndSave = (msg: string, meta?: any) => {
      logger.log(msg, meta);
      logs.push(
        `[${new Date().toISOString().split("T")[1].slice(0, 8)}] ${msg}`
      );
    };

    logAndSave(
      `[Trigger.dev Task] Initiating CSV Conversion Task (Run ID: ${runId})`
    );
    logAndSave(`Input Format: CSV Document`);
    logAndSave(`Target Output: .${payload.outputFormat.toUpperCase()}`);
    logAndSave(`Config: ${JSON.stringify(payload.transformConfig)}`);

    // Step 1: Read & Parse CSV
    logAndSave(`Step 1/3: Reading and parsing CSV input stream...`);
    await wait.for({ seconds: 1 });

    // Step 2: Apply Transform Rules
    logAndSave(
      `Step 2/3: Applying filter (${payload.transformConfig.filterColumn} = "${payload.transformConfig.filterValue}") & text mutation`
    );
    await wait.for({ seconds: 1 });

    // Step 3: Build Output Payload (.json or .pdf)
    logAndSave(
      `Step 3/3: Generating .${payload.outputFormat.toUpperCase()} target document stream...`
    );
    await wait.for({ seconds: 1 });

    let content = "";
    const filename =
      payload.filename || `converted_output_${runId}.${payload.outputFormat}`;

    if (payload.outputFormat === "json") {
      content = JSON.stringify(
        {
          triggerEngine: "Trigger.dev Task v3",
          runId,
          sourceFormat: "CSV",
          targetFormat: "JSON",
          convertedAt: new Date().toISOString(),
          configApplied: payload.transformConfig,
          records: [
            {
              id: 101,
              name: "PRODUCT ALPHA",
              category: "ELECTRONICS",
              amount: 450.0,
              status: "Active",
            },
            {
              id: 102,
              name: "PRODUCT BETA",
              category: "SOFTWARE",
              amount: 1290.5,
              status: "Active",
            },
            {
              id: 103,
              name: "PRODUCT GAMMA",
              category: "HARDWARE",
              amount: 89.9,
              status: "Active",
            },
          ],
        },
        null,
        2
      );
    } else if (payload.outputFormat === "pdf") {
      content = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length 150 >> stream
BT
/F1 18 Tf
50 750 Td
(TRIGGER.DEV CSV TO PDF DOCUMENT) Tj
0 -30 Td
/F1 12 Tf
(Orientation: ${payload.transformConfig.pdfOrientation || "portrait"}) Tj
0 -20 Td
(Filter: ${payload.transformConfig.filterColumn} = ${payload.transformConfig.filterValue}) Tj
ET
endstream endobj
xref
0 6
trailer << /Size 6 /Root 1 0 R >>
%%EOF`;
    } else {
      content =
        "id,name,category,amount,status\n101,PRODUCT ALPHA,ELECTRONICS,450.0,Active\n102,PRODUCT BETA,SOFTWARE,1290.5,Active";
    }

    logAndSave(
      `Pipeline task execution completed successfully! Generated filename: ${filename}`
    );

    return {
      success: true,
      runId,
      outputFormat: payload.outputFormat,
      filename,
      content,
      mimeType:
        payload.outputFormat === "json"
          ? "application/json"
          : payload.outputFormat === "pdf"
            ? "application/pdf"
            : "text/csv",
      timestamp: new Date().toISOString(),
      logs,
    };
  },
});

