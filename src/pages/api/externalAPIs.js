import Axios from "axios";
import * as Sentry from '@sentry/browser';

export const ATOM_PRICE_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=cosmos&order=market_cap_desc&per_page=100&page=1&sparkline=false";

export const fetchAtomPrice = async () => {
    try {
        const res = await Axios.get(ATOM_PRICE_URL)
        if (res && res.data && res.data[0]) {
            return Number(res.data[0].current_price)
        }
    } catch (e) {
        const customScope = new Sentry.Scope();
        customScope.setLevel(Sentry.Severity.Fatal)
        customScope.setTags({
            "Error fetching price of ATOM": ATOM_PRICE_URL
        })
        genericErrorHandler(e, customScope)
        return 0;
    }
    return 0;
}