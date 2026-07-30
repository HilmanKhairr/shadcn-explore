export const ALLOWED_FILE_TYPES = {
  // Images
  JPEG: "image/jpeg",
  PNG: "image/png",
  GIF: "image/gif",
  WEBP: "image/webp",
  SVG: "image/svg+xml",
  ALL_IMAGES: "image/*",

  // Documents
  PDF: "application/pdf",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  CSV: "text/csv",

  JSON: "application/json",

  // Archives
  ZIP: "application/zip",
  RAR: "application/x-rar-compressed",
} as const;
