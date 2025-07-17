import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <>
        <Skeleton className="h-11 w-44 rounded-md" />

        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Skeleton className="h-14 flex-1 rounded-md" />
        </div>

        <div className="mt-10 flex w-full flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
        </div>
    </>
);

export default Loading;
