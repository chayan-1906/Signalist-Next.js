'use server';

import {FINNHUB_API_KEY, FINNHUB_BASE_URL} from "@/lib/config";
import {formatArticle, getDateRange, validateArticle} from "@/lib/utils";

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
	const options: FinnhubFetchOptions = revalidateSeconds
		? {cache: 'force-cache', next: {revalidate: revalidateSeconds}}
		: {cache: 'no-store'};

	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	return (await response.json()) as Promise<T>;
}

async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
	try {
		const {from, to} = getDateRange(5);

		const cleanSymbols = (symbols || [])
			.map((symbol) => symbol?.trim().toUpperCase())
			.filter((symbol): symbol is string => Boolean(symbol));

		const maxArticles = 6;

		// If we have symbols, try to fetch company news per symbol and round-robin select
		if (cleanSymbols.length > 0) {
			const perSymbolArticles: Record<string, RawNewsArticle[]> = {};

			await Promise.all(
				cleanSymbols.map(async (symbol) => {
					try {
						const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
						const articles = await fetchJSON<RawNewsArticle[]>(url, 300);
						perSymbolArticles[symbol] = (articles || []).filter(validateArticle);
					} catch (error: unknown) {
						console.error('Error fetching company news for:', symbol, error);
						return;
					}
				}),
			);

			const collectedArticles: MarketNewsArticle[] = [];

			// Round-robin through symbols
			for (let round = 0; round < maxArticles; round++) {
				for (const symbol of cleanSymbols) {
					const list = perSymbolArticles[symbol] || [];
					if (list.length === 0) {
						continue;
					}
					const article = list.shift();
					if (!article || !validateArticle(article)) {
						continue;
					}
					collectedArticles.push(formatArticle(article, true, symbol, round));
					if (collectedArticles.length >= maxArticles) {
						break;
					}
				}
			}

			if (collectedArticles.length > 0) {
				// Sort by datetime desc
				collectedArticles.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
				return collectedArticles.slice(0, maxArticles);
			}
			// If none collected, fall through to general news
		}

		const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${FINNHUB_API_KEY}`;
		const general = await fetchJSON<RawNewsArticle[]>(generalUrl);

		const seenSet = new Set<string>();
		const unique: RawNewsArticle[] = [];
		for (const article of general || []) {
			if (!validateArticle(article)) {
				continue;
			}

			const key = `${article.id}-${article.url}-${article.headline}`;
			if (seenSet.has(key)) {
				continue;
			}
			seenSet.add(key);
			unique.push(article);
			if (unique.length >= 20) {
				break;
			}
		}

		const formatted = unique
			.slice(0, maxArticles)
			.map((article, index) => formatArticle(article, false, undefined, index));
		return formatted;
	} catch (error: unknown) {
		console.error('Failed to fetch news:', error);
		throw new Error('Failed to fetch news');
	}
}

export {getNews};
