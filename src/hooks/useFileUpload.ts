import { useCallback, useEffect, useRef, useState } from "react";

export type FileStatus = "idle" | "uploading" | "success" | "error";

export interface UnifiedFile<T = unknown> {
  id: string;
  status: FileStatus;
  file?: File;
  previewUrl?: string;
  progress?: number;
  error?: string;
  rawResponse?: T;
}

export type AllowedFileType =
  | (typeof ALLOWED_FILE_TYPES)[keyof typeof ALLOWED_FILE_TYPES]
  | (string & {});

export interface FileValidationError {
  file: File;
  reason: "size" | "type";
  message: string;
}

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

  // Archives
  ZIP: "application/zip",
  RAR: "application/x-rar-compressed",
} as const;

export const getAcceptAttribute = (types: string[]): string => {
  return types.join(",");
};

interface UseFileUploadOptions<T> {
  mode?: "immediate" | "deferred";
  multiple?: boolean;
  uploadFn?: (
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<T>;
  getBeFileName?: (raw: T) => string;
  getBeFileSize?: (raw: T) => number;
}

export const useFileUpload = <T>({
  mode = "deferred",
  multiple = false,
  uploadFn,
  getBeFileName,
  getBeFileSize,
}: UseFileUploadOptions<T> = {}) => {
  const createdUrlsRef = useRef<Set<string>>(new Set());
  const [files, setFiles] = useState<UnifiedFile<T>[]>([]);

  const getFileName = useCallback(
    (item: UnifiedFile<T>): string => {
      if (item.file) {
        return item.file.name;
      }

      if (item.rawResponse && getBeFileName) {
        return getBeFileName(item.rawResponse);
      }

      return "Untitled";
    },
    [getBeFileName]
  );

  const getFileSize = useCallback(
    (item: UnifiedFile<T>): number => {
      if (item.file) {
        return item.file.size;
      }

      if (item.rawResponse && getBeFileSize) {
        return getBeFileSize(item.rawResponse);
      }

      return 0;
    },
    [getBeFileSize]
  );

  const validateFile = useCallback(
    (
      file: File,
      maxSize?: number,
      allowedTypes?: AllowedFileType[]
    ): FileValidationError | null => {
      if (maxSize && file.size > maxSize) {
        const maxMb = (maxSize / (1024 * 1024)).toFixed(2);
        return {
          file,
          reason: "size",
          message: `Ukuran file melebihi batas maksimum (${maxMb} MB).`,
        };
      }

      if (allowedTypes && allowedTypes.length > 0) {
        const isTypeAllowed = allowedTypes.some((type) => {
          if (type.endsWith("/*")) {
            const baseType = type.split("/")[0];
            return file.type.startsWith(`${baseType}/`);
          }
          return file.type === type;
        });

        if (!isTypeAllowed) {
          return {
            file,
            reason: "type",
            message: `Tipe file "${file.type || "<unknown>"}" tidak didukung.`,
          };
        }
      }

      return null;
    },
    []
  );

  const updateFile = useCallback(
    (id: string, patch: Partial<UnifiedFile<T>>) => {
      setFiles((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    []
  );

  const addFiles = useCallback(
    async (
      newFiles: FileList,
      options?: {
        maxSize?: number;
        allowedTypes?: AllowedFileType[];
        onValidationError?: (errors: FileValidationError[]) => void;
      }
    ): Promise<UnifiedFile<T>[]> => {
      const fileListArray = Array.from(newFiles);
      const filesToProcess = multiple
        ? fileListArray
        : fileListArray.slice(0, 1);

      const validationErrors: FileValidationError[] = [];
      const formatted: UnifiedFile<T>[] = [];

      for (const file of filesToProcess) {
        const validationError = validateFile(
          file,
          options?.maxSize,
          options?.allowedTypes
        );

        if (validationError) {
          validationErrors.push(validationError);
          formatted.push({
            id: crypto.randomUUID(),
            file,
            status: "error",
            progress: 0,
            error: validationError.message,
          });
        } else {
          const previewUrl = URL.createObjectURL(file);
          createdUrlsRef.current.add(previewUrl);

          formatted.push({
            id: crypto.randomUUID(),
            file,
            status: mode === "immediate" && uploadFn ? "uploading" : "idle",
            previewUrl,
            progress: 0,
          });
        }
      }

      if (validationErrors.length > 0 && options?.onValidationError) {
        options?.onValidationError(validationErrors);
      }

      setFiles((prev) => {
        if (multiple) {
          return [...prev, ...formatted];
        }

        prev.forEach((item) => {
          if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
            createdUrlsRef.current.delete(item.previewUrl);
          }
        });

        return formatted;
      });

      if (mode === "immediate" && uploadFn) {
        const validItemsToUpload = formatted.filter(
          (item) => item.status === "uploading"
        );

        await Promise.allSettled(
          validItemsToUpload.map(async (item) => {
            if (!item.file) return;

            try {
              const response = await uploadFn(item.file, (progress) => {
                updateFile(item.id, { progress });
              });
              updateFile(item.id, {
                status: "success",
                progress: 100,
                rawResponse: response,
              });
              // Update local formatted array status
              const target = formatted.find((f) => f.id === item.id);
              if (target) {
                target.status = "success";
                target.rawResponse = response;
              }
            } catch (error) {
              console.error("Error uploading file: ", error);
              const errorMsg =
                error instanceof Error ? error.message : "Failed to upload file";
              updateFile(item.id, {
                status: "error",
                error: errorMsg,
              });
              const target = formatted.find((f) => f.id === item.id);
              if (target) {
                target.status = "error";
                target.error = errorMsg;
              }
            }
          })
        );
      }

      return formatted;
    },
    [mode, multiple, uploadFn, updateFile, validateFile]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
        createdUrlsRef.current.delete(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  useEffect(() => {
    const urls = createdUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  return {
    files,
    getFileName,
    getFileSize,
    addFiles,
    updateFile,
    removeFile,
    setFiles,
  };
};
