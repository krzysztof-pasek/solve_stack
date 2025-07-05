import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <section>
        <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-40 rounded-md" />
        </div>

        <div className="mt-11">
            <Skeleton className="h-14 w-full rounded-md" />
        </div>

        <div className="mt-10 flex w-full flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
        </div>
    </section>
);

export default Loading;
