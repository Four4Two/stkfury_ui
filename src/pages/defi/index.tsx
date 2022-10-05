import type { NextPage } from "next";
import {PageTemplate} from "../../components/templates/template";
import DefiList from "../../components/organisms/defi";

const Defi: NextPage = () => {
    return (
        <PageTemplate className="stake" title="Defi">
           <DefiList/>
        </PageTemplate>
    );
};

export default Defi;

