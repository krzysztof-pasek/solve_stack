import { Skeleton } from "@/components/ui/skeleton";

const FieldSkeletons = ({ count }: { count: number }) => (
    <div className="space-y-6 mt-10">
        {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}

        <Skeleton className="h-12 w-full rounded-md" />
    </div>
);

export const SignUpLoading = () => (
    <section>
        <FieldSkeletons count={4} />

        <div className="mt-10 flex flex-wrap gap-2.5">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 flex-1 rounded-md" />
        </div>
    </section>
);

export const SignInLoading = () => (
    <section>
        <FieldSkeletons count={2} />

        <div className="mt-10 flex flex-wrap gap-2.5">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 flex-1 rounded-md" />
        </div>
    </section>
);
