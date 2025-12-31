export type Role = "super_admin" | "company_admin" | "franchise_user" | "admin" | "manager";

export interface User {
  username: string;
  role: Role;
  empresa_id?: number;
  loja_id?: number;
}
