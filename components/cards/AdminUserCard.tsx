"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ROUTES from "@/constants/routes";
import {
    banUser,
    makeAdmin,
    revokeAdmin,
    unbanUser,
} from "@/lib/actions/user.action";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import UserAvatar from "../UserAvatar";

const AdminUserCard = ({
    _id,
    name,
    image,
    username,
    isAdmin,
    bannedUntil,
}: User) => {
    const [banDays, setBanDays] = useState(30);

    const isBanned = bannedUntil && new Date(bannedUntil) > new Date();

    const handleMakeAdmin = async () => {
        const { success } = await makeAdmin({
            params: { userId: _id },
        });

        if (success) {
            toast("User has been made an admin successfully");
        } else {
            toast("Failed to make user an admin");
        }
    };

    const handleBanUser = async () => {
        const { success, message } = await banUser({
            params: { userId: _id },
            options: { durationDays: banDays },
        });
        toast(success ? "User banned" : (message ?? "Ban failed"));
    };

    const handleUnbanUser = async () => {
        const { success } = await unbanUser({ params: { userId: _id } });
        toast(success ? "User unbanned" : "Failed to un-ban");
    };

    const handleRevokeAdmin = async () => {
        const { success, message } = await revokeAdmin({
            params: { userId: _id },
        });
        toast(
            success ? "Admin rights revoked" : (message ?? "Failed to revoke")
        );
    };

    return (
        <div className="shadow-light100_darknone w-full">
            <article className="background-light900_dark200 light-border flex gap-4 items-center w-full rounded-2xl border py-4 px-8">
                <UserAvatar
                    id={_id}
                    name={name}
                    imageUrl={image}
                    className="size-[50px] rounded-full object-cover"
                    fallbackClassName="text-3xl tracking-widest"
                />

                <div className="flex justify-between items-center w-full">
                    <Link href={ROUTES.PROFILE(_id)}>
                        <div className=" text-center flex gap-2 items-center">
                            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
                                {name}
                            </h3>
                            <p className="body-regular text-dark500_light500">
                                @{username}
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className={`size-[10px] rounded-full ${
                                    isBanned ? "bg-red-500" : "bg-green-500"
                                }`}
                            ></span>
                            <p>
                                {isBanned ? "Banned" : "Active"} |{" "}
                                <span className="primary-text-gradient">
                                    {isAdmin ? "Admin" : "User"}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Image
                                                src="/icons/makeAdmin.svg"
                                                alt="Make admin"
                                                width={20}
                                                height={20}
                                                className="cursor-pointer dark:invert dark:brightness-0"
                                            />
                                        </DialogTrigger>
                                    </TooltipTrigger>

                                    <TooltipContent side="bottom">
                                        <p>
                                            {isAdmin
                                                ? "Revoke admin"
                                                : "Make admin"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {isAdmin
                                                ? "Are you sure you want to revoke admin privileges from this user?"
                                                : "Are you sure you want to make this user an admin?"}
                                        </DialogTitle>
                                        <DialogDescription className="mt-2">
                                            {isAdmin
                                                ? "This action will remove admin privileges from the user, preventing them from accessing admin features."
                                                : "This action will grant the user admin privileges, allowing them to access admin features."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            onClick={
                                                isAdmin
                                                    ? handleRevokeAdmin
                                                    : handleMakeAdmin
                                            }
                                            className="w-full bg-primary-500 mt-4"
                                        >
                                            {isAdmin
                                                ? "Revoke Admin"
                                                : "Make Admin"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Image
                                                src="/icons/banIcon.svg"
                                                alt="Ban user"
                                                width={20}
                                                height={20}
                                                className="cursor-pointer"
                                            />
                                        </DialogTrigger>
                                    </TooltipTrigger>

                                    <TooltipContent side="bottom">
                                        <p>
                                            {isBanned
                                                ? "Unban user"
                                                : "Ban user"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Are you sure you want to ban this
                                            user?
                                        </DialogTitle>
                                        <DialogDescription className="mt-2">
                                            This action will prevent the user
                                            from accessing their account and
                                            participating in the platform.
                                            Please confirm if you wish to
                                            proceed.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="flex">
                                        {!isBanned && (
                                            <div className="flex flex-col ">
                                                <p className="subtle-regular text-dark500_light500">
                                                    Ban Length in days, (put 0
                                                    for permanent ban)
                                                </p>

                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={banDays}
                                                    onChange={(e) =>
                                                        setBanDays(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    placeholder="Ban length in days"
                                                    className="mt-1 flex-1"
                                                />
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            onClick={
                                                isBanned
                                                    ? handleUnbanUser
                                                    : handleBanUser
                                            }
                                            className="flex-1 bg-primary-500 mt-4"
                                        >
                                            {isBanned
                                                ? "Unban User"
                                                : "Ban User"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default AdminUserCard;
