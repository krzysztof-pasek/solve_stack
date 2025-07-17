import Image from "next/image";
import Link from "next/link";
import React from "react";

import Metric from "../Metric";

type CountryData = {
    cca2: string;
    name: { common: string };
    flags: { svg: string };
};

const JobCard = ({
    job,
    countriesList,
}: {
    job: JobParams;
    countriesList: CountryData[] | unknown;
}) => {
    const countries: CountryData[] = Array.isArray(countriesList)
        ? countriesList
        : [];

    const rawCountry = job.job_country ?? "";
    const countryCode = rawCountry.toUpperCase();

    const countryObj = countries.find(
        (c) => c.cca2.toUpperCase() === countryCode
    );

    const countryName = countryObj?.name.common ?? job.job_country;

    const countryCCA2 = countryObj?.cca2.toUpperCase() ?? countryCode;

    const flagSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    const logoLight = job.employer_logo ?? "/images/default-logo.svg";
    const logoDark = job.employer_logo
        ? job.employer_logo
        : "/images/default-logo-dark.svg";

    const salary =
        job.job_min_salary && job.job_max_salary
            ? `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`
            : null;

    return (
        <div className="flex gap-6 w-full bg-light-900 shadow-light-100 dark:shadow-dark-100 background-light800_darkGradient rounded-[10px] p-8 sm:px-11">
            <div className="relative">
                <Image
                    src={logoLight}
                    alt={`${job.employer_name} logo`}
                    width={64}
                    height={64}
                    className="block dark:hidden rounded"
                />
                <Image
                    src={logoDark}
                    alt={`${job.employer_name} logo`}
                    width={64}
                    height={64}
                    className="hidden dark:block rounded"
                />
            </div>
            <div className="flex flex-col justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="base-semibold">{job.job_title}</h2>
                    <span
                        className="subtle-regular rounded-lg px-3 py-2 uppercase shadow-none bg-light-800 text-light-500
                       hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
                    >
                        {job.employer_name}
                    </span>
                </div>
                <p className="max-w-[540px] mt-2 body-regular line-clamp-2">
                    {job.job_description}
                </p>
                <div className="mt-5 flex items-center gap-6">
                    <Metric
                        imgUrl="/icons/clock-2.svg"
                        alt="Employment type"
                        value={
                            job.job_is_remote
                                ? "Remote"
                                : job.job_employment_type
                        }
                        textStyles="body-medium text-dark400_light700"
                    />

                    {salary && (
                        <Metric
                            imgUrl="/icons/currency-dollar-circle.svg"
                            alt="Salary"
                            value={salary}
                            textStyles="body-medium text-dark400_light700"
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-col justify-between ml-auto items-end">
                <div className="flex items-center gap-2 background-light800_dark400 p-1 px-1.5 rounded-full">
                    <Image
                        src={flagSrc}
                        alt={`${countryName} flag`}
                        width={16}
                        height={16}
                    />
                    <p className="body-medium">
                        {job.job_city},{" "}
                        <span className="uppercase">{countryCCA2}</span>
                    </p>
                </div>
                <Link
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    <span className="body-semibold primary-text-gradient">
                        View Job
                    </span>
                    <Image
                        src="/icons/arrow-up-right.svg"
                        alt="arrow up right"
                        width={16}
                        height={16}
                    />
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
