import React, {useEffect, useState} from "react";
import dynamic from 'next/dynamic';
import {useRouter} from "next/router";
import Progress_Bar_With_Label_inside from "@/pages/components/ProgressBar/Progress_Bar_With_Label_inside";

const _Title = dynamic(() => import('./components/layout/_title'))

export default function Home() {
    const router = useRouter();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("/user/Login");
        }, 5000);

        // Increment the percentage gradually
        const interval = setInterval(() => {
            setPercentage(prevPercentage => {
                const nextPercentage = prevPercentage + 1;
                return nextPercentage >= 100 ? 100 : nextPercentage;
            });
        }, 50);

        // Clean up on component unmount
        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    const navigate = (page) => {
        router.push(page);
    }

    return (
        <>
            <_Title title="Paisa" />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ width: '60%' }}>
                    <Progress_Bar_With_Label_inside percentage={percentage} />
                </div>
            </div>
        </>
    );
}
