'use server';

import {headers} from 'next/headers';
import {auth} from '@/lib/better-auth/auth';
import {formatMarketCap} from "@/lib/utils";
import {connectToDatabase} from '@/database/mongoose';
import Watchlist from '@/database/models/watchlist.model';
import {FINNHUB_API_KEY, FINNHUB_BASE_URL} from "@/lib/config";

const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
	try {
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;

		if (!db) {
			throw new Error('Mongoose connection not found');
		}

		// Better Auth stores users in the "user" collection
		const user = await db.collection('user').findOne({email});

		if (!user) {
			console.log(`No user found with email: ${email}`);
			return [];
		}

		const userId = (user.id as String) || String(user._id || '');

		if (!userId) {
			console.log(`User found but no valid ID for email: ${email}`);
			return [];
		}

		// Query watchlist by userId and return symbols
		const watchlistItems = await Watchlist.find({userId}, {symbol: 1}).lean();

		return watchlistItems.map((item) => String(item.symbol));
	} catch (error: unknown) {
		console.error('Error fetching watchlist symbols by email:', error);
		return [];
	}
}

const addToWatchlist = async (symbol: string, company: string): Promise<{ success: boolean; message: string }> => {
	try {
		const session = await auth.api.getSession({headers: await headers()});

		if (!session?.user) {
			return {success: false, message: 'Unauthorized'};
		}

		await connectToDatabase();

		const existingItem = await Watchlist.findOne({
			userId: session.user.id,
			symbol: symbol.toUpperCase(),
		});

		if (existingItem) {
			return {success: false, message: 'Already in watchlist'};
		}

		await Watchlist.create({
			userId: session.user.id,
			symbol: symbol.toUpperCase(),
			company,
			addedAt: new Date(),
		});

		return {success: true, message: 'Added to watchlist'};
	} catch (error: unknown) {
		console.error('Error adding to watchlist:', error);
		return {success: false, message: 'Failed to add to watchlist'};
	}
}

const removeFromWatchlist = async (symbol: string): Promise<{ success: boolean; message: string }> => {
	try {
		const session = await auth.api.getSession({headers: await headers()});

		if (!session?.user) {
			return {success: false, message: 'Unauthorized'};
		}

		await connectToDatabase();

		const result = await Watchlist.deleteOne({
			userId: session.user.id,
			symbol: symbol.toUpperCase(),
		});

		if (result.deletedCount === 0) {
			return {success: false, message: 'Not found in watchlist'};
		}

		return {success: true, message: 'Removed from watchlist'};
	} catch (error: unknown) {
		console.error('Error removing from watchlist:', error);
		return {success: false, message: 'Failed to remove from watchlist'};
	}
}

const getUserWatchlist = async (): Promise<StockWithData[]> => {
	try {
		const session = await auth.api.getSession({headers: await headers()});

		if (!session?.user) {
			return [];
		}

		await connectToDatabase();

		// Get watchlist items for the user
		const watchlistItems = await Watchlist.find({userId: session.user.id})
			.sort({addedAt: -1})
			.lean();

		if (watchlistItems.length === 0) {
			return [];
		}

		const stocksWithData = await Promise.all(
			watchlistItems.map(async ({userId, symbol, company, addedAt}) => {
				try {
					// Fetch quote data (current price, change)
					const quoteUrl = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
					const quoteResponse = await fetch(quoteUrl, {next: {revalidate: 60}});
					const quote: QuoteData = quoteResponse.ok ? await quoteResponse.json() : {};

					// Fetch company profile (market cap)
					const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
					const profileResponse = await fetch(profileUrl, {next: {revalidate: 3600}});
					const profile: ProfileData = profileResponse.ok ? await profileResponse.json() : {};

					// Fetch basic financials (P/E ratio)
					const financialsUrl = `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
					const financialsResponse = await fetch(financialsUrl, {next: {revalidate: 3600}});
					const financials: FinancialsData = financialsResponse.ok ? await financialsResponse.json() : {};

					const currentPrice = quote?.c ?? 0;
					const changePercent = quote?.dp ?? 0;
					const marketCap = profile?.marketCapitalization ?? 0;
					const peRatio = financials?.metric?.peBasicExclExtraTTM ?? financials?.metric?.peNormalizedAnnual ?? 0;

					return {
						userId,
						symbol,
						company: company || profile?.name || symbol,
						addedAt,
						currentPrice,
						changePercent,
						priceFormatted: currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'N/A',
						changeFormatted: changePercent !== 0 ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%` : 'N/A',
						marketCap: marketCap > 0 ? formatMarketCap(marketCap) : 'N/A',
						peRatio: peRatio > 0 ? peRatio.toFixed(2) : 'N/A',
					} as StockWithData;
				} catch (error: any) {
					console.error(`Error fetching data for ${symbol}:`, error);
					return {
						userId,
						symbol,
						company,
						addedAt,
						priceFormatted: 'N/A',
						changeFormatted: 'N/A',
						marketCap: 'N/A',
						peRatio: 'N/A',
					} as StockWithData;
				}
			}),
		);

		console.log('stocksWithData:', stocksWithData);
		return stocksWithData;
	} catch (error: any) {
		console.error('Error fetching user watchlist:', error);
		return [];
	}
}

export {getWatchlistSymbolsByEmail, addToWatchlist, removeFromWatchlist, getUserWatchlist};
