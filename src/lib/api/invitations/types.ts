export interface Invitation {
  email: string;
  roleName: string;
  expiresAt: string; // ISO
}

export interface AcceptInvitationPayload {
  token: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  universityId?: string;
}
