import type { FileDetails } from "./types";

/**
 * Files API Queries
 */

/**
 * Get a fresh signed URL for a file.
 * GET /files/:id
 */
export async function getFileDetails(fileId: string): Promise<FileDetails> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.get<FileDetails>(`/files/${fileId}`);
  return response.data;
}

/**
 * Downloads a file from the server by fetching a fresh signed URL first.
 */
export async function downloadFile(fileId: string, filename: string): Promise<void> {
  try {
    const { url } = await getFileDetails(fileId);

    // Create a temporary link and click it to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank"; // Open in new tab if browser doesn't force download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Failed to download file:", error);
    throw error;
  }
}
