interface Tag {
    _id: string;
    name: string;
    questions?: number;
}

interface Author {
    _id: string;
    name: string;
    image: string;
}

interface Question {
    _id: string;
    title: string;
    content: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
    createdAt: Date;
    reports?: number;
}

type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: Record<string, string[]>;
    };
    status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
    page?: number;
    pageSize?: number;
    query?: string;
    filter?: string;
    sort?: string;
}

interface Answer {
    _id: string;
    author: Author;
    content: string;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    question: string;
}

interface Collection {
    _id: string;
    author: string | Author;
    question: Question;
}

interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
    createdAt: Date;
    isAdmin?: boolean;
    bannedUntil?: Date | null;
}

interface Badges {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
}

interface GlobalSearchedItem {
    id: string;
    type: "question" | "answer" | "user" | "tag";
    title: string;
}

type JobParams = {
    job_id: string;
    job_title: string;
    employer_name: string;
    employer_logo: string | null;
    job_employment_type: string;
    job_description: string;
    job_apply_link: string;
    job_is_remote: boolean;
    job_posted_at_datetime_utc: string;
    job_location: string;
    job_city: string;
    job_country: string;
    job_min_salary: number | null;
    job_max_salary: number | null;
};

interface Country {
    name: {
        common: string;
        official?: string;
    };
    cca2: string;
    flags: {
        svg: string;
        png?: string;
    };
}
