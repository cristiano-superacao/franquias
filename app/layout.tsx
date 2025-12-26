import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "../components/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-950 text-white">
        <SessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
