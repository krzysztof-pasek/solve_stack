import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <>
        <Skeleton className="h-11 w-64 rounded-md mb-8" />

        <Skeleton className="h-10 w-full rounded-md mb-6" />

        <Skeleton className="h-32 w-full rounded-md mb-6" />

        <Skeleton className="h-64 w-64 rounded-md mb-6" />

        <Skeleton className="h-10 w-48 rounded-md justify-self-end" />
    </>
);

export default Loading;
