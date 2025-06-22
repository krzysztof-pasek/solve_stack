import Image from "next/image";
import Link from "next/link";
import React from "react";

import MobileNavigation from "./MobileNavigation";
import Theme from "./Theme";

const Navbar = () => {
    return (
        <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 shadow-light-300 dark:shadow-none sm:px-12 gap-5">
            <Link href="/" className="flex items-center gap-1">
                <Image
                    src="/images/site-logo.svg"
                    alt="Logo"
                    width={23}
                    height={23}
                />
                <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
                    Solve<span className="text-primary-500">Stack</span>
                </p>
            </Link>

            <p>Global search</p>

            <div className="flex-between gap-5">
                <Theme />

                <MobileNavigation />
            </div>
        </nav>
    );
};

export default Navbar;
