import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <div>
        <Skeleton className="h-11 w-56 rounded-md" />

        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Skeleton className="h-14 flex-1 rounded-md" />
        </div>

        <div className="mt-12 flex flex-wrap gap-5 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
        </div>
    </div>
);

export default Loading;
