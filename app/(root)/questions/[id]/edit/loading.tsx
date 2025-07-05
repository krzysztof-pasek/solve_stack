import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <section>
        <div className="mt-9 flex flex-col gap-10">
            <Skeleton className="h-14 w-full rounded-md" />

            <Skeleton className="h-[300px] w-full rounded-md" />

            <Skeleton className="h-14 w-full rounded-md" />

            <div className="flex justify-end">
                <Skeleton className="h-12 w-40 rounded-md" />
            </div>
        </div>
    </section>
);

export default Loading;
