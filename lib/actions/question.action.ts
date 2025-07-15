"use server";

import mongoose, { FilterQuery, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { cache } from "react";

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { Answer, Collection, Interaction, Vote } from "@/database";
import Question, { IQuestionDoc } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITagDoc } from "@/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../mongoose";
import {
    AskQuestionSchema,
    DeleteQuestionSchema,
    EditQuestionSchema,
    GetQuestionSchema,
    IncrementViewsSchema,
    PaginatedSearchParamsSchema,
    ReportQuestionParams,
    ReportQuestionSchema,
} from "../validations";
import { createInteraction } from "./interaction.action";

export async function createQuestion(
    params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
    const validationResult = await action({
        params,
        schema: AskQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, content, tags } = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [question] = await Question.create(
            [{ title, content, author: userId }],
            { session }
        );

        if (!question) {
            throw new Error("Failed to create question");
        }

        const tagIds: mongoose.Types.ObjectId[] = [];
        const tagQuestionDocuments = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
                { upsert: true, new: true, session }
            );

            tagIds.push(existingTag._id);
            tagQuestionDocuments.push({
                tag: existingTag._id,
                question: question._id,
            });
        }

        await TagQuestion.insertMany(tagQuestionDocuments, { session });

        await Question.findByIdAndUpdate(
            question._id,
            { $push: { tags: { $each: tagIds } } },
            { session }
        );

        after(async () => {
            await createInteraction({
                action: "post",
                actionId: question._id.toString(),
                actionTarget: "question",
                authorId: userId as string,
            });
        });

        await session.commitTransaction();

        return { success: true, data: JSON.parse(JSON.stringify(question)) };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

