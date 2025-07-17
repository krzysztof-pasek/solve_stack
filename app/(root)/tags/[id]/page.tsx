import { Metadata } from "next";
import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getTagQuestions } from "@/lib/actions/tag.action";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const { id } = params;

    const { success, data } = await getTagQuestions({
        tagId: id,
        page: 1,
        pageSize: 1,
    });

    if (!success || !data?.tag) {
        return {
            title: "Tag not found | Solvestack",
            description: "This tag does not exist.",
        };
    }

    const { name } = data.tag;
    return {
        title: `${name} Tag | Solvestack`,
        description: `View all questions tagged "${name}" on Solvestack.`,
    };
}

const TagDetails = async ({ params, searchParams }: RouteParams) => {
    const { id } = await params;
    const { page, pageSize, query } = await searchParams;

    const { success, data, error } = await getTagQuestions({
        tagId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query,
    });

    const { tag, questions, isNext } = data || {};

    return (
        <>
            <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
            </section>

            <section className="mt-11">
                <LocalSearch
                    route={ROUTES.TAG(id)}
                    imgSrc="/icons/search.svg"
                    placeholder="Search questions..."
                    otherClasses="flex-1"
                />
            </section>

            <DataRenderer
                success={success}
                error={error}
                data={questions}
                empty={EMPTY_QUESTION}
                render={(questions) => (
                    <div className="mt-10 flex w-full flex-col gap-6">
                        {questions.map((question) => (
                            <QuestionCard
                                key={question._id}
                                question={question}
                            />
                        ))}
                    </div>
                )}
            />
            <Pagination page={page} isNext={isNext || false} />
        </>
    );
};

export default TagDetails;
