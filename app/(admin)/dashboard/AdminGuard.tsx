import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

import { auth } from "@/auth";

export default async function AdminGuard({ children }: PropsWithChildren) {
    const session = await auth();

    if (!session?.user?.isAdmin) notFound();

    return <>{children}</>;
}
