import {betterAuth} from "better-auth";
import {nextCookies} from "better-auth/next-js";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import {connectToDatabase} from "@/database/mongoose";
import {BETTER_AUTH_SECRET, BETTER_AUTH_URL} from "@/lib/config";

let authInstance: ReturnType<typeof betterAuth> | null = null;

const getAuth = async () => {
	if (authInstance) return authInstance;

	const mongoose = await connectToDatabase();
	const db = mongoose.connection.db;

	if (!db) {
		throw new Error('MongoDB connection not found')
	}

	authInstance = betterAuth({
		database: mongodbAdapter(db as any),
		secret: BETTER_AUTH_SECRET,
		baseURL: BETTER_AUTH_URL,
		emailAndPassword: {
			enabled: true,
			disableSignUp: false,
			requireEmailVerification: false,
			minPasswordLength: 8,
			maxPasswordLength: 128,
			autoSignIn: true,
		},
		plugins: [
			nextCookies(),
		],
	});

	return authInstance;
}

export {getAuth};

export const auth = await getAuth();
