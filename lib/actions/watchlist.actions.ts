'use server';

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

export {getWatchlistSymbolsByEmail};
