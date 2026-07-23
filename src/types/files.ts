import type { ALLOWED_FILE_TYPES } from "@/constants/files";

export type FileStatus = "idle" | "uploading" | "success" | "error";

export interface UnifiedFile<T = unknown> {
  id: string;
  status: FileStatus;
  file: File;
  previewUrl?: string;
  progress?: number;
  error?: string;
  rawResponse?: T;
}

export type AllowedFileType =
  (typeof ALLOWED_FILE_TYPES)[keyof typeof ALLOWED_FILE_TYPES];
