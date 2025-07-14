"use server";

import { auth } from "@/auth";
import { Question, Answer, User, Report, MonthlyStat } from "@/database";
import { IMonthlyStat } from "@/database/monthStats.model";

import handleError from "../handlers/error";

export async function getDashboardStats(): Promise<
    ActionResponse<{
        users: number;
        questions: number;
        answers: number;
        reports: number;
    }>
> {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return handleError(new Error("Forbidden")) as ErrorResponse;
    }

    try {
        const [users, questions, answers, reports] = await Promise.all([
            User.countDocuments({}),
            Question.countDocuments({}),
            Answer.countDocuments({}),
            Report.countDocuments({ status: "open" }),
        ]);

        return {
            success: true,
            data: { users, questions, answers, reports },
        };
    } catch (err) {
        return handleError(err) as ErrorResponse;
    }
}

export async function getMonthlyStats(): Promise<
    ActionResponse<{
        users: { name: string; count: number }[];
        questions: { name: string; count: number }[];
    }>
> {
    const session = await auth();
    if (!session?.user?.isAdmin)
        return handleError(new Error("Forbidden")) as ErrorResponse;

    try {
        const stats: IMonthlyStat[] = await MonthlyStat.find({})
            .sort({ month: 1 })
            .lean<IMonthlyStat[]>();

        const users = stats.map((s) => ({
            name: s.month.toLocaleString("en-US", { month: "short" }),
            count: s.users,
        }));

        const questions = stats.map((s) => ({
            name: s.month.toLocaleString("en-US", { month: "short" }),
            count: s.questions,
        }));

        return { success: true, data: { users, questions } };
    } catch (err) {
        return handleError(err) as ErrorResponse;
    }
}
