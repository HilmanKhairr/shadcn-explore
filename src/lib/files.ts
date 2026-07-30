import { ALLOWED_FILE_TYPES } from "@/constants/files";
import type { AllowedFileType, UnifiedFile } from "@/types/files";

export function getTypesFromExtensions(extString: string): AllowedFileType[] {
  if (!extString) return [];

  return extString
    .split(",")
    .map((ext) => ext.trim().toLowerCase().replace(".", ""))
    .map((ext) =>
      Object.values(ALLOWED_FILE_TYPES).find((mime) => mime.endsWith(ext))
    )
    .filter((mime): mime is AllowedFileType => Boolean(mime));
}

export function getFileName<T>(
  item: UnifiedFile<T>,
  getBeFileName?: (raw: T) => string
): string {
  if (item.file) {
    return item.file.name;
  }
  if (item.rawResponse && getBeFileName) {
    return getBeFileName(item.rawResponse);
  }
  return "Untitled";
}

export function getFileSize<T>(
  item: UnifiedFile<T>,
  getBeFileSize?: (raw: T) => number
): number {
  if (item.file) {
    return item.file.size;
  }
  if (item.rawResponse && getBeFileSize) {
    return getBeFileSize(item.rawResponse);
  }
  return 0;
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "application/json"
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
