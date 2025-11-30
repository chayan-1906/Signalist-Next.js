'use client';

import Link from "next/link";
import {Loader2, TrendingUp} from "lucide-react";
import {routes} from "@/lib/routes";
import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {CommandDialog, CommandEmpty, CommandInput, CommandList,} from '@/components/ui/command';

function SearchCommand({renderAs = 'button', label = 'Add Stock', initialStocks}: SearchCommandProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(false);
	const [stocks, setStocks] = useState<Stock[]>(initialStocks);

	const isSearchMode: boolean = !!searchTerm.trim();
	const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

	const handleSelectStock = (symbol: string) => {
		console.log(`Selected stock: ${symbol}`);
		setOpen(false);
	}

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
					) : displayStocks.length === 0 ? (
						<div className={'search-list-indicator'}>
							{isSearchMode ? 'No results found' : 'No stocks available'}
						</div>
					) : (
						<ul>
							<div className={'search-count'}>
								{isSearchMode ? 'Search results' : 'Popular stocks'}
								({displayStocks?.length || 0})
							</div>
							{displayStocks?.map((stock: Stock, index: number) => (
								<li key={stock.symbol} className={'search-item'}>
									<Link href={routes.stocksDetailsPath(stock.symbol)} onClick={handleSelectStock} className={'search-item-link'}>
										<TrendingUp className={'size-4 text-gray-500'}/>
										<div className={'flex-1'}>
											<div className={'search-item-name'}>{stock.name}</div>
											<div className={'text-sm text-gray-500'}>{stock.symbol} | {stock.exchange} | {stock.type}</div>
										</div>
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
