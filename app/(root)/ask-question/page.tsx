import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";

export const metadata: Metadata = {
    title: "Ask a question | Solvestack",
    description:
        "Have a question? Post it to the Solvestack community and get answers from experts.",
};

const AskQuestion = async () => {
    const session = await auth();
    if (!session) return redirect("/sign-in");
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
            <div className="mt-9">
                <QuestionForm />
            </div>
        </>
    );
};

export default AskQuestion;
