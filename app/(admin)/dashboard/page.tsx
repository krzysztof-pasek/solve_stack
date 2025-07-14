import AdminStatsCard from "@/components/cards/AdminStatsCard";
import DashboardChart from "@/components/charts/DashboardChart";
import {
    getDashboardStats,
    getMonthlyStats,
} from "@/lib/actions/dashboard.action";

export const revalidate = 900;

export default async function DashboardPage() {
    const [{ data: totals, success: s1 }, { data: monthly, success: s2 }] =
        await Promise.all([getDashboardStats(), getMonthlyStats()]);

    if (!s1 || !s2 || !totals || !monthly) return null;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="h1-bold">Overview</h1>
            <div className="flex flex-wrap gap-6 items-center justify-center">
                <AdminStatsCard name="Users" value={totals.users} />
                <AdminStatsCard name="Questions" value={totals.questions} />
                <AdminStatsCard name="Answers" value={totals.answers} />
                <AdminStatsCard name="Reports" value={totals.reports} />
            </div>
            <section className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-4">
                    <h2 className="h2-bold text-center">Users per month</h2>
                    <DashboardChart
                        chartData={monthly.users}
                        metricLabel="users"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="h2-bold text-center">Questions per month</h2>
                    <DashboardChart
                        chartData={monthly.questions}
                        metricLabel="questions"
                    />
                </div>
            </section>
        </div>
    );
}
