import {combineReducers} from "redux";
import balances from "./balances"
import stake from "./transactions/stake";
import initialData from "./initialData";
import transaction from "./transaction";
import unStake from "./transactions/unstake";
import deposit from "./transactions/deposit";
import mobileSidebar from "./sidebar";

const reducers = combineReducers({
    balances,
    stake,
    initialData,
    transaction,
    unStake,
    deposit,
    mobileSidebar
})

export default reducers;

export type RootState = ReturnType<typeof reducers>