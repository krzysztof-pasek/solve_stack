import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import AdminNavLinks from "./AdminNavLinks";

const AdminMobileNavigation = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image
                    src="/icons/hamburger.svg"
                    width={36}
                    height={36}
                    alt="Menu"
                    className="invert-colors sm:hidden"
                />
            </SheetTrigger>
            <SheetContent
                side="left"
                className="background-light900_dark200 border-none p-5"
            >
                <SheetTitle className="hidden">Navigation</SheetTitle>
                <Link href="/" className="flex items-center gap-1">
                    <Image
                        src="/images/site-logo.svg"
                        width={23}
                        height={23}
                        alt="Logo"
                    />

                    <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 text-center">
                        Solve
                        <span className="text-primary-500">
                            Stack
                            <span className="text-admin-100">
                                {" "}
                                - Admin Panel
                            </span>
                        </span>
                    </p>
                </Link>

                <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
                    <SheetClose asChild>
                        <section className="flex h-full flex-col gap-6 pt-16">
                            <AdminNavLinks isMobileNav />
                        </section>
                    </SheetClose>

                    <div className="flex flex-col gap-3">
                        <SheetClose asChild>
                            <form
                                action={async () => {
                                    "use server";

                                    await signOut();
                                }}
                            >
                                <Button
                                    type="submit"
                                    className="base-medium w-fit !bg-transparent px-4 py-3"
                                >
                                    <LogOut className="size-5 text-black dark:text-white" />
                                    <span className="text-dark300_light900">
                                        Logout
                                    </span>
                                </Button>
                            </form>
                        </SheetClose>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AdminMobileNavigation;
