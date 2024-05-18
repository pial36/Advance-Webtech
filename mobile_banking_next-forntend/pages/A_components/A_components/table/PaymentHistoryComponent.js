import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import API_ENDPOINTS from "@/route/api";

export default function DefaultTable() {
    const router = useRouter();
    const [paymentData, set_paymentData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerPaymentList,
                {
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    withCredentials: true,
                }
            );
            const receivedData = response.data;
            set_paymentData(receivedData);
        } catch (error) {
            console.error("Error fetching Data : ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const navigate = (page) => {
        router.push(page)
    }

    return (
        <>


            <div className="relative overflow-x-auto rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Payment Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Receiver Information
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Payment Date
                        </th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        paymentData.map((payment) =>(
                            <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {payment.payment_type}
                                </th>
                                <td className="px-6 py-4">
                                    {payment.amount}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.receiver_info}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.payment_date}
                                </td>
                            </tr>
                        ))
                    }


                    </tbody>
                </table>
            </div>

        </>
    );
}
