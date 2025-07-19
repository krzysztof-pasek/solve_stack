"use client";

import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMemo, FC } from "react";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";

import LocalSearch from "../search/LocalSearch";

export interface JobsFilterProps {
    countriesList: Country[];
}

const JobsFilter: FC<JobsFilterProps> = ({ countriesList }) => {
    const router = useRouter();
    const pathname = usePathname() || "/";
    const searchParams = useSearchParams();

    const sortedCountries: Country[] = useMemo(
        () =>
            Array.isArray(countriesList)
                ? [...countriesList].sort((a, b) =>
                      a.name.common.localeCompare(b.name.common, undefined, {
                          sensitivity: "base",
                      })
                  )
                : [],
        [countriesList]
    );

    const onLocationChange = (value: string): void => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("location", value);
        params.delete("page");

        const newUrl: string = `${pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    return (
        <div className="relative mt-5 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
            <LocalSearch
                route={pathname}
                iconPosition="left"
                imgSrc="/icons/job-search.svg"
                placeholder="Job Title, Company, or Keywords"
                otherClasses="flex-1 max-sm:w-full"
            />

            <Select onValueChange={onLocationChange}>
                <SelectTrigger className="body-regular light-border background-light800_dark300 text-dark500_light700 flex items-center gap-3 p-4 min-h-[56px] sm:max-w-[210px]">
                    <Image
                        src="/icons/carbon-location.svg"
                        alt="location"
                        width={18}
                        height={18}
                    />
                    <SelectValue
                        placeholder="Select Location"
                        className="flex-1 text-left line-clamp-1"
                    />
                </SelectTrigger>

                <SelectContent className="body-semibold max-h-[350px] max-w-[250px]">
                    <SelectGroup>
                        {sortedCountries.length > 0 ? (
                            sortedCountries.map((country: Country) => (
                                <SelectItem
                                    key={country.name.common}
                                    value={country.name.common}
                                    className="px-4 py-3"
                                >
                                    {country.name.common}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="" disabled>
                                No results found
                            </SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default JobsFilter;
