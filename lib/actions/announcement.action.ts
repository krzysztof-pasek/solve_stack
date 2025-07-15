"use server";

import { Types } from "mongoose";
import { ZodError } from "zod";

import { auth } from "@/auth";
import Announcement from "@/database/announcement.model";
import User from "@/database/user.model";
import {
    CreateAnnouncementInput,
    CreateAnnouncementSchema,
} from "@/lib/validations";

import dbConnect from "../mongoose";

type LeanAnnouncement = {
    _id: Types.ObjectId;
    title: string;
    body: string;
    expiresAt: Date;
    authorId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export type AnnouncementDTO = {
    _id: string;
    title: string;
    body: string;
    expiresAt: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
};

export type AnnouncementActionResult =
    | { success: true; id: string }
    | { success: false; error: ZodError<CreateAnnouncementInput> }
    | { success: false; error: { message: string } };

export async function createAnnouncement(
    payload: CreateAnnouncementInput
): Promise<AnnouncementActionResult> {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return { success: false, error: { message: "Forbidden" } };
    }

    const parsed = CreateAnnouncementSchema.safeParse(payload);
    if (!parsed.success) {
        return { success: false, error: parsed.error };
    }

    await dbConnect();
    const newDoc = await Announcement.create({
        ...parsed.data,
        authorId: session.user.id,
    });

    return {
        success: true,
        id: newDoc._id.toString(),
    };
}

export async function getActiveAnnouncement(): Promise<{
    success: true;
    data: AnnouncementDTO | null;
}> {
    await dbConnect();

    const ann = await Announcement.findOne({
        expiresAt: { $gt: new Date() },
    })
        .sort({ createdAt: -1 })
        .lean<LeanAnnouncement | null>();

    if (!ann) {
        return { success: true, data: null };
    }

    const dto: AnnouncementDTO = {
        _id: ann._id.toString(),
        title: ann.title,
        body: ann.body,
        expiresAt: ann.expiresAt.toISOString(),
        authorId: ann.authorId.toString(),
        createdAt: ann.createdAt.toISOString(),
        updatedAt: ann.updatedAt.toISOString(),
    };

    return { success: true, data: dto };
}
export async function dismissAnnouncement(
    userId: string
): Promise<{ success: true }> {
    await dbConnect();
    await User.findByIdAndUpdate(userId, {
        lastSeenAnnouncement: new Date(),
    });
    return { success: true };
}
