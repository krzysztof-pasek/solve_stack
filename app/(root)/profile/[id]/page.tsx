import dayjs from "dayjs";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import {
    getUser,
    getUserQuestions,
    getUsersAnswers,
    getUserStats,
    getUserTopTags,
} from "@/lib/actions/user.action";

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const { id } = await params;
    const { success, data } = await getUser({ userId: id });

    if (!success || !data?.user) {
        return {
            title: "User not found | Solvestack",
            description: "This user does not exist.",
        };
    }

    const { name, username, bio } = data.user;
    return {
        title: `${name} (@${username}) | Solvestack`,
        description: bio ?? `${name}'s profile on Solvestack.`,
    };
}

const Profile = async ({ params, searchParams }: RouteParams) => {
    const { id } = await params;
    const { page, pageSize } = await searchParams;

    if (!id) notFound();

    const loggedInUser = await auth();

    const { success, data, error } = await getUser({
        userId: id,
    });

    if (!success)
        return (
            <div>
                <div className="h1-bold text-dark100_light900">
                    {error?.message}
                </div>
            </div>
        );

    const { user } = data!;

    const { data: userStats } = await getUserStats({ userId: id });

    const {
        success: userQuestionsSuccess,
        data: userQuestions,
        error: userQuestionsError,
    } = await getUserQuestions({
        userId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
    });

    const {
        success: userAnswersSuccess,
        data: userAnswers,
        error: userAnswersError,
    } = await getUsersAnswers({
        userId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
    });

    const {
        success: userTopTagsSuccess,
        data: userTopTags,
        error: userTopTagsError,
    } = await getUserTopTags({
        userId: id,
    });

    const { questions, isNext: hasMoreQuestions } = userQuestions!;
    const { answers, isNext: hasMoreAnswers } = userAnswers!;
    const { tags } = userTopTags!;

    const { _id, name, image, portfolio, location, createdAt, username, bio } =
        user;

    return (
        <>
            <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
                <div className="flex flex-col items-start gap-4 lg:flex-row">
                    <UserAvatar
                        id={_id}
                        name={name}
                        imageUrl={image}
                        className="size-[140px] rounded-full object-cover"
                        fallbackClassName="text-6xl fond-bolder"
                    />

                    <div className="mt-3">
                        <h2 className="h2-bold text-dark100_light900">
                            {name}
                        </h2>

                        <p className="paragraph-regular text-dark200_light800">
                            @{username}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                            {portfolio && (
                                <ProfileLink
                                    imgUrl="/icons/link.svg"
                                    href={portfolio}
                                    title="Portfolio"
                                />
                            )}
                            {location && (
                                <ProfileLink
                                    imgUrl="/icons/location.svg"
                                    title={location}
                                />
                            )}
                            <ProfileLink
                                imgUrl="/icons/calendar.svg"
                                title={dayjs(createdAt).format("MMMM YYYY")}
                            />
                        </div>

                        {bio && (
                            <p className="paragraph-regular text-dark400_light800 mt-8">
                                {bio}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                    {loggedInUser?.user?.id === id && (
                        <Link href="/profile/edit">
                            <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3 hover:bg-primary-500/20 dark:hover:bg-primary-500/50 cursor-pointer">
                                Edit Profile
                            </Button>
                        </Link>
                    )}
                </div>
            </section>

            <Stats
                totalQuestions={userStats?.totalQuestions || 0}
                totalAnswers={userStats?.totalAnswers || 0}
                badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
                reputationPoints={user.reputation || 0}
            />

            <section className="mt-10 flex gap-10">
                <Tabs defaultValue="top-posts" className="flex-[2]">
                    <TabsList className="background-light800_dark400 min-h-[42px] p-1 ">
                        <TabsTrigger
                            value="top-posts"
                            className="tab cursor-pointer"
                        >
                            Top Posts
                        </TabsTrigger>
                        <TabsTrigger
                            value="answers"
                            className="tab cursor-pointer"
                        >
                            Answers
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="top-posts"
                        className="mt-5 flex w-full flex-col gap-6"
                    >
                        <DataRenderer
                            data={questions}
                            empty={EMPTY_QUESTION}
                            success={userQuestionsSuccess}
                            error={userQuestionsError}
                            render={(questions) => (
                                <div className="flex w-full flex-col gap-6">
                                    {questions.map((question) => (
                                        <QuestionCard
                                            key={question._id}
                                            question={question}
                                            showActionBtns={
                                                loggedInUser?.user?.id ===
                                                question.author._id
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        />

                        <Pagination page={page} isNext={hasMoreQuestions} />
                    </TabsContent>
                    <TabsContent
                        value="answers"
                        className="flex w-full flex-col gap-6"
                    >
                        <DataRenderer
                            data={answers}
                            empty={EMPTY_ANSWERS}
                            success={userAnswersSuccess}
                            error={userAnswersError}
                            render={(answers) => (
                                <div className="flex w-full flex-col gap-10">
                                    {answers.map((answer) => (
                                        <AnswerCard
                                            key={answer._id}
                                            {...answer}
                                            content={answer.content.slice(
                                                0,
                                                27
                                            )}
                                            containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11 background-light800_darkGradient"
                                            showReadMore
                                            showActionBtns={
                                                loggedInUser?.user?.id ===
                                                answer.author._id
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        />

                        <Pagination
                            page={page}
                            isNext={hasMoreAnswers || false}
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
                    <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
                    <div className="mt-7 flex flex-col gap-4">
                        <DataRenderer
                            data={tags}
                            empty={EMPTY_TAGS}
                            success={userTopTagsSuccess}
                            error={userTopTagsError}
                            render={(tags) => (
                                <div className="mt-3 flex w-full flex-col gap-4">
                                    {tags.map((tag) => (
                                        <TagCard
                                            key={tag._id}
                                            _id={tag._id}
                                            name={tag.name}
                                            questions={tag.count}
                                            showCount
                                            compact
                                        />
                                    ))}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Profile;
