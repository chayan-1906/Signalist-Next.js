'use client';

import {toast} from "sonner";
import {useState} from 'react';
import {AlertCircle} from 'lucide-react';
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {routes} from "@/lib/routes";
import {Button} from "@/components/ui/button";
import {FooterLink} from "@/components/forms/FooterLink";
import {InputField} from "@/components/forms/inputField";
import {signInWithEmail} from "@/lib/actions/auth.actions";

function SignInPage() {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: SignInFormData) => {
        setErrorMessage(null);

        try {
            const result = await signInWithEmail(data);
            if (result.success) {
                router.push(routes.homePath);
            } else {
                setErrorMessage(result.error);
                toast.error('Sign in failed', {description: result.error || 'Please check your credentials and try again.'});
            }
        } catch (error: any) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            setErrorMessage(message);
            toast.error('Sign in failed', {description: message});
        }
    }

    return (
        <>
            <h1 className={'form-title'}>Welcome Back</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={'space-y-5'}>
                {/** Error Message Display */}
                {errorMessage && (
                    <div className={'bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3'}>
                        <AlertCircle className={'size-5 text-red-500 flex-shrink-0 mt-0.5'}/>
                        <div className={'flex-1'}>
                            <p className={'text-red-500 font-medium text-sm'}>{errorMessage}</p>
                        </div>
                    </div>
                )}

                {/** Email */}
                <InputField name={'email'} label={'Email Address'} placeholder={'john.doe@gmail.com'} register={register} error={errors.email}
                            validation={{required: 'Email address is required', pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Email address is required'}}/>

                {/** Password */}
                <InputField name={'password'} label={'Password'} placeholder={'Enter your password'} type={'password'} register={register} error={errors.password}
                            validation={{required: 'Password is required', minLength: 8}}/>

                <Button type={'submit'} disabled={isSubmitting} className={'yellow-btn w-full mt-5'}>
                    {isSubmitting ? 'Signing in' : 'Sign In'}
                </Button>

                <FooterLink text={"Don't have an account?"} linkText={'Sign Up'} href={routes.signUpPath}/>
            </form>
        </>
    );
}

export default SignInPage;
