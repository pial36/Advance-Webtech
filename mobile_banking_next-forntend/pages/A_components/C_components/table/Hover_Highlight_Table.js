import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Hover_Highlight_Table(props) {
    const router = useRouter();
    const [tableRowData, set_tableRowData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT + props.endPoint,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    withCredentials: true,
                }
            );
            const receivedData = response.data;
            set_tableRowData(receivedData);
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
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    {/* head */}
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {props.headings.map((heading, index) => (
                            <th key={index} className="px-6 py-3">
                                {heading}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {/* rows */}
                    {tableRowData.map((rowData, rowIndex) => (
                        <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100">
                            {props.columns.map((columnName, columnIndex) => (
                                <td key={columnIndex} className="px-6 py-4">
                                    {rowData[columnName]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
