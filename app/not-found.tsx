import Link from 'next/link';
import {FileQuestion, Home, Search} from 'lucide-react';
import {routes} from '@/lib/routes';
import {Button} from '@/components/ui/button';

function NotFoundPage() {
    return (
        <div className={'min-h-screen flex items-center justify-center px-4 py-16'}>
            <div className={'flex flex-col items-center justify-center text-center max-w-2xl'}>
                {/* 404 Icon */}
                <div className={'mb-8 relative'}>
                    <div className={'absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full'}/>
                    <FileQuestion className={'size-24 text-yellow-400 relative z-10'} strokeWidth={1.5}/>
                </div>

                {/* Error Code */}
                <div className={'mb-4'}>
                    <h1 className={'text-8xl font-bold text-gray-700 mb-2'}>404</h1>
                    <h2 className={'text-3xl font-bold text-gray-100'}>Page Not Found</h2>
                </div>

                {/* Description */}
                <p className={'text-gray-400 text-lg mb-8 max-w-md'}>The page you're looking for doesn't exist or has been moved.</p>

                {/* Action Buttons */}
                <div className={'flex flex-col sm:flex-row gap-4 w-full sm:w-auto'}>
                    <Button asChild className={'yellow-btn flex items-center justify-center gap-2 min-w-[160px]'}>
                        <Link href={routes.homePath}>
                            <Home className={'size-4'}/>
                            Go Home
                        </Link>
                    </Button>
                    <Button asChild variant={'outline'}
                            className={'flex items-center justify-center gap-2 min-w-[160px] border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-gray-100'}>
                        <Link href={routes.watchlistPath}>
                            <Search className={'size-4'}/>
                            View Watchlist
                        </Link>
                    </Button>
                </div>

                {/* Additional Links */}
                <div className={'mt-12 text-sm text-gray-500'}>
                    <p className={'mb-2'}>Looking for something?</p>
                    <div className={'flex flex-wrap gap-4 justify-center'}>
                        <Link href={routes.homePath} className={'text-blue-600 hover:text-blue-500 transition-colors underline'}>Home</Link>
                        <Link href={routes.watchlistPath} className={'text-blue-600 hover:text-blue-500 transition-colors underline'}>Watchlist</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
