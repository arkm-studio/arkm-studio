// // src/config/auth.ts
// import NextAuth, { NextAuthConfig } from "next-auth";
// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import { createClient } from "@supabase/supabase-js";

// // Crear el cliente de Supabase
// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_KEY!;
// const supabase = createClient(supabaseUrl, supabaseKey);

// export const config: NextAuthConfig = {
//   secret: process.env.AUTH_SECRET!,
//   providers: [
//     // Proveedor de Google
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     // Proveedor de Credenciales (Email/Password)
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Asegurarse de que `credentials` tiene el tipo adecuado
//         const email = (credentials?.email as string) || ""; // Aseguramos que sea un string
//         const password = (credentials?.password as string) || ""; // Aseguramos que sea un string

//         // Verificar el usuario con Supabase
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });

//         // Verificar si hubo un error y lanzarlo si es necesario
//         if (error) {
//           throw new Error("Invalid email or password");
//         }

//         // Aseguramos que los valores son del tipo esperado
//         const user = data.user;

//         // Si la autenticación es exitosa, devolver los datos del usuario
//         return {
//           id: user?.id || "",
//           email: user?.email || "",
//           name: user?.user_metadata?.full_name || "Unknown User",
//         };
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error",
//   },
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // If attempting to redirect to the base URL, always go to dashboard
//       if (url === baseUrl) {
//         return `${baseUrl}/dashboard`;
//       }

//       // If the URL starts with the base URL, use it directly
//       if (url.startsWith(baseUrl)) {
//         return url;
//       }

//       // Default fallback
//       return baseUrl;
//     },

//     // Callback para manejar el JWT
//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         token.id = profile.id;
//         token.email = profile.email;
//         token.name = profile.name;
//       }
//       return token;
//     },

//     // Callback para manejar la sesión
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.email = token.email as string;
//         session.user.name = token.name as string;
//       }
//       return session;
//     },
//   },
//   debug: process.env.NODE_ENV === "development",
// };

// export const { auth, handlers } = NextAuth(config);
