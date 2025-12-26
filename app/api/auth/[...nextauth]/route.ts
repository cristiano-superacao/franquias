import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        username: { label: "Usuário", type: "text", placeholder: "admin" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // Exemplo: usuário/senha fixos. Substitua por consulta ao banco!
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "1", name: "Administrador", email: "admin@admin.com" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
});

export { handler as GET, handler as POST };
