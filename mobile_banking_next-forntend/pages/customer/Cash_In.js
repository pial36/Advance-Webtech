import React, {useState} from "react";
import _Title from "@/pages/components/layout/_title";
import Hover_Highlight_Table from "@/pages/components/table/Hover_Highlight_Table";
import API_ENDPOINTS from "@/route/api";
import Navbar from "@/pages/components/layout/customer/Navbar";

export default function Cash_In_List() {
    const [tableColumnNames, set_tableColumnNames] = useState([
        "ID", "Type", "Amount", "Date", "From"
    ]);

    const tableColumnsToDisplay = [
        "id", "payment_type", "amount", "payment_date", "receiver_info"
    ];

    return (
        <>
            <_Title title={"Paisa"}/>
            <Navbar />
            <div id="cash_in" className="flex items-center justify-center h-screen">
                <Hover_Highlight_Table
                    endPoint={API_ENDPOINTS.customerPaymentCashInList}
                    headings={tableColumnNames}
                    columns={tableColumnsToDisplay}
                />
            </div>
        </>
    );
}
