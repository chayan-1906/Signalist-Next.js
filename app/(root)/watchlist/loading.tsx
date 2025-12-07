'use client';

function WatchlistLoadingPage() {
    return (
        <div className={'mx-auto max-w-screen-2xl px-4 md:px-6 lg:px-8 py-10'}>
            {/* Header Skeleton */}
            <div className={'mb-8'}>
                <div className={'h-10 w-48 bg-gray-800 rounded-lg animate-pulse mb-3'}/>
                <div className={'h-5 w-96 bg-gray-800 rounded-lg animate-pulse'}/>
            </div>

            {/* Table Skeleton */}
            <div className={'bg-gray-800 rounded-lg border border-gray-600 overflow-hidden'}>
                {/* Table Header */}
                <div className={'grid grid-cols-5 gap-4 p-4 bg-gray-700 border-b border-gray-600'}>
                    <div className={'h-4 bg-gray-600 rounded animate-pulse'}/>
                    <div className={'h-4 bg-gray-600 rounded animate-pulse'}/>
                    <div className={'h-4 bg-gray-600 rounded animate-pulse'}/>
                    <div className={'h-4 bg-gray-600 rounded animate-pulse'}/>
                    <div className={'h-4 bg-gray-600 rounded animate-pulse'}/>
                </div>

                {/* Table Rows */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={'grid grid-cols-5 gap-4 p-4 border-b border-gray-700 last:border-b-0'}>
                        {/* Symbol & Company */}
                        <div className={'flex flex-col gap-2'}>
                            <div className={'h-5 w-20 bg-gray-700 rounded animate-pulse'}/>
                            <div className={'h-4 w-32 bg-gray-700 rounded animate-pulse'}/>
                        </div>
                        {/* Price */}
                        <div className={'h-5 w-24 bg-gray-700 rounded animate-pulse'}/>
                        {/* Change */}
                        <div className={'h-5 w-20 bg-gray-700 rounded animate-pulse'}/>
                        {/* Market Cap */}
                        <div className={'h-5 w-28 bg-gray-700 rounded animate-pulse'}/>
                        {/* Actions */}
                        <div className={'size-8 bg-gray-700 rounded animate-pulse'}/>
                    </div>
                ))}
            </div>

            {/* News Section Skeleton */}
            <div className={'mt-12'}>
                <div className={'h-8 w-40 bg-gray-800 rounded-lg animate-pulse mb-6'}/>
                <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                    {[...Array(6)].map((_, index: number) => (
                        <div key={index} className={'bg-gray-800 rounded-lg border border-gray-600 p-4'}>
                            <div className={'h-40 bg-gray-700 rounded-lg animate-pulse mb-4'}/>
                            <div className={'h-5 bg-gray-700 rounded animate-pulse mb-2'}/>
                            <div className={'h-4 w-3/4 bg-gray-700 rounded animate-pulse'}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WatchlistLoadingPage;
