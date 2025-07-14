interface AdminStatsCardProps {
    name: string;
    value: number;
}

const AdminStatsCard = ({ name, value }: AdminStatsCardProps) => {
    return (
        <article
            className="background-light900_dark200 light-border flex w-full flex-col
                        rounded-2xl border px-4 py-5 shadow-light100_darknone sm:w-[200px] pl-6"
        >
            <span className="text-sm text-muted-foreground">{name}</span>

            <span className="mt-2 h2-bold leading-none primary-text-gradient">
                {value.toLocaleString()}
            </span>
        </article>
    );
};

export default AdminStatsCard;
