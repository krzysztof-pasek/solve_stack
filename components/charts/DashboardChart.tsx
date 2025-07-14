"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    TooltipContentProps,
} from "recharts";
import {
    ValueType,
    NameType,
} from "recharts/types/component/DefaultTooltipContent";

type UsersChartProps = {
    chartData: { name: string; count: number }[];
    metricLabel: string;
};

type CustomTooltipProps = TooltipContentProps<ValueType, NameType> & {
    metricLabel: string;
};

const CustomTooltip = ({
    active,
    payload,
    label,
    metricLabel,
}: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="background-light900_dark200 border rounded-lg py-3 px-4 shadow-lg text-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="paragraph-semibold mt-1 primary-text-gradient">
                {payload[0].value} {metricLabel}
            </p>
        </div>
    );
};

const DashboardChart = ({ chartData, metricLabel }: UsersChartProps) => {
    return (
        <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="2" />
                    <XAxis dataKey="name" />
                    <YAxis type="number" domain={["auto", "auto"]} />
                    <Tooltip
                        content={(props) => (
                            <CustomTooltip
                                {...props}
                                metricLabel={metricLabel}
                            />
                        )}
                    />

                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#ff7000"
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardChart;
