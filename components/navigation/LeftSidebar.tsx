import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";
import { Button } from "../ui/button";

const LeftSidebar = async () => {
    const session = await auth();
    const userId = session?.user?.id;
    const isAdmin = session?.user?.isAdmin;

    const btnClasses =
        "small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none hover:bg-primary-500/20 dark:hover:bg-primary-500/50 cursor-pointer";
    const btnClasses2 =
        "small-medium btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none hover:bg-primary-500/20 dark:hover:bg-primary-500/50 cursor-pointer";

    return (
        <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
            <div className="flex flex-1 flex-col gap-6">
                <NavLinks userId={userId} />
            </div>
            <div className="flex flex-col gap-3">
                {userId ? (
                    <>
                        {isAdmin && (
                            <Button
                                className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
                                asChild
                            >
                                <Link href="/dashboard">Admin Dashboard</Link>
                            </Button>
                        )}
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
                    </>
                ) : (
                    <>
                        <Button className={btnClasses} asChild>
                            <Link href={ROUTES.SIGN_IN}>
                                <Image
                                    src="/icons/account.svg"
                                    alt="Account"
                                    width={20}
                                    height={20}
                                    className="invert-colors lg:hidden"
                                />
                                <span className="primary-text-gradient max-lg:hidden">
                                    Log In
                                </span>
                            </Link>
                        </Button>

                        <Button className={btnClasses2} asChild>
                            <Link href={ROUTES.SIGN_UP}>
                                <Image
                                    src="/icons/sign-up.svg"
                                    alt="Account"
                                    width={20}
                                    height={20}
                                    className="invert-colors lg:hidden"
                                />
                                <span className="primary-text-gradient max-lg:hidden">
                                    Sign Up
                                </span>
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
};

export default LeftSidebar;
