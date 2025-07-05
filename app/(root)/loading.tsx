import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <>
        <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-11 w-40 rounded-md" />
            <Skeleton className="h-12 sm:w-36 w-full rounded-md" />
        </section>

        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Skeleton className="h-14 flex-1 rounded-md" />

            <Skeleton className="h-14 w-28 rounded-md hidden max-md:block" />
        </div>

        <div className="mt-6 max-md:hidden flex gap-3 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-md" />
            ))}
        </div>

        <div className="mt-10 flex w-full flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
        </div>
    </>
);

export default Loading;
