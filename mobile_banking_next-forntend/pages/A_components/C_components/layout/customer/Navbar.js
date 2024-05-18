import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import routes from "@/route/routes";
import API_ENDPOINTS from "@/route/api";
import {useAuth} from "@/pages/utils/authcontext";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";

export default function Navbar() {
    const router = useRouter();
    const { user } = useAuth();
    const { logout } = useAuth();


    const [isLoading, setIsLoading] = useState(true);

    const [userImage, setUserImage] = useState("");
    const [name, setName] = useState("");
    const [creditAmount, setCreditAmount] = useState(0.0);
    const [isCreditVisible, setIsCreditVisible] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.navbarInfo,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    withCredentials: true,
                }
            );
            setName(response.data.name);
            setCreditAmount(response.data.credit_amount);
        } catch (error) {
            console.error("Error fetching Data : ", error);
            navigate(routes.root);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserImage = async () =>{
        // alert("JWT = "+user.jwt);
        // alert("Cookie = "+user.cookie);
        console.log("JWT = "+user.jwt);
        // console.log("Cookie = "+user.cookie);
        if (user != null) {
            await axios
                .get(process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerViewProfileImage, {
                    responseType: "arraybuffer", // Indicate that we're expecting binary data
                    withCredentials: true,
                })
                .then((response) => {
                    const imageBlob = new Blob([response.data], {
                        type: response.headers["content-type"],
                    });
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setUserImage(imageUrl);
                })
                .catch((error) => {
                    // alert('Error Refreshing the page = '+error);
                    setUserImage(null); // Set to null if there's an error
                })
                .finally(() => {
                    setIsLoading(false); // Set loading to false when image is loaded
                });
        } else {
            router.push(routes.login);
        }
    }

    const signOut = async () => {
        // alert('Logout Called');
        try {
            setIsLoading(true);
            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerAuthLogout,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                localStorage.setItem("user",null);
                localStorage.setItem("userImage",null);
                logout();
                navigate(routes.login);
            } else {
                navigate(routes.customer_dashboard);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error in Logging Out:', error);
        }
    }


    useEffect(() => {
        // Fetch data every 1 second
        const intervalId = setInterval(fetchData, 1000);
        const intervalId2 = setInterval(fetchUserImage, 1000);
        return () =>{ clearInterval(intervalId); clearInterval(intervalId2); }
    }, []);

    useEffect(() => {
        if (isCreditVisible) {
            const timeoutId = setTimeout(() => {
                setIsCreditVisible(false);
            }, 5000); // Slide back after 5 seconds

            // Cleanup function to clear the timeout
            // if the component unmounts or if isCreditVisible changes
            return () => clearTimeout(timeoutId);
        }
    }, [isCreditVisible]);

    const toggleCreditVisibility = () => {
        setIsCreditVisible(!isCreditVisible);
    };

    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    useEffect(() => {
        fetchUserImage();
    }, []);

    const navigate = (page) => {
        router.push(page)
    }

    return (
        <>
            <nav className="bg-gray-900 border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/images/Logo.png" className="h-10" alt="Flowbite Logo" />
                        <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
              Paisa
            </span>
                        <div id="credit_amount" className="relative">
                            <div className="absolute h-full w-full bg-white rounded-full"></div>
                            {isCreditVisible ? (
                                <div className="relative flex items-center justify-center h-8 w-32 rounded-full bg-gray-200">
                  <span className="text-black">
                    <span>৳</span>
                      {creditAmount}
                  </span>
                                </div>
                            ) : (
                                <button
                                    onClick={toggleCreditVisibility}
                                    className="relative flex items-center justify-center h-8 w-8 rounded-full bg-gray-200"
                                >
                                    <span className="text-black">৳</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <div id="user_name" className="mr-8">
                            {name}
                        </div>
                        <button
                            type="button"
                            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                            id="user-menu-button"
                            aria-expanded={isDropdownVisible}
                            onClick={toggleDropdownVisibility}
                        >
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="w-10 h-10 rounded-full"
                                src={userImage || "/images/temp.svg"}
                                alt="user photo"
                            />
                        </button>
                        {isDropdownVisible && (
                            <div className="fixed inset-0 overflow-hidden z-50">
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="fixed inset-y-0 right-0 max-w-sm flex">
                                        <div className="w-full bg-white shadow-2xl transform transition-transform ease-in-out duration-500 rounded-lg">
                                            <div className="flex justify-between items-center p-4 border-b border-gray-300">
                                                <h3 className="text-lg font-semibold text-gray-900">User Menu</h3>
                                                <button
                                                    type="button"
                                                    className="text-gray-500 focus:outline-none hover:text-gray-700"
                                                    onClick={toggleDropdownVisibility}
                                                >
                                                    <span className="sr-only">Close</span>
                                                    <svg
                                                        className="w-6 h-6"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="py-2" aria-labelledby="user-menu-button">
                                                <a
                                                    href="#"
                                                    className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition duration-300 rounded-md"
                                                    onClick={(e) => { e.preventDefault(); navigate(routes.customer_dashboard); }}
                                                >
                                                    Dashboard
                                                </a>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition duration-300 rounded-md"
                                                    onClick={(e) => { e.preventDefault(); navigate(routes.customer_profile); }}
                                                >
                                                    My Profile
                                                </a>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-3 text-sm text-red-600 font-semibold hover:bg-red-100 hover:text-red-800 transition duration-300 rounded-md"
                                                    onClick={(e) => { e.preventDefault(); signOut(); }}
                                                >
                                                    Sign out
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>





                        )}
                        <button
                            data-collapse-toggle="navbar-user"
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-user"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    id="y"
                    style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }}
                >
                    {isLoading && <Spinner_Indicator />}
                </div>
            </nav>
        </>
    );
}
