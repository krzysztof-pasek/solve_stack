import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { IUserDoc } from "./database/user.model";
import { unbanUser } from "./lib/actions/user.action";
import { api } from "./lib/api";

export const middleware = auth(async (req) => {
    const { nextUrl, auth: session } = req;
    const pathname = nextUrl.pathname;

    if (pathname.startsWith("/dashboard") && !session?.user?.isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (session?.user?.id) {
        const { data: currentUser } = (await api.users.getById(
            session.user.id
        )) as ActionResponse<IUserDoc>;

        if (currentUser?.bannedUntil && currentUser.bannedUntil > new Date()) {
            return NextResponse.redirect(new URL("/banned", req.url));
        }

        if (currentUser?.bannedUntil && currentUser.bannedUntil <= new Date()) {
            await unbanUser({ params: { userId: String(currentUser._id) } });
        }
    }
});

export const config = { matcher: ["/dashboard/:path*"] };
