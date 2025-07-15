"use client";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

import { reportQuestion } from "@/lib/actions/question.action";

import {
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

const ReportAction = ({ questionId }: { questionId: string }) => {
    const handleReport = async () => {
        try {
            await reportQuestion({ questionId });
            toast.success("Report sent!");
        } catch (error) {
            if (error && typeof error === "object" && "message" in error) {
                toast.error((error as { message: string }).message);
            } else {
                toast.error("Something went wrong");
            }
        }
    };
    return (
        <div className={`flex items-center justify-end gap-3 max-sm:w-full`}>
            <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer">
                    <Image
                        src="/icons/flag.svg"
                        alt="flag"
                        width={18}
                        height={18}
                        className="dark:invert dark:brightness-0"
                    />
                </AlertDialogTrigger>
                <AlertDialogContent className="background-light800_dark300">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Report Question</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to report this question? This
                            will notify the moderators for review.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="btn">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="!border-primary-100 !bg-primary-500 !text-light-800"
                            onClick={handleReport}
                        >
                            Report
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ReportAction;
