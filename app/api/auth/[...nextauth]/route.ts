
import { checkPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { User } from "@/prisma/generated/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials?.username || '',
                    }
                })
                if (!user) {
                    return null
                }
                const passwordMatch = checkPassword(credentials?.password || '', user.passwordHash)
                if (!passwordMatch) {
                    return null
                }

                return {
                    id: user.id,
                    username: user.username,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
                token.username = user.username
            }
            return token
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id
                session.user.username = token.username
            }
            return session
        }
    },
    pages: {
        signIn: '/login'
    }
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
