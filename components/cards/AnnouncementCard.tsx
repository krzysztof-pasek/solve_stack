"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { dismissAnnouncement } from "@/lib/actions/announcement.action";

type Announcement = {
    _id: string;
    title: string;
    body: string;
    expiresAt: Date;
};

interface Props {
    announcement: Pick<Announcement, "title" | "body" | "_id" | "expiresAt">;
    userId: string | null;
}

const AnnouncementCard = ({ announcement, userId }: Props) => {
    const [hidden, setHidden] = useState(false);
    if (hidden) return null;

    return (
        <div className="background-light700_dark300 mx-auto mt-6 max-w-xl rounded-2xl p-6 shadow-lg">
            <h3 className="h3-semibold mb-2">{announcement.title}</h3>
            <p className="body-regular mb-4 whitespace-pre-wrap">
                {announcement.body}
            </p>

            <p className="text-sm text-muted-foreground mb-4">
                Event ends:&nbsp;
                {announcement.expiresAt.toLocaleString()}
            </p>

            <Button
                variant="secondary"
                className="w-full"
                onClick={async () => {
                    setHidden(true);
                    if (userId) await dismissAnnouncement(userId);
                }}
            >
                Dismiss
            </Button>
        </div>
    );
};

export default AnnouncementCard;
