"use server";

import { FilterQuery, PipelineStage, Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { Answer, Question, User } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { assignBadges } from "../utils";
import {
    GetUserSchema,
    MakeAdminSchema,
    PaginatedSearchParamsSchema,
    UpdateUserSchema,
} from "../validations";

export async function getUsers(
    params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { page = 1, pageSize = 10, query, filter } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    const filterQuery: FilterQuery<typeof User> = {};

    if (query) {
        filterQuery.$or = [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
        ];
    }

    let sortCriteria = {};

    switch (filter) {
        case "newest":
            sortCriteria = { createdAt: -1 };
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 };
            break;
        case "popular":
            sortCriteria = { reputation: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalUsers = await User.countDocuments(filterQuery);

        const users = await User.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = totalUsers > skip + users.length;

        return {
            success: true,
            data: {
                users: JSON.parse(JSON.stringify(users)),
                isNext,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getUser(params: GetUserParams): Promise<
    ActionResponse<{
        user: User;
    }>
> {
    const validationResult = await action({
        params,
        schema: GetUserSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { userId } = params;

    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        return {
            success: true,
            data: {
                user: JSON.parse(JSON.stringify(user)),
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
    ActionResponse<{
        questions: Question[];
        isNext: boolean;
    }>
> {
    const validationResult = await action({
        params,
        schema: GetUserSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { userId, page = 1, pageSize = 10 } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    try {
        const totalQuestions = await Question.countDocuments({
            author: userId,
        });

        const questions = await Question.find({ author: userId })
            .populate("tags", "name")
            .populate("author", "name image")
            .skip(skip)
            .limit(limit);

        const isNext = totalQuestions > skip + questions.length;

        return {
            success: true,
            data: {
                questions: JSON.parse(JSON.stringify(questions)),
                isNext,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getUsersAnswers(params: GetUserAnswersParams): Promise<
    ActionResponse<{
        answers: Answer[];
        isNext: boolean;
    }>
> {
    const validationResult = await action({
        params,
        schema: GetUserSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { userId, page = 1, pageSize = 10 } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    try {
        const totalAnswers = await Answer.countDocuments({ author: userId });

        const answers = await Answer.find({ author: userId })
            .populate("author", "_id name image")
            .skip(skip)
            .limit(limit);

        const isNext = totalAnswers > skip + answers.length;

        return {
            success: true,
            data: {
                answers: JSON.parse(JSON.stringify(answers)),
                isNext,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getUserTopTags(params: GetUserTagsParams): Promise<
    ActionResponse<{
        tags: { _id: string; name: string; count: number }[];
    }>
> {
    const validationResult = await action({
        params,
        schema: GetUserSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { userId } = params;

    try {
        const pipeline: PipelineStage[] = [
            { $match: { author: new Types.ObjectId(userId) } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "tags",
                    localField: "_id",
                    foreignField: "_id",
                    as: "tagInfo",
                },
            },
            { $unwind: "$tagInfo" },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    _id: "$tagInfo._id",
                    name: "$tagInfo.name",
                    count: 1,
                },
            },
        ];

        const tags = await Question.aggregate(pipeline);

        return {
            success: true,
            data: {
                tags: JSON.parse(JSON.stringify(tags)),
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getUserStats(params: GetUserParams): Promise<
    ActionResponse<{
        totalQuestions: number;
        totalAnswers: number;
        badges: Badges;
    }>
> {
    const validationResult = await action({
        params,
        schema: GetUserSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { userId } = params;

    try {
        const [questionStatsRaw] = await Question.aggregate([
            { $match: { author: new Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    upvotes: { $sum: "$upvotes" },
                    views: { $sum: "$views" },
                },
            },
        ]);

        const [answerStatsRaw] = await Answer.aggregate([
            { $match: { author: new Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    upvotes: { $sum: "$upvotes" },
                },
            },
        ]);

        const questionStats = {
            count: questionStatsRaw?.count ?? 0,
            upvotes: questionStatsRaw?.upvotes ?? 0,
            views: questionStatsRaw?.views ?? 0,
        };

        const answerStats = {
            count: answerStatsRaw?.count ?? 0,
            upvotes: answerStatsRaw?.upvotes ?? 0,
        };

        const badges = assignBadges({
            criteria: [
                { type: "ANSWER_COUNT", count: answerStats.count },
                { type: "QUESTION_COUNT", count: questionStats.count },
                {
                    type: "QUESTION_UPVOTES",
                    count: questionStats.upvotes + answerStats.upvotes,
                },
                { type: "TOTAL_VIEWS", count: questionStats.views },
            ],
        });

        return {
            success: true,
            data: {
                totalQuestions: questionStats.count,
                totalAnswers: answerStats.count,
                badges,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function updateUser(
    params: UpdateUserParams
): Promise<ActionResponse<{ user: User }>> {
    const validationResult = await action({
        params,
        schema: UpdateUserSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { user } = validationResult.session!;

    try {
        const updatedUser = await User.findByIdAndUpdate(user?.id, params, {
            new: true,
        });

        return {
            success: true,
            data: { user: JSON.parse(JSON.stringify(updatedUser)) },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function makeAdmin({
    params,
}: {
    params: MakeAdminParams;
}): Promise<ActionResponse<void>> {
    const validationResult = await action({
        params,
        schema: MakeAdminSchema,
        authorize: true,
    });

    const { userId } = params;

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    try {
        await User.findByIdAndUpdate(userId, { isAdmin: true });
        return { success: true, data: undefined };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function banUser({ params, options }: BanUserArgs) {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, message: "Not authenticated." };
    }

    if (session.user.id === params.userId) {
        return { success: false, message: "You cannot ban yourself." };
    }

    const durationDays = options?.durationDays ?? 30;

    const bannedUntil =
        durationDays === 0
            ? new Date(Date.now() + 99999 * 86_400_000)
            : new Date(Date.now() + durationDays * 86_400_000);

    try {
        await User.findByIdAndUpdate(params.userId, { bannedUntil });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("[banUser]", error);
        return { success: false, message: "Something went wrong." };
    }
}

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.isAdmin) throw new Error("Unauthorized");
    return session.user;
}

export async function unbanUser({ params }: { params: { userId: string } }) {
    await requireAdmin();
    await User.findByIdAndUpdate(params.userId, { bannedUntil: null });
    revalidatePath("/dashboard");
    return { success: true };
}

export async function revokeAdmin({ params }: { params: { userId: string } }) {
    const caller = await requireAdmin();
    if (caller.id === params.userId) {
        return {
            success: false,
            message: "You can’t revoke your own admin role.",
        };
    }
    await User.findByIdAndUpdate(params.userId, { isAdmin: false });
    revalidatePath("/dashboard");
    return { success: true };
}
