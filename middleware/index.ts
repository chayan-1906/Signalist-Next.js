import {getSessionCookie} from "better-auth/cookies";
import {NextRequest, NextResponse} from "next/server";
import {routes} from "@/lib/routes";

async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	if (!sessionCookie) {
		return NextResponse.redirect(new URL(routes.homePath, request.url));
	}

	return NextResponse.next();
}

const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
	],
};

export {middleware, config};
