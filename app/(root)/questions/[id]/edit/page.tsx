import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";

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
