import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import _Title from "@/pages/components/layout/_title";
import Navbar from "@/pages/components/layout/customer/Navbar";
import axios from "axios";
import API_ENDPOINTS from "@/route/api";
import Profile from "@/pages/components/Profile/Profile";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";

export default function My_Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);


    useEffect(() => {
        const storedUserData = localStorage.getItem("user");
        const storedUserImage = localStorage.getItem("userImage");

        if (storedUserData && storedUserImage) {
            setUser(JSON.parse(storedUserData));
            setUserImage(storedUserImage);
        } else {
            fetchData();
            fetchImage();
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerProfile,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    withCredentials: true,
                }
            );
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("User Name = ", response.data.name);
        } catch (error) {
            console.error("Error fetching Data : ", error);
        }
    };

    const fetchImage = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT +
                API_ENDPOINTS.customerViewProfileImage,
                {
                    responseType: "arraybuffer",
                    withCredentials: true,
                }
            );
            const imageBlob = new Blob([response.data], {
                type: response.headers["content-type"],
            });
            const imageUrl = URL.createObjectURL(imageBlob);
            setUserImage(imageUrl);
            localStorage.setItem("userImage", imageUrl);
        } catch (error) {
            console.error("Error fetching image:", error);
            setUserImage("");
        } finally {
            setIsLoading(false);
        }
    };

    // Call fetchData and fetchImage on every render
    useEffect(() => {
        // alert('My profile called');

        // if(isFirstTime){
        //     if(user === null){
        //         setUser(localStorage.getItem("user"));
        //     }
        //     if(userImage === null){
        //         setUserImage(localStorage.getItem("userImage"));
        //     }
        //     setIsFirstTime(false);
        // }


        fetchData();
        fetchImage();
    }, []); // Empty dependency array ensures calls on every render

    const navigate = (page) => {
        router.push(page);
    };

    const handleSubmit = () => {
        fetchData(); // Call fetchData again on submit for any data updates
        fetchImage();
    };

    return (
        <>
            <_Title title={"Paisa"} />
            <Navbar />
            {user && (
                <Profile user={user} image={userImage} handleSubmit={handleSubmit} />
            )}
            <div
                id="y"
                style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: "999" }}
            >
                {isLoading && <Spinner_Indicator />}
            </div>
        </>
    );
}
