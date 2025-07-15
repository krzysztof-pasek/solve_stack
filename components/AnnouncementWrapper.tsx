import { auth } from "@/auth";
import { getActiveAnnouncement } from "@/lib/actions/announcement.action";

import AnnouncementCard from "./cards/AnnouncementCard";

const AnnouncementWrapper = async () => {
    const session = await auth();
    const { data } = await getActiveAnnouncement();
    if (!data) return null;

    return (
        <AnnouncementCard
            announcement={{
                _id: data._id.toString(),
                title: data.title,
                body: data.body,
                expiresAt: new Date(data.expiresAt),
            }}
            userId={session?.user?.id || null}
        />
    );
};

export default AnnouncementWrapper;
