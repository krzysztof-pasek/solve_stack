import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

import { signOut } from "@/auth";
import ROUTES from "@/constants/routes";

import { Button } from "../ui/button";
import AdminNavLinks from "./navbar/adminNav/AdminNavLinks";

const AdminSidebar = () => {
    return (
        <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
            <div className="flex flex-1 flex-col gap-6">
                <AdminNavLinks />
            </div>
            <div className="flex flex-col gap-3">
                <Button
                    className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
                    asChild
                >
                    <Link href={ROUTES.HOME}>Exit Dashboard</Link>
                </Button>

                <form
                    action={async () => {
                        "use server";

                        await signOut();
                    }}
                >
                    <Button
                        type="submit"
                        className="base-medium w-fit !bg-transparent px-4 py-3 cursor-pointer mt-4"
                    >
                        <LogOut className="size-5 text-black dark:text-white" />
                        <span className="text-dark300_light900 max-lg:hidden">
                            Logout
                        </span>
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default AdminSidebar;
