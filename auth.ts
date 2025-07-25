import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccountDoc } from "./database/account.model";
import { IUserDoc } from "./database/user.model";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub,
        Google,
        Credentials({
            async authorize(credentials) {
                const validatedFields = SignInSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const { data: existingAccount } =
                        (await api.accounts.getByProvider(
                            email
                        )) as ActionResponse<IAccountDoc>;

                    if (!existingAccount) return null;

                    const { data: existingUser } = (await api.users.getById(
                        existingAccount.userId.toString()
                    )) as ActionResponse<IUserDoc>;

                    if (!existingUser) return null;

                    if (
                        existingUser.bannedUntil &&
                        existingUser.bannedUntil > new Date()
                    ) {
                        throw new Error("AccountBanned");
                    }

                    const isValidPassword = await bcrypt.compare(
                        password,
                        existingAccount.password!
                    );

                    if (isValidPassword) {
                        return {
                            id: existingUser.id,
                            name: existingUser.name,
                            email: existingUser.email,
                            image: existingUser.image,
                            isAdmin: existingUser.isAdmin,
                        };
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            session.user.isAdmin = token.isAdmin as boolean;
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                const providerKey =
                    account.type === "credentials"
                        ? token.email!
                        : account.providerAccountId;
                const { data: acct } = (await api.accounts.getByProvider(
                    providerKey
                )) as ActionResponse<IAccountDoc>;
                if (acct?.userId) {
                    token.sub = acct.userId.toString();
                }
            }

            if (token.sub) {
                const { data: dbUser } = (await api.users.getById(
                    token.sub as string
                )) as ActionResponse<IUserDoc>;
                if (dbUser) token.isAdmin = dbUser.isAdmin ?? token.isAdmin;
            }

            return token;
        },
        async signIn({ user, profile, account }) {
            if (account?.type === "credentials") return true;
            if (!account || !user) return false;

            const { data: dbUser } = (await api.users.getByEmail(
                user.email!
            )) as ActionResponse<IUserDoc | null>;

            const bannedUntil = dbUser?.bannedUntil
                ? new Date(dbUser.bannedUntil)
                : null;

            if (bannedUntil && bannedUntil > new Date()) {
                throw new Error("AccountBanned");
            }

            const userInfo = {
                name: user.name!,
                email: user.email!,
                image: user.image!,
                username:
                    account.provider === "github"
                        ? (profile?.login as string)
                        : (user.name?.toLowerCase() as string),
            };

            const { success } = (await api.auth.oAuthSignIn({
                user: userInfo,
                provider: account.provider as "github" | "google",
                providerAccountId: account.providerAccountId,
            })) as ActionResponse;

            return success;
        },
    },
    secret: process.env.AUTH_SECRET,
});
