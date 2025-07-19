import { Metadata } from "next";
import React from "react";

import JobCard from "@/components/cards/JobCard";
import JobFilter from "@/components/filters/JobFilter";
import Pagination from "@/components/Pagination";
import { getCountries, getJobs } from "@/lib/actions/job.action";

// import { getLocation } from "@/lib/actions/job.action";

export const metadata: Metadata = {
    title: "Jobs | Solvestack",
    description:
        "Find developer jobs worldwide—filter by role, location, and more.",
};

const Jobs = async ({ searchParams }: RouteParams) => {
    const { query, location, page } = await searchParams;
    // const userLocation = await getLocation();

    // userLocation is not used because the API is not available in Poland where Im living right now
    // its a boundry issue with the API
    // the location is set to New York by default to display some jobs after the page loads

    const countries = await getCountries();

    const parsedPage = parseInt(page ?? 1);

    const searchQuery =
        query || location
            ? `${query ?? ""}${query && location ? ", " : ""}${location ?? ""}`
            : `Developer in New York`;

    const jobs = await getJobs({
        query: searchQuery,
        page: parsedPage,
    });

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900 text-3xl">Jobs</h1>

            <section className="mt-5 mb-6 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <JobFilter countriesList={countries} />
            </section>

            <div className="flex flex-col gap-6">
                {jobs?.length > 0 ? (
                    jobs
                        .filter((job: { job_title: string }) => job.job_title)
                        .map((job: JobParams) => (
                            <JobCard
                                key={job.job_apply_link}
                                job={job}
                                countriesList={countries ?? []}
                            />
                        ))
                ) : (
                    <div className="paragraph-regular text-dark200_light800 w-full text-center">
                        <p className="text-5xl mt-5">🫣</p>
                        <p className="text-dark200_light800 h1-bold px-5 py-2.5">
                            Oops, no jobs found
                        </p>
                    </div>
                )}
            </div>
            {jobs?.length > 0 && (
                <Pagination page={parsedPage} isNext={jobs?.length === 10} />
            )}
        </div>
    );
};

export default Jobs;
