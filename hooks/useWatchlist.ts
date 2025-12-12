import {toast} from 'sonner';
import {useState, useTransition} from 'react';
import {addToWatchlist, removeFromWatchlist} from '@/lib/actions/watchlist.actions';

function useWatchlist(symbol: string, company: string, initialIsInWatchlist: boolean) {
    const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
    const [isPending, startTransition] = useTransition();

    const toggleWatchlist = (onSuccess?: (symbol: string, isAdded: boolean) => void) => {
        startTransition(async () => {
            if (isInWatchlist) {
                const result = await removeFromWatchlist(symbol);
                if (result.success) {
                    setIsInWatchlist(false);
                    toast.success(result.message);
                    onSuccess?.(symbol, false);
                } else {
                    toast.error(result.message);
                }
            } else {
                const result = await addToWatchlist(symbol, company);
                if (result.success) {
                    setIsInWatchlist(true);
                    toast.success(result.message);
                    onSuccess?.(symbol, true);
                } else {
                    toast.error(result.message);
                }
            }
        });
    }

    return {isInWatchlist, isPending, toggleWatchlist};
}

export {useWatchlist};
