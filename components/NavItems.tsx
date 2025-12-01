'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {routes} from "@/lib/routes";
import {NAV_ITEMS} from "@/lib/constants";
import {SearchCommand} from "@/components/SearchCommand";

function NavItems({initialStocks}: { initialStocks: StockWithWatchlistStatus[] }) {
	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === routes.homePath) return pathname === routes.homePath;

		return pathname.startsWith(path);
	}

	return (
		<ul className={'flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'}>
			{NAV_ITEMS.map(({href, label}) => {
				if (label === 'Search') {
					return (
						<li key={'search-trigger'}>
							<SearchCommand renderAs={'text'} label={'Search'} initialStocks={initialStocks}/>
						</li>
					);
				}

				return (
					<li key={href}>
						<Link href={href} className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : ''}`}>{label}</Link>
					</li>
				);
			})}
		</ul>
	);
}

export {NavItems};
