import {MongoClient} from 'mongodb';
import {MONGODB_URI, NODE_ENV} from "@/lib/config";

declare global {
	var mongoClientCache: {
		client: MongoClient | null;
		promise: Promise<MongoClient> | null;
	}
}

let cached = global.mongoClientCache;

if (!cached) {
	cached = global.mongoClientCache = {client: null, promise: null};
}

const connectToMongoDB = async () => {
	if (!MONGODB_URI) {
		throw new Error('MONGODB_URI must be set within .env');
	}

	if (cached.client) {
		return cached.client;
	}

	if (!cached.promise) {
		cached.promise = MongoClient.connect(MONGODB_URI);
	}

	try {
		cached.client = await cached.promise;
	} catch (error: unknown) {
		cached.promise = null;
		throw error;
	}

	console.log(`MongoDB client connected to ${NODE_ENV}`);

	return cached.client;
}

export {connectToMongoDB};