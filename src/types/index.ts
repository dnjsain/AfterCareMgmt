export type Role = "HOSPITAL" | "PATIENT";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  hospitalId?: string;
  patientId?: string;
}

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }

  interface User extends SessionUser {}
}
