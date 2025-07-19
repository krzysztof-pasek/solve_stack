"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants/links";
import { cn } from "@/lib/utils";

type Props = { isMobileNav?: boolean; userId?: string };

const NavLinks = ({ isMobileNav = false, userId }: Props) => {
    const pathname = usePathname();

    return (
        <>
            {sidebarLinks.map((item) => {
                const route =
                    item.route === "/profile" && userId
                        ? `/profile/${userId}`
                        : item.route;

                const isActive =
                    (pathname.includes(route) && route.length > 1) ||
                    pathname === route;

                const linkEl = (
                    <Link
                        key={`${item.label}-${route}`}
                        href={route}
                        className={cn(
                            isActive
                                ? "primary-gradient rounded-lg text-light-900"
                                : "text-dark300_light900",
                            "flex items-center justify-start gap-4 bg-transparent p-4"
                        )}
                    >
                        <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            className={cn({ "invert-colors": !isActive })}
                        />
                        <p
                            className={cn(
                                isActive ? "base-bold" : "base-medium",
                                !isMobileNav && "max-lg:hidden"
                            )}
                        >
                            {item.label}
                        </p>
                    </Link>
                );

                return isMobileNav ? (
                    <SheetClose asChild key={route}>
                        {linkEl}
                    </SheetClose>
                ) : (
                    <React.Fragment key={route}>{linkEl}</React.Fragment>
                );
            })}
        </>
    );
};

export default NavLinks;
