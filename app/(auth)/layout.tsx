import React from "react";
import Link from "next/link";
import Image from "next/image";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {routes} from "@/lib/routes";
import {auth} from "@/lib/better-auth/auth";

async function AuthLayout({children}: { children: React.ReactNode }) {
	const session = await auth.api.getSession({headers: await headers()});

	if (session?.user) {
		redirect(routes.homePath);
	}

	return (
		<main className={'auth-layout'}>
			<section className={'auth-left-section scrollbar-hide-default'}>
				{/** Logo */}
				<Link href={'/'} className={'auth-logo'}>
					<Image src={'/assets/icons/logo.svg'} alt={'Signalist logo'} width={140} height={32} className={'h-8 w-auto'}/>
				</Link>

				<div className={'pb-6 lg:pb-8 flex-1'}>{children}</div>
			</section>

			<section className={'auth-right-section'}>
				<div className={'z-10 relative lg:mt-4 lg:mb-16'}>
					{/** Blockquote */}
					<blockquote className={'auth-blockquote'}>
						Signalist turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
					</blockquote>
					<div className={'flex items-center justify-between'}>
						{/** Cite */}
						<div>
							<cite className={'auth-testimonial-author'}>- Ethan R.</cite>
							<p className={'max-md:text-xs text-gray-500'}>Retail Investor</p>
						</div>

						{/** Rating */}
						<div className={'flex items-center gap-0.5'}>
							{Array(5).fill(null).map((_, i) => (
								<Image key={i} src={'/assets/icons/star.svg'} alt={'Star'} height={20} width={20} className={'size-5'}/>
							))}
						</div>
					</div>
				</div>

				{/** Dashboard image */}
				<div className={'flex-1 relative'}>
					<Image src={'/assets/images/dashboard.png'} alt={'Dashboard Preview'} height={1150} width={1440} className={'auth-dashboard-preview absolute top-0'}/>
				</div>
			</section>
		</main>
	);
}

export default AuthLayout;
