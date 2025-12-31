import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-14 w-14 rounded-lg mb-4" style={{ backgroundColor: "#CCE3DE" }} />
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-gray-400">
          O endereço acessado não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="inline-block px-4 py-2 rounded-lg border border-gray-800 bg-surface-900 hover:bg-surface-850">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
