'use client';

import {LogOut} from "lucide-react";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {routes} from "@/lib/routes";
import {Button} from "@/components/ui/button";
import {NavItems} from "@/components/NavItems";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

function UserDropdown({user}: { user: User }) {
	const router = useRouter();

	const randomBgColors = [
		'bg-yellow-500 text-pink-800',
		'bg-emerald-300 text-emerald-800',
		'bg-purple-300 text-purple-800',
		'bg-slate-300 text-slate-800',
		'bg-pink-300 text-pink-800',
	];

	const handleSignOut = async () => router.push(routes.signInPath);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={'ghost'} className={'flex items-center gap-3'}>
					<Avatar className={'size-8'}>
						{/*<AvatarImage src={'https://avatars.githubusercontent.com/u/124599'}/>*/}
						<AvatarFallback className={cn('text-sm font-bold', randomBgColors[Math.floor(Math.random() * randomBgColors.length)])}>{user.name[0]}</AvatarFallback>
					</Avatar>
					<div className={'hidden md:flex flex-col items-start'}>
						<span className={'text-base font-medium text-gray-400'}>{user.name}</span>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className={'text-gray-400'} align={'start'} sideOffset={10}>
				<DropdownMenuLabel>
					<div className={'flex relative items-center gap-3 py-2'}>
						<Avatar className={'size-10'}>
							<AvatarImage src={'https://avatars.githubusercontent.com/u/124599'}/>
							<AvatarFallback className={'bg-yellow-500 text-yellow-900 text-sm font-bold'}>{user.name[0]}</AvatarFallback>
						</Avatar>
						<div className={'flex flex-col'}>
							<span className={'text-base font-medium text-gray-400'}>{user.name}</span>
							<span className={'text-base text-gray-500'}>{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className={'bg-gray-600'}/>
				<DropdownMenuItem className={'text-gray-100 text-sm font-medium focus:bg-transparent focus:text-yellow-500 transition-colors'} onClick={handleSignOut}>
					<LogOut className={'hidden sm:block size-4 mr-2'}/>
					Logout
				</DropdownMenuItem>
				<DropdownMenuSeparator className={'hidden sm:block bg-gray-600'}/>
				<nav className={'sm:hidden'}>
					<NavItems/>
				</nav>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export {UserDropdown};
