import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const email = user.email!
          const name = user.name || "User"
          const profilePicture = user.image || null

          // 1. Cek apakah user sudah ada di database (sebagai User/Client/Freelancer)
          let existingUser = await prisma.user.findUnique({
            where: { email }
          })

          if (!existingUser) {
            // Jika belum ada, kita buat akun baru dengan role default 'client'
            existingUser = await prisma.user.create({
              data: {
                email,
                name,
                profilePicture,
                role: 'client',
                password: '', // Dummy password karena Prisma Client belum di-generate ulang
              }
            })
          }

          // 2. Set custom cookie session persis seperti login manual kita
          const cookieStore = await cookies();
          cookieStore.set('pushaja_session', JSON.stringify({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 hari
            path: '/',
          });

          return true // Izinkan sign-in berhasil
        } catch (error: any) {
          console.error("Error during Google sign-in:", error)
          import('fs').then(fs => fs.writeFileSync('nextauth_error.log', String(error) + '\n' + (error.stack || '')));
          return false
        }
      }
      return true
    },
    // Jika kita menggunakan JWT NextAuth untuk session
    async jwt({ token, user }) {
      return token
    },
    async session({ session, token }) {
      return session
    }
  },
  pages: {
    signIn: '/login', // Arahkan ke halaman login custom kita jika perlu
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
