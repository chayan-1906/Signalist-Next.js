"use client";

import {toast} from "sonner";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Loader2, Star, TrendingUp, X} from "lucide-react";
import React, {useCallback, useEffect, useState, useTransition} from 'react';
import {cn} from "@/lib/utils";
import {routes} from "@/lib/routes";
import {useDebounce} from "@/hooks/useDebounce";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {addToWatchlist, removeFromWatchlist} from "@/lib/actions/watchlist.actions";
import {Command, CommandEmpty, CommandInput, CommandList} from '@/components/ui/command';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

function SearchModal({initialStocks}: SearchModalProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
    const [isPending, startTransition] = useTransition();
    const [hasHistory, setHasHistory] = useState(true);

    const isSearchMode: boolean = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

    const handleSearch = async () => {
        if (!isSearchMode) {
            return setStocks(initialStocks);
        }

        setLoading(true);
        try {
            const results = await searchStocks(searchTerm.trim());
            setStocks(results);
        } catch (error: unknown) {
            setStocks([]);
        } finally {
            setLoading(false);
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300);

    const handleSelectStock = (symbol: string) => {
        router.push(routes.stocksDetailsPath(symbol));
    }

    const handleToggleWatchlist = (stock: StockWithWatchlistStatus) => {
        startTransition(async () => {
            const isCurrentlyInWatchlist = stock.isInWatchlist;

            setStocks(prevStocks =>
                prevStocks.map(s =>
                    s.symbol === stock.symbol
                        ? {...s, isInWatchlist: !isCurrentlyInWatchlist}
                        : s
                )
            );

            const result = isCurrentlyInWatchlist
                ? await removeFromWatchlist(stock.symbol)
                : await addToWatchlist(stock.symbol, stock.name);

            if (result.success) {
                toast.success(result.message);
            } else {
                setStocks(prevStocks =>
                    prevStocks.map(s =>
                        s.symbol === stock.symbol
                            ? {...s, isInWatchlist: isCurrentlyInWatchlist}
                            : s
                    )
                );
                toast.error(result.message);
            }
        });
    }

    useEffect(() => {
        debouncedSearch();
    }, [searchTerm]);

    useEffect(() => {
        setHasHistory(window.history.length > 1);
    }, []);

    const handleClose = useCallback(() => {
        if (hasHistory) {
            router.back();
        } else {
            router.push(routes.homePath);
        }
    }, [router, hasHistory]);

    return (
        <Dialog open onOpenChange={(open) => !open && handleClose()}>
            <DialogHeader className="sr-only">
                <DialogTitle>Search Stocks</DialogTitle>
                <DialogDescription>Search for stocks to view details or add to your watchlist</DialogDescription>
            </DialogHeader>
            <DialogContent className={'search-dialog overflow-hidden p-0'} showCloseButton={false}>
                <Command
                    className={'[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'}>
                    <div className={'search-field relative'}>
                        <CommandInput placeholder={'Search stocks...'} value={searchTerm} onValueChange={setSearchTerm} className={'search-input pr-20'} autoFocus/>
                        {loading && <Loader2 className={'search-loader'}/>}
                        {hasHistory && (
                            <button onClick={handleClose} className={'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-700 rounded-sm transition-colors'} aria-label={'Close search'}>
                                <X className={'size-4 text-gray-400'}/>
                            </button>
                        )}
                    </div>
                    <CommandList className={'search-list'}>
                        {loading ? (
                            <CommandEmpty className={'search-list-empty'}>Loading stocks...</CommandEmpty>
                        ) : displayStocks?.length === 0 ? (
                            <div className={'search-list-indicator'}>
                                {isSearchMode ? 'No results found' : 'No stocks available'}
                            </div>
                        ) : (
                            <ul>
                                <div className={'search-count'}>
                                    {isSearchMode ? 'Search results' : 'Popular stocks'}
                                    ({displayStocks?.length || 0})
                                </div>
                                {displayStocks?.map((stock: StockWithWatchlistStatus): React.ReactNode => (
                                    <li key={stock.symbol} className={'search-item'}>
                                        <Link
                                            href={routes.stocksDetailsPath(stock.symbol)}
                                            onClick={() => handleSelectStock(stock.symbol)}
                                            className={'search-item-link'}
                                        >
                                            <TrendingUp className={'size-4 text-gray-500'}/>
                                            <div className={'flex-1'}>
                                                <div className={'search-item-name'}>{stock.name}</div>
                                                <div className={'text-sm text-gray-500'}>{stock.symbol} | {stock.exchange} | {stock.type}</div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleToggleWatchlist(stock);
                                                }}
                                                className={'p-1 cursor-pointer hover:bg-accent rounded-sm transition-colors'}
                                                title={stock.isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                                            >
                                                <Star className={cn('size-4', stock.isInWatchlist && 'fill-yellow-500 text-yellow-500')}/>
                                            </button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}

export {SearchModal};
