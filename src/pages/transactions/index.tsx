import type { NextPage } from "next";
import {PageTemplate} from "../../components/templates/template";
import TransactionsTable from "../../components/organisms/transactions";

const Transactions: NextPage = () => {
    return (
        <PageTemplate className="stake" title="Defi">
            <TransactionsTable/>
        </PageTemplate>
    );
};

export default Transactions;