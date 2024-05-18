import React, {useEffect} from "react";
import {useRouter} from "next/router";
import Navbar from "@/pages/components/layout/customer/Navbar";
import dynamic from "next/dynamic";
import _Title from "@/pages/components/layout/_title";
import Navigation_Card from "@/pages/components/Cards/Navigation_Card";
import routes from "@/route/routes";

export default function Dashboard() {
    const router = useRouter();

    const Navbar = dynamic(() => import("/pages/components/layout/customer/Navbar"));

    useEffect(() => {}, []);

    const navigate = (page) => {
        router.push(page);
    };

    return (
        <>
            <_Title title="Paisa" />
            <Navbar />
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 mb-6 w-11/12 max-w-screen-lg">
                    <Navigation_Card image={"send_money.png"} name={"Send Money"} subject={""} path={routes.send_money}  />
                    <Navigation_Card image={"cash_out.png"} name={"Cash Out"} subject={""} path={routes.cash_out} />
                    <Navigation_Card image={"cash_in.png"} name={"Cash In"} subject={""} path={routes.cash_in} />
                    <Navigation_Card image={"bank_to_wallet.png"} name={"Bank to Wallet"} subject={""} path={routes.bank_to_wallet} />
                    <Navigation_Card image={"wallet_to_bank.png"} name={"Wallet To Bank"} subject={""} path={routes.wallet_to_bank}  />
                    <Navigation_Card image={"payment_history.png"} name={"Payment History"} subject={""} path={routes.payment_history} />
                </div>
            </div>
        </>
    );
}
