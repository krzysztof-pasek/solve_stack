import Image from "next/image";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";

interface Props {
    imgUrl: string;
    alt: string;
    value: string | number;
    title?: string;
    href?: string;
    textStyles: string;
    imgStyles?: string;
    titleStyles?: string;
}

const Metric = ({
    imgUrl,
    alt,
    value,
    title,
    href,
    textStyles,
    imgStyles,
    titleStyles,
}: Props) => {
    const initials = alt
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const metricContent = (
        <div className="flex-center gap-1">
            {imgUrl ? (
                <Image
                    src={imgUrl}
                    width={16}
                    height={16}
                    alt={alt}
                    className={`rounded-full object-contain ${imgStyles}`}
                />
            ) : (
                <Avatar className="size-4">
                    <AvatarFallback className="h-4 w-4 primary-gradient font-space-grotesk font-bold tracking-wider text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            )}

            <p className={`${textStyles} flex items-center gap-1`}>
                {value}

                {title ? (
                    <span
                        className={cn(
                            `small-regular line-clamp-1`,
                            titleStyles
                        )}
                    >
                        {title}
                    </span>
                ) : null}
            </p>
        </div>
    );

    return href ? (
        <Link href={href} className="flex-center gap-1">
            {metricContent}
        </Link>
    ) : (
        <div className="flex-center gap-1">{metricContent}</div>
    );
};

export default Metric;
