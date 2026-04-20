/**
 * Files API Queries
 */

/**
 * Downloads a file from the server by file ID.
 * Returns a blob URL that can be used to download the file directly in the browser.
 */
export async function downloadFile(fileId: string, filename: string): Promise<void> {
  const { apiClient } = await import("@/lib/api/client");

  // Need to specify blob response type to handle binary data correctly
  const response = await apiClient.get(`/files/${fileId}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // the browser will enforce the downloaded filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}
