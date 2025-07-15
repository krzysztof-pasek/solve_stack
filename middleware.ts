import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { IUserDoc } from "./database/user.model";
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
    }
});

export const config = { matcher: ["/dashboard/:path*"] };
