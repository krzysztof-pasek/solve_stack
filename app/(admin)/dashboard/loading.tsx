import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <div className="flex flex-col gap-6">
        <Skeleton className="h-11 w-44 rounded-md" />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                    <Skeleton className="h-8 w-48 rounded-md mx-auto" />
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            ))}
        </section>
    </div>
);

export default Loading;
