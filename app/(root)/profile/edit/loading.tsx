import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <section>
        <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

        <div className="mt-9 flex flex-col gap-9">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}

            <Skeleton className="h-[120px] w-full rounded-md" />

            <div className="flex justify-end">
                <Skeleton className="h-12 w-32 rounded-md" />
            </div>
        </div>
    </section>
);

export default Loading;
