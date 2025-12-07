import type {Metadata} from "next";
import {WatchlistTable} from '@/components/WatchlistTable';
import {getUserWatchlist} from '@/lib/actions/watchlist.actions';

export const metadata: Metadata = {
    title: 'My Watchlist | Signalist',
    description: 'Monitor your favorite stocks in real-time. View live prices, track performance, and manage your personalized watchlist all in one place',
};

async function WatchlistPage() {
    const watchlist = await getUserWatchlist();

    return (
        <div className={'min-h-screen'}>
            <div className={'mb-8'}>
                <h1 className={'text-3xl font-bold text-gray-100 mb-2'}>My Watchlist</h1>
                <p className='text-gray-400'>Track your favorite stocks and monitor their performance</p>
            </div>

            <WatchlistTable watchlist={watchlist}/>
        </div>
    );
}

export default WatchlistPage;
