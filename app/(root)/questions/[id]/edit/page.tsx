import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const { id } = params;
    const { success, data: question } = await getQuestion({ questionId: id });

    if (!success || !question) {
        return {
            title: "Question not found | Solvestack",
            description: "Unable to load question for editing.",
        };
    }

    return {
        title: `Edit: ${question.title} | Solvestack`,
        description: `Modify your question titled "${question.title}".`,
    };
}

const EditQuestion = async ({ params }: RouteParams) => {
    const { id } = await params;
    if (!id) notFound();

    const session = await auth();
    if (!session) redirect("/sign-in");

    const { data: question, success } = await getQuestion({ questionId: id });
    if (!success || !question) notFound();

    if (!session.user || question.author._id.toString() !== session.user.id)
        redirect(ROUTES.QUESTION(id));

    return (
        <main>
            <QuestionForm question={question} isEdit />
        </main>
    );
};

export default EditQuestion;
