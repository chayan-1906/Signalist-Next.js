import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {getSessionCookie} from "better-auth/cookies";
import {routes} from "@/lib/routes";

export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const {pathname} = request.nextUrl;

    const isAuthPage = pathname === routes.signInPath || pathname === routes.signUpPath;

    if (isAuthPage) {
        if (sessionCookie) {
            // Redirect logged-in users away from auth pages
            return NextResponse.redirect(new URL(routes.homePath, request.url));
        } else {
            // Allow anonymous users to access auth pages
            return NextResponse.next();
        }
    }

    // Redirect anonymous users trying to access protected pages
    if (!sessionCookie) {
        return NextResponse.redirect(new URL(routes.signInPath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
    ],
};

// export {proxy, config};
