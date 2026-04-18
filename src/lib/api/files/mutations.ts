import type { FileUploadResponse } from "./types";

/**
 * Upload a file to the system.
 * POST /files/upload
 */
export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<FileUploadResponse>("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
