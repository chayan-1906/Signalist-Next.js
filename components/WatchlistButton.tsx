'use client';

import {Star, Trash2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {useWatchlist} from '@/hooks/useWatchlist';

function WatchlistButton({symbol, company, isInWatchlist: initialIsInWatchlist, showTrashIcon = false, type = 'button', onWatchlistChange}: WatchlistButtonProps) {
    const {isInWatchlist, isPending, toggleWatchlist} = useWatchlist(symbol, company, initialIsInWatchlist);

    if (type === 'icon') {
        return (
            <Button
                onClick={() => toggleWatchlist(onWatchlistChange)}
                disabled={isPending}
                className={cn('inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50', isInWatchlist && 'text-destructive hover:text-yellow-500')}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
                {showTrashIcon && isInWatchlist ? (
                    <Trash2 className={'size-4'}/>
                ) : (
                    <Star className={cn('size-4', isInWatchlist && 'fill-current')}/>
                )}
            </Button>
        );
    }

    return (
        <Button onClick={() => toggleWatchlist(onWatchlistChange)} disabled={isPending} variant={isInWatchlist ? 'outline' : 'default'} size={'sm'}
                className={cn(isInWatchlist && 'border-yellow-500/50 text-yellow-500')}>
            {showTrashIcon && isInWatchlist ? (
                <>
                    <Trash2 className={'size-4'}/>
                    Remove
                </>
            ) : (
                <>
                    <Star className={cn('size-4', isInWatchlist && 'fill-current')}/>
                    {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </>
            )}
        </Button>
    );
}

export {WatchlistButton};
