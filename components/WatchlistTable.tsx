'use client';

import Link from 'next/link';
import {useState} from 'react';
import {cn} from '@/lib/utils';
import {routes} from '@/lib/routes';
import {WATCHLIST_TABLE_HEADER} from '@/lib/constants';
import {WatchlistButton} from '@/components/WatchlistButton';

function WatchlistTable({watchlist: initialWatchlist}: WatchlistTableProps) {
    const [watchlist, setWatchlist] = useState(initialWatchlist);

    const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
        if (!isAdded) {
            setWatchlist(prev => prev.filter((stock: StockWithData) => stock.symbol !== symbol));
        }
    }

    if (watchlist.length === 0) {
        return (
            <div className={'flex flex-col items-center justify-center py-16 text-center'}>
                <h2 className={'text-2xl font-semibold text-gray-100 mb-2'}>Your watchlist is empty</h2>
                <p className={'text-gray-400 mb-6'}>Start adding stocks to track their performance</p>
            </div>
        );
    }

    return (
        <div className={'overflow-x-auto'}>
            <table className={'w-full border-collapse'}>
                {/** Table Header */}
                <thead>
                <tr className={'border-b border-gray-700'}>
                    {WATCHLIST_TABLE_HEADER.map((header) => (
                        <th key={header} className={'px-4 py-3 text-sm text-left font-semibold text-gray-300'}>
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>

                {/** Table Body */}
                <tbody>
                {watchlist.map(({symbol, company, priceFormatted, changePercent, changeFormatted, marketCap, peRatio}) => (
                    <tr key={symbol} className={'border-b border-gray-800 hover:bg-gray-900/50 transition-colors'}>
                        {/** Company */}
                        <td className={'px-4 py-4'}>
                            <Link href={routes.stocksDetailsPath(symbol)} className={'text-gray-100 hover:text-yellow-500 transition-colors font-medium'}>{company}</Link>
                        </td>

                        {/** Symbol */}
                        <td className={'p-4'}>
                            <span className={'text-gray-300 font-mono'}>{symbol}</span>
                        </td>

                        {/** Price */}
                        <td className={'p-4'}>
                            <span className="text-gray-100">{priceFormatted}</span>
                        </td>

                        {/* Change */}
                        <td className={'p-4'}>
							<span className={cn('font-medium', changePercent && changePercent > 0 ? 'text-green-500' : changePercent && changePercent < 0 ? 'text-red-500' : 'text-gray-400')}>
								{changeFormatted}
							</span>
                        </td>

                        {/** Market Cap */}
                        <td className={'p-4'}>
                            <span className={'text-gray-300'}>{marketCap}</span>
                        </td>

                        {/** P/E Ratio */}
                        <td className={'p-4'}>
                            <span className={'text-gray-300'}>{peRatio}</span>
                        </td>

                        {/** Alert */}
                        <td className={'p-4'}>
                            <span className={'text-gray-500 text-sm'}>-</span>
                        </td>

                        {/** Action */}
                        <td className={'p-4'}>
                            <WatchlistButton
                                symbol={symbol}
                                company={company}
                                isInWatchlist={true}
                                showTrashIcon={true}
                                type={'icon'}
                                onWatchlistChange={handleWatchlistChange}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export {WatchlistTable};
