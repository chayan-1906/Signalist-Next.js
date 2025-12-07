import Link from "next/link";
import Image from "next/image";
import {routes} from "@/lib/routes";
import {NavItems} from "@/components/NavItems";
import {UserDropdown} from "@/components/UserDropdown";
import {searchStocks} from "@/lib/actions/finnhub.actions";

async function Header({user}: { user: User }) {
    const initialStocks = await searchStocks();

    return (
        <header className={'sticky top-0 header'}>
            <div className={'container header-wrapper'}>
                {/** Logo */}
                <Link href={routes.homePath}>
                    <Image src={'/assets/icons/logo.svg'} alt={'Signalist Logo'} width={140} height={32} className={'h-8 w-auto cursor-pointer'}/>
                </Link>

                {/** Nav */}
                <nav className={'hidden sm:block'}>
                    <NavItems initialStocks={initialStocks}/>
                </nav>

                {/** User Dropdown */}
                <UserDropdown user={user} initialStocks={initialStocks}/>
            </div>
        </header>
    );
}

export {Header};
