import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToast } from "../../components/Toast";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password
    });
    setLoading(false);
    if (res?.error) showToast("Usuário ou senha inválidos", "error");
    if (res?.ok && !res.error) window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-6 border border-gray-800">
        <h1 className="text-2xl font-bold text-emerald-400 text-center">Acesso ao Sistema</h1>
        <label className="flex flex-col gap-2 text-gray-200">
          Usuário
          <input
            type="text"
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-emerald-400 transition-all duration-300 text-white"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            aria-label="Usuário"
          />
        </label>
        <label className="flex flex-col gap-2 text-gray-200">
          Senha
          <input
            type="password"
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-emerald-400 transition-all duration-300 text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-label="Senha"
          />
        </label>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-60"
          disabled={loading}
          aria-label="Entrar"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
