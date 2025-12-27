import "../styles/globals.css";
import { ToastProvider } from "../components/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-950 text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
