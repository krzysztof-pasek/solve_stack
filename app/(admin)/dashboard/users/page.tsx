import React from "react";

import AdminUserCard from "@/components/cards/AdminUserCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";

const AdminUsersPage = async ({ searchParams }: RouteParams) => {
    const { page, pageSize, query, filter } = await searchParams;

    const { success, data, error } = await getUsers({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query,
        filter,
    });

    const { users, isNext } = data || {};

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Admin Users Page</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route={ROUTES.ADMIN_USERS}
                    iconPosition="left"
                    imgSrc="/icons/search.svg"
                    placeholder="Look for users..."
                    otherClasses="flex-1"
                />
            </div>

            <DataRenderer
                success={success}
                error={error}
                data={users}
                empty={EMPTY_USERS}
                render={(users) => (
                    <div className="mt-12 flex flex-wrap gap-5 w-full">
                        {users.map((user) => (
                            <AdminUserCard key={user._id} {...user} />
                        ))}
                    </div>
                )}
            />

            <Pagination page={page} isNext={isNext || false} />
        </div>
    );
};

export default AdminUsersPage;
