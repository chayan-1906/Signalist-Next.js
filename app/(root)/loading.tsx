'use client';

import {Loader2} from 'lucide-react';

function LoadingPage() {
	return (
		<div className={'min-h-screen flex items-center justify-center'}>
			<div className={'flex flex-col items-center gap-4'}>
				{/* Animated Spinner */}
				<div className={'relative'}>
					<div className={'absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full'}/>
					<Loader2 className={'size-16 text-yellow-400 animate-spin relative z-10'} strokeWidth={2}/>
				</div>

				{/* Loading Text */}
				<div className={'flex flex-col items-center gap-2'}>
					<p className={'text-gray-100 text-lg font-semibold'}>Loading</p>
					<div className={'flex gap-1'}>
						<span className={'size-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]'}/>
						<span className={'size-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]'}/>
						<span className={'size-2 bg-yellow-400 rounded-full animate-bounce'}/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoadingPage;
