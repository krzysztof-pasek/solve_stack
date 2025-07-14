import { ReactNode } from "react";

import AdminSidebar from "@/components/navigation/AdminSidebar";
import AdminNavbar from "@/components/navigation/navbar/adminNav/AdminNavbar";

import AdminGuard from "./AdminGuard";

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <AdminGuard>
            <main className="background-light850_dark100 realtive">
                <AdminNavbar />

                <div className="flex">
                    <AdminSidebar />

                    <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
                        <div className="mx-auto w-full max-w-5xl">
                            {children}
                        </div>
                    </section>
                </div>
            </main>
        </AdminGuard>
    );
};

export default RootLayout;
