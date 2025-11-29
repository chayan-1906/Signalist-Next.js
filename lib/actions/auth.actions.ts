'use server';

import {headers} from "next/headers";
import {auth} from '@/lib/better-auth/auth';
import {inngest} from "@/lib/inngest/client";

const signUpWithEmail = async ({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData) => {
	try {
		const response = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: fullName,
			},
		});

		if (response) {
			await inngest.send({
				name: 'app/user.created',
				data: {
					email,
					name: fullName,
					country,
					investmentGoals,
					riskTolerance,
					preferredIndustry,
				},
			});
		}

		return {
			success: true,
			data: response,
		};
	} catch (error: unknown) {
		console.log('Sign up failed:', error);
		return {success: false, error: 'Sign up failed'};
	}
}

const signInWithEmail = async ({email, password}: SignInFormData) => {
	try {
		const response = await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		return {
			success: true,
			data: response,
		};
	} catch (error: unknown) {
		console.log('Sign in failed:', error);
		return {success: false, error: 'Sign in failed'};
	}
}

const signOut = async () => {
	try {
		await auth.api.signOut({headers: await headers()});
	} catch (error: any) {
		console.error('Sign out failed:', error);
		return {
			success: false,
			error: 'Sign out failed',
		};
	}
}

export {signUpWithEmail, signInWithEmail, signOut};
