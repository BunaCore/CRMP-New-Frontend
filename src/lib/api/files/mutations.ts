import axios from "axios";

import type { InitiateUploadPayload, InitiateUploadResponse } from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
}

/**
 * Initiate a file upload.
 * POST /files/upload
 */
export async function initiateUpload(payload: InitiateUploadPayload): Promise<InitiateUploadResponse> {
  const { apiClient } = await import("@/lib/api/client");
  const response = await apiClient.post<InitiateUploadResponse>("/files/upload", payload);
  return response.data;
}

/**
 * Initiate a guest file upload without requiring auth.
 * POST /files/guest-presign
 */
export async function initiateGuestUpload(payload: InitiateUploadPayload): Promise<InitiateUploadResponse> {
  const response = await axios.post<InitiateUploadResponse>(`${getApiBaseUrl()}/files/guest-presign`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

/**
 * Upload a file directly to a signed S3 URL.
 * PUT {uploadUrl}
 */
export async function uploadFileToUrl(uploadUrl: string, file: File): Promise<void> {
  // Use raw axios here to avoid the interceptors from apiClient (which might add Auth headers)
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
}

/**
 * High-level function to handle the full upload flow:
 * 1. Initiate upload
 * 2. PUT to S3
 * 3. Return fileId
 */
export async function performFullUpload(file: File, resourceType?: string): Promise<string> {
  const { fileId, uploadUrl } = await initiateUpload({
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    resourceType,
  });

  await uploadFileToUrl(uploadUrl, file);

  return fileId;
}

/**
 * Full guest upload flow for public registration.
 */
export async function performGuestFullUpload(file: File, resourceType?: string): Promise<string> {
  const { fileId, uploadUrl } = await initiateGuestUpload({
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    resourceType,
  });

  await uploadFileToUrl(uploadUrl, file);

  return fileId;
}

/**
 * @deprecated Use performFullUpload instead for the new flow.
 */
export async function uploadFile(file: File): Promise<{ fileId: string }> {
  const fileId = await performFullUpload(file);
  return { fileId };
}
