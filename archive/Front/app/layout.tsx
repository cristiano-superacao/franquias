import "../styles/globals.css";
import { ToastProvider } from "../components/Toast";
import AppHeader from "../components/AppHeader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-surface-950 text-white">
        {/* Link de acessibilidade para pular direto ao conteúdo */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-surface-900 focus:text-white focus:px-3 focus:py-2 focus:rounded">
          Pular para o conteúdo
        </a>
        <AppHeader />
        <ToastProvider>
          <main id="main" className="min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
