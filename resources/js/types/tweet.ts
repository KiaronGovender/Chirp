import { User } from './auth';

export type tweet = {
    id: number;
    body: string;
    user_id: number;
    parent_id: number | null;
    created_at: string;
    user: User;
    likes_count?: number;
    retweets_count?: number;
    replies_count?: number;
    is_liked?: boolean;
    is_retweeted?: boolean;
    is_bookmarked?: boolean;
    parent?: {
        user: User;
    } | null;
};
