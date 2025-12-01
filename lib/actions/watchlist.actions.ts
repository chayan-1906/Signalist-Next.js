'use server';

import {headers} from 'next/headers';
import {auth} from '@/lib/better-auth/auth';
import {connectToDatabase} from '@/database/mongoose';
import Watchlist from '@/database/models/watchlist.model';

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

export {getWatchlistSymbolsByEmail, addToWatchlist, removeFromWatchlist};
