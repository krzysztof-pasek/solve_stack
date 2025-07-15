import { Home, Users, Flag, BarChart, List } from "lucide-react";

export const sidebarLinks = [
    {
        imgURL: "/icons/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/icons/users.svg",
        route: "/community",
        label: "Community",
    },
    {
        imgURL: "/icons/star.svg",
        route: "/collection",
        label: "Collections",
    },
    {
        imgURL: "/icons/suitcase.svg",
        route: "/jobs",
        label: "Find Jobs",
    },
    {
        imgURL: "/icons/tag.svg",
        route: "/tags",
        label: "Tags",
    },
    {
        imgURL: "/icons/user.svg",
        route: "/profile",
        label: "Profile",
    },
    {
        imgURL: "/icons/question.svg",
        route: "/ask-question",
        label: "Ask a question",
    },
];

export const adminSidebarLinks = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/reports", label: "Reported questions", icon: Flag },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
    { href: "/dashboard/logs", label: "Logs", icon: List },
    { href: "/dashboard/announcements", label: "Announcements", icon: Home },
];
