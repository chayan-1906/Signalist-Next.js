import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {auth} from '@/lib/better-auth/auth';
import {WatchlistButton} from '@/components/WatchlistButton';
import TradingViewWidget from '@/components/TradingViewWidget';
import {FINNHUB_API_KEY, FINNHUB_BASE_URL} from '@/lib/config';
import {getWatchlistSymbolsByEmail} from '@/lib/actions/watchlist.actions';
import {
	BASELINE_WIDGET_CONFIG,
	CANDLE_CHART_WIDGET_CONFIG,
	COMPANY_FINANCIALS_WIDGET_CONFIG,
	COMPANY_PROFILE_WIDGET_CONFIG,
	SYMBOL_INFO_WIDGET_CONFIG,
	TECHNICAL_ANALYSIS_WIDGET_CONFIG
} from '@/lib/constants';

export async function generateMetadata({params}: StockDetailsPageProps): Promise<Metadata> {
	const {symbol} = await params;
	const symbolUpper = symbol.toUpperCase();

	try {
		const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbolUpper}&token=${FINNHUB_API_KEY}`;
		const response = await fetch(profileUrl, {next: {revalidate: 3600}});
		const profile = response.ok ? await response.json() : {};

		const companyName = profile?.name || symbolUpper;

		return {
			title: `${symbolUpper} - ${companyName} Stock Analysis | Signalist`,
			description: `Real-time stock data, charts, and analysis for ${companyName} (${symbolUpper}). Track price movements, market trends, and financial metrics`,
			openGraph: {
				title: `${symbolUpper} - ${companyName} Stock Analysis`,
				description: `Real-time stock data and analysis for ${companyName}`,
			},
			twitter: {
				card: 'summary_large_image',
				title: `${symbolUpper} - ${companyName}`,
			},
		};
	} catch (error: any) {
		return {
			title: `${symbolUpper} Stock Analysis | Signalist`,
			description: `Real-time stock data and analysis for ${symbolUpper}`,
		};
	}
}

async function StockDetails({params}: StockDetailsPageProps) {
	const {symbol} = await params;
	const scriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-';

	// Get user session and watchlist status
	const session = await auth.api.getSession({headers: await headers()});
	const userEmail = session?.user?.email || '';
	const watchlistSymbols = await getWatchlistSymbolsByEmail(userEmail);
	const isInWatchlist = watchlistSymbols.includes(symbol.toUpperCase());

	// Format symbol for display
	const symbolUpper = symbol.toUpperCase();

	return (
		<div className={'min-h-screen'}>
			<div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
				{/* Left Column */}
				<div className={'flex flex-col gap-8'}>
					<TradingViewWidget scriptUrl={`${scriptUrl}symbol-info.js`} config={SYMBOL_INFO_WIDGET_CONFIG(symbolUpper)} height={170}/>
					<TradingViewWidget scriptUrl={`${scriptUrl}advanced-chart.js`} config={CANDLE_CHART_WIDGET_CONFIG(symbolUpper)} height={600}/>
					<TradingViewWidget scriptUrl={`${scriptUrl}advanced-chart.js`} config={BASELINE_WIDGET_CONFIG(symbolUpper)} height={600}/>
				</div>

				{/* Right Column */}
				<div className="flex flex-col gap-8">
					<TradingViewWidget scriptUrl={`${scriptUrl}financials.js`} config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbolUpper)} height={464}/>
					<TradingViewWidget scriptUrl={`${scriptUrl}symbol-profile.js`} config={COMPANY_PROFILE_WIDGET_CONFIG(symbolUpper)} height={440}/>
					<TradingViewWidget scriptUrl={`${scriptUrl}financials.js`} config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbolUpper)} height={464}/>
					<WatchlistButton symbol={symbolUpper} company={symbolUpper} isInWatchlist={isInWatchlist}/>
					<TradingViewWidget scriptUrl={`${scriptUrl}technical-analysis.js`} config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbolUpper)} height={400}/>
				</div>
			</div>
		</div>
	);
}

export default StockDetails;
