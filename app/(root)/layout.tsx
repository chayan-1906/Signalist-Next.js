import React from "react";
import {headers} from "next/headers";
import {Header} from "@/components/Header";
import {auth} from "@/lib/better-auth/auth";

async function Layout({children, modal}: { children: React.ReactNode; modal?: React.ReactNode }) {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session?.user) {
        return null;
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

            {/** Modal slot for intercepting routes */}
            {modal}
        </main>
    );
}

export default Layout;
