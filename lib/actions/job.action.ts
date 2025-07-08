export const getLocation = async () => {
    const response = await fetch("http://ip-api.com/json/?fields=1");
    const location = await response.json();
    return location.country;
};

export const getCountries = async (): Promise<Country[]> => {
    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const countries: Country[] = await response.json();
        return countries;
    } catch (error) {
        console.error("Failed to load countries:", error);
        return [];
    }
};

export const getJobs = async (filters: JobFilterParams) => {
    const { query, page } = filters;

    const headers = {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    };

    const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
        {
            headers,
        }
    );

    const result = await response.json();

    return result.data;
};
