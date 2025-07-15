import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import AdminAnnouncementForm from "@/components/forms/AdminAnnouncementForm";

const NewAnnouncement = async () => {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        redirect("/");
    }

    return (
        <>
            <h1 className="h1-bold mb-8">Create Announcement</h1>
            <AdminAnnouncementForm />
        </>
    );
};

export default NewAnnouncement;
