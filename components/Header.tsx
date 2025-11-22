import Link from "next/link";
import Image from "next/image";
import {routes} from "@/lib/routes";
import {NavItems} from "@/components/NavItems";
import {UserDropdown} from "@/components/UserDropdown";

function Header({user}: { user: User }) {
	return (
		<header className={'sticky top-0 header'}>
			<div className={'container header-wrapper'}>
				{/** Logo */}
				<Link href={routes.homePath}>
					<Image src={'/assets/icons/logo.svg'} alt={'Signalist Logo'} width={140} height={32} className={'h-8 w-auto cursor-pointer'}/>
				</Link>

				{/** Nav */}
				<nav className={'hidden sm:block'}>
					<NavItems/>
				</nav>

				{/** User Dropdown */}
				<UserDropdown user={user}/>
			</div>
		</header>
	);
}

export {Header};
