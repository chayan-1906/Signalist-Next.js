const routes = {
	homePath: '/',

	signInPath: 'sign-in',
	signUpPath: 'sign-up',

	searchPath: '/search',
	watchListPath: '/watchlist',

	stocksDetailsPath: (symbol: string) => `/stocks/${symbol}`,
};

export {routes};
