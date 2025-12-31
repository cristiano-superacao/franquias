import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona a raiz para o dashboard para evitar 404
  redirect("/dashboard");
}
