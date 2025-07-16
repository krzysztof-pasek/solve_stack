import { NextResponse } from "next/server";

import { auth } from "@/auth";

export const middleware = auth(async (req) => {
    const { nextUrl, auth: session } = req;
    const pathname = nextUrl.pathname;

    if (pathname.startsWith("/dashboard") && !session?.user?.isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
    }
});

export const config = { matcher: ["/dashboard/:path*"] };
