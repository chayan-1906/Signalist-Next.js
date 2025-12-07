'use server';

import {headers} from "next/headers";
import {auth} from '@/lib/better-auth/auth';
import {inngest} from "@/lib/inngest/client";

const signUpWithEmail = async ({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData): Promise<SignUpResponse> => {
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

const signInWithEmail = async ({email, password}: SignInFormData): Promise<SignInResponse> => {
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

        const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
        console.log('errorMessage:', errorMessage);

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
