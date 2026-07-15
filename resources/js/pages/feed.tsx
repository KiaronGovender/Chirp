import { Head } from '@inertiajs/react';
import CreatePost from '@/components/CreatePost';
import TweetCard from '@/components/TweetCard';
import type { tweet } from '@/types/tweet';

export default function Feed({ tweets }: { tweets: tweet[] }) {
    return (
        <>
            <Head title="Home" />
            <main className="grid grid-cols-3">
                <div>
                    <h1>Nav</h1>
                </div>
                <div>
                    <h1>Home</h1>
                    <div>
                        <CreatePost />
                        {tweets.map((tweet: tweet, index: number) => (
                            <TweetCard
                                body={tweet.body}
                                name={tweet.user.name}
                                key={index}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <h1>Trending</h1>
                </div>
            </main>
        </>
    );
}
