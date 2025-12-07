'use client';

import {toast} from "sonner";
import Link from "next/link";
import {Loader2, Star, TrendingUp} from "lucide-react";
import React, {useEffect, useState, useTransition} from 'react';
import {cn} from "@/lib/utils";
import {routes} from "@/lib/routes";
import {Button} from "@/components/ui/button";
import {useDebounce} from "@/hooks/useDebounce";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {addToWatchlist, removeFromWatchlist} from "@/lib/actions/watchlist.actions";
import {CommandDialog, CommandEmpty, CommandInput, CommandList} from '@/components/ui/command';

function SearchCommand({renderAs = 'button', label = 'Add Stock', initialStocks}: SearchCommandProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
    const [isPending, startTransition] = useTransition();

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
        } catch (error: any) {
            setStocks([]);
        } finally {
            setLoading(false);
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300);

    const handleSelectStock = (symbol: string) => {
        console.log(`Selected stock: ${symbol}`);
        setOpen(false);
        setSearchTerm('');
        setStocks(initialStocks);
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

            // Perform the action
            const result = isCurrentlyInWatchlist
                ? await removeFromWatchlist(stock.symbol)
                : await addToWatchlist(stock.symbol, stock.name);

            if (result.success) {
                toast.success(result.message);
            } else {
                // Revert on failure
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
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            {renderAs === 'text' ? (
                <span className={'search-text'} onClick={() => setOpen(true)}>{label}</span>
            ) : (
                <Button className={'search-btn'} onClick={() => setOpen(true)}>{label}</Button>
            )}
            <CommandDialog open={open} onOpenChange={setOpen} className={'search-dialog'}>
                <div className={'search-field'}>
                    <CommandInput placeholder={'Search stocks...'} value={searchTerm} onValueChange={setSearchTerm} className={'search-input'}/>
                    {loading && <Loader2 className={'search-loader'}/>}
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
                                    <Link href={routes.stocksDetailsPath(stock.symbol)} onClick={() => handleSelectStock(stock.symbol)} className={'search-item-link'}>
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
            </CommandDialog>
        </>
    );
}

export {SearchCommand};
