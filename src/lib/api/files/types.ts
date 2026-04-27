export interface InitiateUploadPayload {
  originalName: string;
  mimeType: string;
  size: number;
  resourceType?: string;
}

export interface InitiateUploadResponse {
  fileId: string;
  storageKey: string;
  uploadUrl: string;
}

export interface FileDetails {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  visibility: "private" | "public";
  expiresIn?: number;
}

/**
 * @deprecated Use FileDetails instead
 */
export interface FileUploadResponse {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
}
