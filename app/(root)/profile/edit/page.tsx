import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import ROUTES from "@/constants/routes";
import { getUser } from "@/lib/actions/user.action";

export const metadata: Metadata = {
    title: "Edit Profile | Solvestack",
    description: "Update your profile information on Solvestack.",
};

const EditProfile = async () => {
    const session = await auth();
    if (!session?.user?.id) redirect(ROUTES.SIGN_IN);

    const { success, data } = await getUser({ userId: session.user.id });
    if (!success) redirect(ROUTES.SIGN_IN);

    return (
        <>
            <h1 className="h1-bold text-dark100_light900 ">Edit Profile</h1>

            <ProfileForm user={data?.user as User} />
        </>
    );
};

export default EditProfile;
