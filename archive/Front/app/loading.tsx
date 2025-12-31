export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-950 text-white flex items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="inline-block h-3 w-3 rounded-full bg-brand-500 animate-pulse" />
        <span className="inline-block h-3 w-3 rounded-full bg-brand-500 animate-pulse delay-150" />
        <span className="inline-block h-3 w-3 rounded-full bg-brand-500 animate-pulse delay-300" />
        <span className="text-sm text-gray-300">Carregando...</span>
      </div>
    </div>
  );
}
