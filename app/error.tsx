'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {AlertTriangle, Home, RefreshCw} from 'lucide-react';
import {routes} from "@/lib/routes";
import {Button} from '@/components/ui/button';
import {NODE_ENV, SUPPORT_EMAIL} from "@/lib/config";

function ErrorPage({error, reset}: ErrorPageProps) {
	const router = useRouter();

	useEffect(() => {
		console.error('Application error:', error);
	}, [error]);

	return (
		<div className={'min-h-screen flex items-center justify-center px-4 py-16'}>
			<div className={'flex flex-col items-center justify-center text-center max-w-2xl'}>
				{/* Error Icon */}
				<div className={'mb-8 relative'}>
					<div className={'absolute inset-0 bg-red-500/10 blur-3xl rounded-full'}/>
					<AlertTriangle className={'size-24 text-destructive relative z-10'} strokeWidth={1.5}/>
				</div>

				{/* Error Title */}
				<h1 className={'text-4xl font-bold text-gray-100 mb-4'}>Oops! Something went wrong</h1>

				{/* Error Description */}
				<p className={'text-gray-400 text-lg mb-2'}>We encountered an unexpected error. This might be due to:</p>
				<ul className={'text-gray-500 text-sm mb-8 space-y-1'}>
					<li>• Temporary server issue</li>
					<li>• Network connectivity problem</li>
					<li>• Application configuration error</li>
				</ul>

				{/* Error Details (for development) */}
				{NODE_ENV === 'development' && (
					<div className={'mb-8 p-4 bg-gray-800 border border-gray-600 rounded-lg max-w-lg'}>
						<p className={'text-xs text-gray-500 font-mono text-left break-all'}>{error.message}</p>
						{error.digest && (
							<p className={'text-xs text-gray-600 font-mono mt-2'}>Error ID: {error.digest}</p>
						)}
					</div>
				)}

				{/* Action Buttons */}
				<div className={'flex flex-col sm:flex-row gap-4 w-full sm:w-auto'}>
					<Button onClick={reset} className={'yellow-btn flex items-center justify-center gap-2 min-w-[160px]'}>
						<RefreshCw className={'size-4'}/>
						Try Again
					</Button>
					<Button onClick={() => router.push(routes.homePath)} variant={'outline'}
					        className={'flex items-center justify-center gap-2 min-w-[160px] border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-gray-100'}>
						<Home className={'size-4'}/>
						Go Home
					</Button>
				</div>

				{/* Additional Help */}
				<p className={'text-gray-500 text-sm mt-8'}>
					Need help?{' '}
					<a href={`mailto:${SUPPORT_EMAIL}`} className={'text-blue-600 hover:text-blue-500 transition-colors underline'}>
						Contact Support
					</a>
				</p>
			</div>
		</div>
	);
}

export default ErrorPage;
