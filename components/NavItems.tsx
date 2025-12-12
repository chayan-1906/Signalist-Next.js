"use client";

import Link from "next/link";
import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {routes} from "@/lib/routes";
import {NAV_ITEMS} from "@/lib/constants";

function NavItems() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => {
        if (path === routes.homePath) return pathname === routes.homePath;

        return pathname.startsWith(path);
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                router.push(routes.searchPath, {scroll: false});
            }
        }

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [router]);

    return (
        <ul className={'flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'}>
            {NAV_ITEMS.map(({href, label}) => (
                <li key={href}>
                    <Link href={href} scroll={href !== routes.searchPath} className={`hover:text-yellow-500 transition-colors ${isActive(href) ? 'text-gray-100' : ''}`}>
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export {NavItems};
