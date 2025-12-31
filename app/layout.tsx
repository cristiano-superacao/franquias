import "../styles/globals.css";
import { ToastProvider } from "../components/Toast";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Sistema de Franquias - Dashboard",
  description: "Sistema completo de gerenciamento de franquias com KPIs, estoque, caixa e comissões",
  keywords: "franquias, gestão, dashboard, kpis, estoque, caixa",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-950 text-white antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
