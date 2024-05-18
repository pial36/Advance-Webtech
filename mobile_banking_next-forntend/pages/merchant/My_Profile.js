import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import _Title from "@/pages/components/layout/_title";
import Navbar from "@/pages/components/layout/merchant/Navbar";
import axios from "axios";
import API_ENDPOINTS from "@/route/api";
import Profile from "@/pages/components/Profile/Profile";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";

export default function My_Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if localStorage is available before accessing it
        const storedUserImage = typeof window !== 'undefined' ? localStorage.getItem("userImage") : null;
        setUserImage(storedUserImage || "");

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.merchantProfile,
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        withCredentials: true,
                    }
                );
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data)); // Persist user data to localStorage if available
                console.log('User Name = ', response.data.name);
            } catch (error) {
                console.error("Error fetching Data : ", error);
            }
        };

        const fetchImage = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.merchantViewProfileImage,
                    {
                        responseType: "arraybuffer", // Indicate that we're expecting binary data
                        withCredentials: true,
                    }
                );
                const imageBlob = new Blob([response.data], {
                    type: response.headers["content-type"],
                });
                const imageUrl = URL.createObjectURL(imageBlob);
                setUserImage(imageUrl);
                localStorage.setItem("userImage", imageUrl); // Persist userImage URL to localStorage
            } catch (error) {
                console.error("Error fetching image:", error);
                setUserImage(""); // Set to empty string if there's an error
            } finally {
                setIsLoading(false);
            }
        };

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            fetchData();
        }
        fetchImage();
    }, []); // Empty dependency array to ensure it runs only once on mount

    const navigate = (page) => {
        router.push(page);
    };

    return (
        <>
            <_Title title={"Paisa"} />
            <Navbar />
            {user && <Profile user={user} image={userImage} />}
            <div id="y" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }}>
                {isLoading && <Spinner_Indicator />}
            </div>
        </>
    );
}
