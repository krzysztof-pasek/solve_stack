"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SheetClose } from "@/components/ui/sheet";
import { adminSidebarLinks } from "@/constants/links";
import { cn } from "@/lib/utils";

const AdminNavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
    const pathname = usePathname();

    return (
        <>
            {adminSidebarLinks.map((item) => {
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                const linkClass = cn(
                    isActive
                        ? "primary-gradient rounded-lg text-light-900"
                        : "text-dark300_light900",
                    "flex items-center gap-4 p-4"
                );

                const Icon = item.icon;

                const LinkComponent = (
                    <Link
                        href={item.href}
                        className={linkClass}
                        key={item.label}
                    >
                        <Icon
                            size={20}
                            className={cn({ "invert-colors": isActive })}
                        />
                        <span
                            className={cn(
                                "text-base",
                                isActive ? "font-bold" : "font-medium"
                            )}
                        >
                            {item.label}
                        </span>
                    </Link>
                );

                return isMobileNav ? (
                    <SheetClose asChild key={item.href}>
                        {LinkComponent}
                    </SheetClose>
                ) : (
                    <div key={item.href}>{LinkComponent}</div>
                );
            })}
        </>
    );
};

export default AdminNavLinks;
