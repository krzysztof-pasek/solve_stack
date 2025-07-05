import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <>
        <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
            <div className="flex flex-col items-start gap-4 lg:flex-row">
                <Skeleton className="size-[140px] rounded-full" />

                <div className="mt-3 flex flex-col gap-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-32" />

                    <div className="mt-4 flex gap-3">
                        {[1, 2, 3].map((n) => (
                            <Skeleton key={n} className="h-6 w-24" />
                        ))}
                    </div>
                </div>
            </div>

            <Skeleton className="h-16 w-44 rounded-md" />
        </section>

        <div className="mt-8 flex flex-wrap gap-6">
            {[1, 2, 3, 4].map((n) => (
                <Skeleton key={n} className="h-28 w-[22%] rounded-md" />
            ))}
        </div>

        <section className="mt-10 flex gap-10">
            <div className="flex-[2] w-full">
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>

                <div className="mt-5 flex flex-col gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-xl" />
                    ))}
                </div>
            </div>

            <div className="flex-1 min-w-[250px] flex-col max-lg:hidden">
                <Skeleton className="h-6 w-24" />
                <div className="mt-7 flex flex-col gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-md" />
                    ))}
                </div>
            </div>
        </section>
    </>
);

export default Loading;
