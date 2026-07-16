export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    banner?: string;
    bio?: string;
    followers_count?: number;
    following_count?: number;
    tweets_count?: number;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
