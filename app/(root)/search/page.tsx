import {SearchModal} from "@/components/SearchModal";
import {searchStocks} from "@/lib/actions/finnhub.actions";

async function SearchPage() {
    const initialStocks = await searchStocks();

    return <SearchModal initialStocks={initialStocks}/>;
}

export default SearchPage;