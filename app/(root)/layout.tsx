import React from "react";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {routes} from "@/lib/routes";
import {Header} from "@/components/Header";
import {auth} from "@/lib/better-auth/auth";

async function Layout({children}: { children: React.ReactNode }) {
	const session = await auth.api.getSession({headers: await headers()});

	if (!session?.user) {
		redirect(routes.signInPath);
	}

	const user = {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
	};

	return (
		<main className={'min-h-screen text-gray-400'}>
			{/** Header */}
			<Header user={user}/>

			<div className={'container py-10'}>
				{children}
			</div>
		</main>
	);
}

export default Layout;
