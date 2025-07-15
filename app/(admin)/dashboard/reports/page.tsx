import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getReportedQuestions } from "@/lib/actions/question.action";

interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>;
}

const AdminReports = async ({ searchParams }: SearchParams) => {
    const { page, pageSize, query, filter } = await searchParams;

    const { success, data, error } = await getReportedQuestions({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || "",
        filter: filter || "",
    });

    const { questions, isNext } = data || {};

    return (
        <>
            <section className="flex w-full ">
                <h1 className="h1-bold text-dark100_light900">Reports</h1>
            </section>
            <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route={ROUTES.ADMIN_REPORTS}
                    imgSrc="/icons/search.svg"
                    placeholder="Search reported questions..."
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
                                isAdminPage
                            />
                        ))}
                    </div>
                )}
            />

            <Pagination page={page} isNext={isNext || false} />
        </>
    );
};

export default AdminReports;
