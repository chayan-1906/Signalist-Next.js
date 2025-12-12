const routes = {
    homePath: '/',

    signInPath: '/sign-in',
    signUpPath: '/sign-up',

    searchPath: '/search',
    watchlistPath: '/watchlist',

    stocksDetailsPath: (symbol: string) => `/stocks/${symbol}`,
};

export {routes};
