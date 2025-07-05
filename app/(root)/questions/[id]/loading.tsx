import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <>
        <div className="flex-start w-full flex-col">
            <div className="flex w-full flex-col-reverse justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-[24px] rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="flex justify-end items-center gap-4">
                    <Skeleton className="h-10 w-16 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </div>
        </div>

        <div className="mb-8 mt-5 flex flex-wrap gap-4">
            {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-5 w-20" />
            ))}
        </div>

        <Skeleton className="h-[240px] w-full rounded-md" />

        <div className="mt-8 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-md" />
            ))}
        </div>

        <section className="my-5 flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
        </section>

        <section className="my-5 flex flex-col gap-6">
            <Skeleton className="h-14 w-full rounded-md" />
            <Skeleton className="h-[160px] w-full rounded-md" />
            <div className="flex justify-end">
                <Skeleton className="h-12 w-40 rounded-md" />
            </div>
        </section>
    </>
);

export default Loading;
