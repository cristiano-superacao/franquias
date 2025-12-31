// Sistema de autenticação simplificado para static export
// Usa localStorage para persistir sessão

export interface User {
  username: string;
  role: string;
}

const MOCK_USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "admin@vendacerta.com", password: "admin123", role: "admin" },
  { username: "gerente", password: "gerente123", role: "manager" },
];

function normalizeLogin(input: string): string {
  return input.trim().toLowerCase();
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateCredentials(username: string, password: string): { ok: boolean; message?: string } {
  const u = username.trim();
  const p = password.trim();

  if (!u) return { ok: false, message: "Informe seu usuário ou email." };
  if (!p) return { ok: false, message: "Informe sua senha." };
  if (p.length < 6) return { ok: false, message: "A senha deve ter pelo menos 6 caracteres." };
  if (u.includes("@") && !isEmail(u)) return { ok: false, message: "Email inválido." };
  return { ok: true };
}

export function login(username: string, password: string): User | null {
  const normalized = normalizeLogin(username);
  const user = MOCK_USERS.find(
    (u) => normalizeLogin(u.username) === normalized && u.password === password
  );
  
  if (user) {
    const session = { username: user.username, role: user.role };
    if (typeof window !== "undefined") {
      localStorage.setItem("session", JSON.stringify(session));
    }
    return session;
  }
  
  return null;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("session");
  }
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem("session");
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function requireAuth(): User {
  const session = getSession();
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Não autenticado");
  }
  return session;
}

// Registro de usuários (mock/localStorage)
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

function getStoredUsers(): Array<{ username: string; password: string; role: string }> {
  if (typeof window === "undefined") return [...MOCK_USERS];
  try {
    const raw = localStorage.getItem("users");
    if (!raw) return [...MOCK_USERS];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [...MOCK_USERS];
  } catch {
    return [...MOCK_USERS];
  }
}

function setStoredUsers(users: Array<{ username: string; password: string; role: string }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("users", JSON.stringify(users));
}

export function validateRegistration(input: RegisterInput): { ok: boolean; message?: string } {
  if (!input.name.trim()) return { ok: false, message: "Informe seu nome completo." };
  if (!isEmail(input.email)) return { ok: false, message: "Email inválido." };
  if (input.password.trim().length < 6) return { ok: false, message: "A senha deve ter pelo menos 6 caracteres." };
  const users = getStoredUsers();
  const exists = users.some(u => normalizeLogin(u.username) === normalizeLogin(input.email));
  if (exists) return { ok: false, message: "Já existe uma conta com este email." };
  return { ok: true };
}

export function registerUser(input: RegisterInput): User | null {
  const valid = validateRegistration(input);
  if (!valid.ok) return null;
  const users = getStoredUsers();
  users.push({ username: input.email, password: input.password, role: "user" });
  setStoredUsers(users);
  const session = { username: input.email, role: "user" };
  if (typeof window !== "undefined") localStorage.setItem("session", JSON.stringify(session));
  return session;
}