export async function editQuestion(
    params: EditQuestionParams
): Promise<ActionResponse<IQuestionDoc>> {
    const validationResult = await action({
        params,
        schema: EditQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, content, tags, questionId } = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const question = await Question.findById(questionId).populate("tags");

        if (!question) {
            throw new Error("Question not found");
        }

        if (question.author.toString() !== userId) {
            throw new Error("Unauthorized");
        }

        if (question.title !== title || question.content !== content) {
            question.title = title;
            question.content = content;
            await question.save({ session });
        }

        const tagsToAdd = tags.filter(
            (tag) =>
                !question.tags.some((t: ITagDoc) =>
                    t.name.toLowerCase().includes(tag.toLowerCase())
                )
        );

        const tagsToRemove = question.tags.filter(
            (tag: ITagDoc) =>
                !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
        );

        const newTagDocuments = [];

        if (tagsToAdd.length > 0) {
            for (const tag of tagsToAdd) {
                const existingTag = await Tag.findOneAndUpdate(
                    { name: { $regex: `^${tag}$`, $options: "i" } },
                    { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
                    { upsert: true, new: true, session }
                );

                if (existingTag) {
                    newTagDocuments.push({
                        tag: existingTag._id,
                        question: questionId,
                    });

                    question.tags.push(existingTag._id);
                }
            }
        }

        if (tagsToRemove.length > 0) {
            const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

            await Tag.updateMany(
                { _id: { $in: tagIdsToRemove } },
                { $inc: { questions: -1 } },
                { session }
            );

            await TagQuestion.deleteMany(
                { tag: { $in: tagIdsToRemove }, question: questionId },
                { session }
            );

            question.tags = question.tags.filter(
                (tag: mongoose.Types.ObjectId) =>
                    !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
                        id.equals(tag._id)
                    )
            );
        }

        if (newTagDocuments.length > 0) {
            await TagQuestion.insertMany(newTagDocuments, { session });
        }

        await question.save({ session });
        await session.commitTransaction();

        return { success: true, data: JSON.parse(JSON.stringify(question)) };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}

export const getQuestion = cache(async function getQuestion(
    params: GetQuestionParams
): Promise<ActionResponse<Question>> {
    const validationResult = await action({
        params,
        schema: GetQuestionSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params!;

    try {
        const question = await Question.findById(questionId)
            .populate("tags", "_id name")
            .populate("author", "_id name image");

        if (!question) throw new Error("Question not found");

        return { success: true, data: JSON.parse(JSON.stringify(question)) };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
});

export async function getQuestions(params: PaginatedSearchParams): Promise<
    ActionResponse<{
        questions: Question[];
        isNext: boolean;
    }>
> {
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

    const filterQuery: FilterQuery<typeof Question> = {};
    let sortCriteria = {};

    try {
        if (filter === "recommended") {
            const session = await auth();
            const userId = session?.user?.id;

            if (!userId) {
                return {
                    success: true,
                    data: { questions: [], isNext: false },
                };
            }

            const recommended = await getRecommendedQuestions({
                userId,
                query,
                skip,
                limit,
            });

            return { success: true, data: recommended };
        }

        if (query) {
            filterQuery.$or = [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } },
            ];
        }

        switch (filter) {
            case "newest":
                sortCriteria = { createdAt: -1 };
                break;
            case "unanswered":
                filterQuery.answers = 0;
                sortCriteria = { createdAt: -1 };
                break;
            case "popular":
                sortCriteria = { upvotes: -1 };
                break;
            default:
                sortCriteria = { createdAt: -1 };
                break;
        }

        const totalQuestions = await Question.countDocuments(filterQuery);

        const questions = await Question.find(filterQuery)
            .populate("tags", "name")
            .populate("author", "name image")
            .lean()
            .sort(sortCriteria)
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
export async function incrementViews(
    params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
    const validationResult = await action({
        params,
        schema: IncrementViewsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params!;

    try {
        const question = await Question.findById(questionId);

        if (!question) {
            throw new Error("Question not found");
        }

        question.views += 1;

        await question.save();

        revalidatePath(ROUTES.QUESTION(questionId));

        return {
            success: true,
            data: { views: question.views },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getHotQuestions(): Promise<ActionResponse<Question[]>> {
    try {
        await dbConnect();

        const questions = await Question.find()
            .sort({ views: -1, upvotes: -1 })
            .limit(5);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(questions)),
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function deleteQuestion(
    params: DeleteQuestionParams
): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: DeleteQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params!;
    const { user } = validationResult.session!;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const question = await Question.findById(questionId).session(session);
        if (!question) throw new Error("Question not found");

        if (question.author.toString() !== user?.id)
            throw new Error("You are not authorized to delete this question");

        await Collection.deleteMany({ question: questionId }, { session });

        await TagQuestion.deleteMany({ question: questionId }, { session });

        if (question.tags.length > 0) {
            await Tag.updateMany(
                { _id: { $in: question.tags } },
                { $inc: { questions: -1 } },
                { session }
            );
        }

        await Vote.deleteMany(
            {
                actionId: questionId,
                actionType: "question",
            },
            { session }
        );

        const answers = await Answer.find({ question: questionId }).session(
            session
        );

        if (answers.length > 0) {
            await Answer.deleteMany({ question: questionId }).session(session);

            await Vote.deleteMany({
                actionId: { $in: answers.map((answer) => answer.id) },
                actionType: "answer",
            }).session(session);
        }

        await Question.findByIdAndDelete(questionId).session(session);

        await session.commitTransaction();
        session.endSession();

        revalidatePath(`/profile/${user?.id}`);

        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return handleError(error) as ErrorResponse;
    }
}

export async function getRecommendedQuestions({
    userId,
    query,
    skip,
    limit,
}: RecommendationParams) {
    const interactions = await Interaction.find({
        user: new Types.ObjectId(userId),
        actionType: "question",
        action: { $in: ["view", "upvote", "bookmark", "post"] },
    })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    const interactedQuestionIds = interactions.map((i) => i.actionId);

    const interactedQuestions = await Question.find({
        _id: { $in: interactedQuestionIds },
    }).select("tags");

    const allTags = interactedQuestions.flatMap((q) =>
        q.tags.map((tag: Types.ObjectId) => tag.toString())
    );

    const uniqueTagIds = [...new Set(allTags)];

    const recommendedQuery: FilterQuery<typeof Question> = {
        _id: { $nin: interactedQuestionIds },

        author: { $ne: new Types.ObjectId(userId) },

        tags: { $in: uniqueTagIds.map((id) => new Types.ObjectId(id)) },
    };

    if (query) {
        recommendedQuery.$or = [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
        ];
    }

    const total = await Question.countDocuments(recommendedQuery);

    const questions = await Question.find(recommendedQuery)
        .populate("tags", "name")
        .populate("author", "name image")
        .sort({ upvotes: -1, views: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext: total > skip + questions.length,
    };
}

export async function reportQuestion(
    params: ReportQuestionParams
): Promise<ActionResponse<{ reports: number }>> {
    const validationResult = await action({
        params,
        schema: ReportQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params!;

    try {
        await dbConnect();

        const updated = (await Question.findByIdAndUpdate(
            questionId,
            { $inc: { reports: 1 } },
            { new: true }
        )) as IQuestionDoc | null;

        if (!updated) throw new Error("Question not found");

        return {
            success: true,
            data: { reports: updated.reports },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getReportedQuestions(
    params: PaginatedSearchParams
): Promise<
    ActionResponse<{
        questions: Question[];
        isNext: boolean;
    }>
> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { page = 1, pageSize = 10, query } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    const filterQuery: FilterQuery<typeof Question> = {
        reports: { $gt: 0 },
    };

    if (query) {
        filterQuery.$or = [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
        ];
    }

    try {
        const totalQuestions = await Question.countDocuments(filterQuery);

        const questions = await Question.find(filterQuery)
            .populate("tags", "name")
            .populate("author", "name image")
            .lean()
            .sort({ reports: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            success: true,
            data: {
                questions: JSON.parse(JSON.stringify(questions)),
                isNext: totalQuestions > skip + questions.length,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
