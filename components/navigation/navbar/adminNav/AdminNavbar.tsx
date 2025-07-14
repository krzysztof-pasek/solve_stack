import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";

import Theme from "../Theme";
import AdminMobileNavigation from "./AdminMobileNavigation";

const AdminNavbar = async () => {
    const session = await auth();

    return (
        <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 shadow-light-300 dark:shadow-none sm:px-12 gap-5">
            <Link href={ROUTES.HOME} className="flex items-center gap-1">
                <Image
                    src="/images/site-logo.svg"
                    alt="Logo"
                    width={23}
                    height={23}
                />
                <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
                    Solve
                    <span className="text-primary-500">
                        Stack
                        <span className="text-admin-100"> - Admin Panel</span>
                    </span>
                </p>
            </Link>

            <div className="flex-between gap-5">
                <Theme />

                {session?.user?.id && (
                    <UserAvatar
                        id={session.user.id}
                        name={session.user.name!}
                        imageUrl={session.user?.image}
                    />
                )}

                <AdminMobileNavigation />
            </div>
        </nav>
    );
};

export default AdminNavbar;
