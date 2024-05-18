import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import routes from "@/route/routes";
import _Title from "@/pages/components/layout/_title";
import {useAuth} from "@/pages/utils/authcontext";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";
import Success_Alert from "@/pages/components/toast/Success_Alert";
import Error_Alert from "@/pages/components/toast/Error_Alert";
import {useId} from "@/pages/utils/idcontext";
import API_ENDPOINTS from "@/route/api";


export default function Info() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    const [Show_Success_Alert, setShow_Success_Alert] = useState(false);
    const [Show_Error_Alert, setShow_Error_Alert] = useState(false);

    const [Name_Error, setName_Error] = useState('');
    const [Phone_Error, setPhone_Error] = useState('');
    const [NID_Error, setNID_Error] = useState('');

    const [terms_condition_decision, setTerms_condition_decision] = useState(false);
    const { id } = useId();

    const { login, user } = useAuth();



    const [profileData, setProfileData] = useState({
        id: -1,
        name: '',
        credit_amount: 0,
        nid: '',
        phone: '',
        image: 'x',
        user_id: -1,
    });

    // Function to handle changes in email and password inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const show_Error = (message) => {
        setShow_Error_Alert(true);
        setErrorMessage(message);

        setTimeout(() => {
            setShow_Error_Alert(false);
            setErrorMessage('');
        }, 3000); // Hide after 3 seconds
    };

    const show_Success = (message) => {
        setShow_Success_Alert(true);
        setSuccessMessage(message);

        setTimeout(() => {
            setShow_Success_Alert(false);
            setSuccessMessage('');
        }, 3000); // Hide after 3 seconds
    };


    const validationCheck = async (name, nid, phone) => {
        // Check if name is empty or null
        if (!name || name.trim() === "") {
            setName_Error('Name cannot be empty');
            return false;
        }

        // Check if name is a string
        if (typeof name !== "string") {
            setName_Error('Name should be a string');
            return false;
        }

        // Check if name length is between 3 and 50 characters
        if (name.length < 3 || name.length > 50) {
            setName_Error('Name should be between 3 and 50 characters long');
            return false;
        }

        // Check if nid is empty or null
        if (!nid || nid.trim() === "") {
            setNID_Error('NID cannot be empty');
            return false;
        }

        // Check if nid contains only numbers
        if (!/^\d+$/.test(nid)) {
            setNID_Error('NID should contain numbers only');
            return false;
        }

        // Check if phone number is empty or null
        if (!phone || phone.trim() === "") {
            setPhone_Error('Phone number cannot be empty')
            return false;
        }

        // Check if phone number contains only numbers
        if (!/^\d+$/.test(phone)) {
            setPhone_Error('Phone number should contain numbers only')
            return false;
        }

        // All validation checks passed
        return true;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        // alert(signupData.email);
        // alert(signupData.password);
        // alert(signupData.confirmPassword);
        // alert('Check decision = '+terms_condition_decision);
        const decision = await validationCheck(profileData.name, profileData.nid,profileData.phone);
        // alert('Decision = '+decision);

        if(decision){
            try {
                // alert('User ID = '+id);
                const user_id = parseInt(id,10);
                setIsLoading(true);
                const response = await axios.post(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerSignupDetails,
                    {
                        id:profileData.id,
                        name:profileData.name,
                        credit_amount: profileData.credit_amount,
                        nid: profileData.nid,
                        phone: profileData.phone,
                        image: profileData.image,
                        user_id: user_id,
                    },
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        withCredentials: true,
                    }
                );
                const receivedData = response.data;
                if (response.data) {
                    console.log(response.data);
                    setIsLoading(false);
                    show_Success("My_Profile created successfully")
                    navigate(routes.login);
                } else {
                    setIsLoading(false);
                    show_Error("failed to create profile");
                    navigate(routes.create_customer_profile);
                }

                console.log("User id = "+response.data);
            } catch (error) {
                setIsLoading(false);
                navigate(routes.create_customer_profile);
                show_Error("failed to create profile");
                console.error("Error Sending Login Request"+error);
            }
        }else{
            // alert("Got Final Error, so in the else section");
        }
    };



    const navigate = (page) => {
        router.push(page)
    }



    // localStorage.setItem("authUser", JSON.stringify(newUser));
    // localStorage.removeItem("authUser");

    useEffect(() => {

    }, []);


    return (
        <>
            <_Title title="Paisa" />
            <section className="bg-black dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-5xl font-semibold text-white-900 dark:text-white">
                        <img className="w-12 h-12 mr-2" src="/images/Logo.png" alt="logo" />
                        Paisa
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 relative">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Customer Informations
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleChange}
                                            id="name"
                                            placeholder="Harry Mādhavan"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                        <label className="label">
                                            {/* <span className="label-text-alt">Bottom Left label</span> */}
                                            <span className="label-text-alt text-red-600">
                                            {Name_Error}
                                        </span>
                                        </label>
                                    </div>
                                    <div>
                                        <label htmlFor="nid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NID</label>
                                        <input
                                            type="number"
                                            name="nid"
                                            value={profileData.nid}
                                            onChange={handleChange}
                                            id="nid"
                                            placeholder="123456789"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                        <label className="label">
                                            {/* <span className="label-text-alt">Bottom Left label</span> */}
                                            <span className="label-text-alt text-red-600">
                                            {NID_Error}
                                        </span>
                                        </label>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            id="phone"
                                            placeholder="+880"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                        <label className="label">
                                            {/* <span className="label-text-alt">Bottom Left label</span> */}
                                            <span className="label-text-alt text-red-600">
                                            {Phone_Error}
                                        </span>
                                        </label>
                                    </div>
                                    <div>
                                        <label htmlFor="credit_amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Credit Amount</label>
                                        <label
                                            id="credit"
                                            className="
                                            appearance-none  py-2 px-4 focus:outline-none cursor-not-allowed
                                            bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >0</label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Profile</button>
                            </form>
                        </div>
                    </div>
                    <div id="y" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }}>
                        {isLoading && <Spinner_Indicator />}
                        {Show_Success_Alert && <Success_Alert message={SuccessMessage} />}
                        {Show_Error_Alert && <Error_Alert message={ErrorMessage} />}
                    </div>
                </div>
            </section>

        </>
    );
}
