import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <div>
        <Skeleton className="h-11 w-32 rounded-md" />

        <div className="mt-11 mb-6 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Skeleton className="h-14 w-full rounded-md" />
        </div>

        <div className="flex flex-col gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
        </div>
    </div>
);

export default Loading;
