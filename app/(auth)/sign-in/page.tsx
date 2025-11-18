'use client';

import {useForm} from "react-hook-form";
import {routes} from "@/lib/routes";
import {Button} from "@/components/ui/button";
import {FooterLink} from "@/components/forms/FooterLink";
import {InputField} from "@/components/forms/inputField";

function SignInPage() {
	const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignInFormData>({
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onBlur',
	});

	const onSubmit = async (data: SignInFormData) => {
		try {
			console.log(data);
		} catch (error: unknown) {
			console.error(error);
		}
	}

	return (
		<>
			<h1 className={'form-title'}>Welcome Back</h1>
			<form onSubmit={handleSubmit(onSubmit)} className={'space-y-5'}>
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
