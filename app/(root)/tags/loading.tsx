import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <section>
        <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>

        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Skeleton className="h-14 flex-1 rounded-md" />
            <Skeleton className="h-14 w-28 rounded-md" />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-60 w-full rounded-2xl xs:w-[230px]"
                />
            ))}
        </div>
    </section>
);

export default Loading;
