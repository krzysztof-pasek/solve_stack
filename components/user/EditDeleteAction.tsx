"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAnswer } from "@/lib/actions/answer.action";
import {
    adminDeleteQuestion,
    deleteQuestion,
} from "@/lib/actions/question.action";

interface Props {
    type: string;
    itemId: string;
    isAdmin?: boolean;
}

const EditDeleteAction = ({ type, itemId, isAdmin = false }: Props) => {
    const router = useRouter();

    const handleEdit = async () => {
        router.push(`/questions/${itemId}/edit`);
    };

    const handleDelete = async () => {
        if (type === "Question") {
            if (isAdmin) {
                await adminDeleteQuestion({ questionId: itemId });
            } else {
                await deleteQuestion({ questionId: itemId });
            }
            toast("Question deleted successfully.");
        } else if (type === "Answer") {
            await deleteAnswer({ answerId: itemId });

            toast("Your answer has been deleted successfully.");
        }
    };

    return (
        <div
            className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}
        >
            {type === "Question" && !isAdmin && (
                <Image
                    src="/icons/edit.svg"
                    alt="edit"
                    width={14}
                    height={14}
                    className="cursor-pointer object-contain"
                    onClick={handleEdit}
                />
            )}

            <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer">
                    <Image
                        src="/icons/trash.svg"
                        alt="trash"
                        width={14}
                        height={14}
                    />
                </AlertDialogTrigger>
                <AlertDialogContent className="background-light800_dark300">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your{" "}
                            {type === "Question" ? "question" : "answer"} and
                            remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="btn">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="!border-primary-100 !bg-primary-500 !text-light-800"
                            onClick={handleDelete}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default EditDeleteAction;
