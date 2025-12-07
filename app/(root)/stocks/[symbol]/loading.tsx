'use client';

function StocksLoadingPage() {
    return (
        <div className={'mx-auto max-w-screen-2xl px-4 md:px-6 lg:px-8 py-10'}>
            {/* Header Skeleton */}
            <div className={'mb-8 flex items-start justify-between'}>
                <div className={'flex-1'}>
                    <div className={'flex items-center gap-3 mb-3'}>
                        <div className={'h-10 w-32 bg-gray-800 rounded-lg animate-pulse'}/>
                        <div className={'h-8 w-24 bg-gray-800 rounded-full animate-pulse'}/>
                    </div>
                    <div className={'h-6 w-64 bg-gray-800 rounded-lg animate-pulse mb-4'}/>
                    <div className={'flex items-center gap-6'}>
                        <div className={'h-8 w-28 bg-gray-800 rounded-lg animate-pulse'}/>
                        <div className={'h-6 w-20 bg-gray-800 rounded-lg animate-pulse'}/>
                    </div>
                </div>
                <div className={'h-10 w-40 bg-gray-800 rounded-lg animate-pulse'}/>
            </div>

            {/* Chart Grid Skeleton */}
            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'}>
                {/* Main Chart */}
                <div className={'bg-gray-800 rounded-lg border border-gray-600 p-6'}>
                    <div className={'h-6 w-40 bg-gray-700 rounded animate-pulse mb-4'}/>
                    <div className={'h-[400px] bg-gray-700 rounded-lg animate-pulse flex items-center justify-center'}>
                        <div className={'flex flex-col items-center gap-3'}>
                            <div className={'size-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin'}/>
                            <p className={'text-gray-500 text-sm'}>Loading chart...</p>
                        </div>
                    </div>
                </div>

                {/* Company Profile */}
                <div className={'bg-gray-800 rounded-lg border border-gray-600 p-6'}>
                    <div className={'h-6 w-48 bg-gray-700 rounded animate-pulse mb-4'}/>
                    <div className={'h-[400px] bg-gray-700 rounded-lg animate-pulse'}/>
                </div>

                {/* Technical Analysis */}
                <div className={'bg-gray-800 rounded-lg border border-gray-600 p-6'}>
                    <div className={'h-6 w-52 bg-gray-700 rounded animate-pulse mb-4'}/>
                    <div className={'h-[400px] bg-gray-700 rounded-lg animate-pulse flex items-center justify-center'}>
                        <div className={'flex flex-col items-center gap-3'}>
                            <div className={'size-12 border-4 border-gray-600 border-t-yellow-400 rounded-full animate-spin'}/>
                            <p className={'text-gray-500 text-sm'}>Loading analysis...</p>
                        </div>
                    </div>
                </div>

                {/* Financials */}
                <div className={'bg-gray-800 rounded-lg border border-gray-600 p-6'}>
                    <div className={'h-6 w-44 bg-gray-700 rounded animate-pulse mb-4'}/>
                    <div className={'h-[400px] bg-gray-700 rounded-lg animate-pulse'}/>
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className={'grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={'bg-gray-800 rounded-lg border border-gray-600 p-4'}>
                        <div className={'h-4 w-24 bg-gray-700 rounded animate-pulse mb-2'}/>
                        <div className={'h-6 w-32 bg-gray-700 rounded animate-pulse'}/>
                    </div>
                ))}
            </div>

            {/* News Section Skeleton */}
            <div className={'bg-gray-800 rounded-lg border border-gray-600 p-6'}>
                <div className={'h-6 w-48 bg-gray-700 rounded animate-pulse mb-6'}/>
                <div className={'space-y-4'}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={'flex gap-4 pb-4 border-b border-gray-700 last:border-b-0'}>
                            <div className={'size-20 bg-gray-700 rounded-lg animate-pulse flex-shrink-0'}/>
                            <div className={'flex-1'}>
                                <div className={'h-5 bg-gray-700 rounded animate-pulse mb-2 w-3/4'}/>
                                <div className={'h-4 bg-gray-700 rounded animate-pulse mb-2'}/>
                                <div className={'h-3 bg-gray-700 rounded animate-pulse w-1/4'}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StocksLoadingPage;
