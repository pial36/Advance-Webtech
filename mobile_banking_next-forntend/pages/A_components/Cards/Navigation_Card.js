import React, {useEffect} from "react";
import {useRouter} from "next/router";

export default function Navigation_Card(props) {
    const router = useRouter();

    useEffect(() => {
        // Any side effects or initialization code can go here
    }, []);

    const navigate = (page) => {
        router.push(page);
    };

    return (
        <>
            <div onClick={() => navigate(props.path)} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
                <div className="flex justify-end px-4 pt-4">
                    {/* Any content you want to include here */}
                </div>
                <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={"/images/" + props.image} alt={props.name + " image"} />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{props.name}</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{props.subject}</span>
                </div>
            </div>
        </>
    );
}
