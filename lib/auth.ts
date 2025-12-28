// Sistema de autenticação simplificado para static export
// Usa localStorage para persistir sessão

export interface User {
  username: string;
  role: string;
}

const MOCK_USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "gerente", password: "gerente123", role: "manager" },
];

export function login(username: string, password: string): User | null {
  const user = MOCK_USERS.find(
    u => u.username === username && u.password === password
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
