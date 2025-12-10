'use server';

import {headers} from "next/headers";
import {auth} from '@/lib/better-auth/auth';
import {inngest} from "@/lib/inngest/client";

const signUpWithEmail = async ({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData): Promise<SignUpResponse> => {
    try {
        if (!email || typeof email !== 'string' || email.trim().length === 0) {
            return {success: false, error: 'Email is required'};
        }

        if (!email.includes('@')) {
            return {success: false, error: 'Invalid email format'};
        }

        if (!password || typeof password !== 'string' || password.length < 8) {
            return {success: false, error: 'Password must be at least 8 characters'};
        }

        if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
            return {success: false, error: 'Full name is required'};
        }

        if (fullName.length > 100) {
            return {success: false, error: 'Full name must be 100 characters or less'};
        }

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
        console.error('Sign up failed:', error);
        return {success: false, error: 'Sign up failed'};
    }
}

const signInWithEmail = async ({email, password}: SignInFormData): Promise<SignInResponse> => {
    try {
        if (!email || typeof email !== 'string' || email.trim().length === 0) {
            return {success: false, error: 'Email is required', errorType: 'invalid_credentials' as const};
        }

        if (!email.includes('@')) {
            return {success: false, error: 'Invalid email format', errorType: 'invalid_credentials' as const};
        }

        if (!password || typeof password !== 'string' || password.length === 0) {
            return {success: false, error: 'Password is required', errorType: 'invalid_credentials' as const};
        }

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
        console.error('Sign in failed:', error);

        const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
        console.error('errorMessage:', errorMessage);

        if (errorMessage.includes('invalid email or password')) {
            return {
                success: false,
                error: 'Invalid email or password. Please try again.',
                errorType: 'invalid_credentials' as const,
            };
        }

        return {
            success: false,
            error: 'Sign in failed. Please try again.',
            errorType: 'unknown' as const,
        };
    }
}

const signOut = async (): Promise<SignOutResponse> => {
    try {
        await auth.api.signOut({headers: await headers()});
        return {success: true};
    } catch (error: any) {
        console.error('Sign out failed:', error);
        return {
            success: false,
            error: 'Sign out failed',
        };
    }
}

export {signUpWithEmail, signInWithEmail, signOut};
