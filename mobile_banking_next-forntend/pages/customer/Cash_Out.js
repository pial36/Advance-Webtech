import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import API_ENDPOINTS from "@/route/api";
import _Title from "@/pages/components/layout/_title";
import Navbar from "@/pages/components/layout/customer/Navbar";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";
import Success_Alert from "@/pages/components/toast/Success_Alert";
import Error_Alert from "@/pages/components/toast/Error_Alert";
import routes from "@/route/routes";

export default function Cash_Out() {
    const router = useRouter();
    const [variableName, set_variableName] = useState(0);
    const [showReceiverEmailForm, setShowReceiverEmailForm] = useState(true);
    const [showAmountForm, setShowAmountForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [backwardGoing, setBackwardGoing] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    const [Show_Success_Alert, setShow_Success_Alert] = useState(false);
    const [Show_Error_Alert, setShow_Error_Alert] = useState(false);

    const [Email_Error, setEmail_Error] = useState('');
    const [Password_Error, setPassword_Error] = useState('');
    const [Amount_Error, setAmount_Error] = useState('');

    const [sendMoneyData, setSendMoneyData] = useState({
        receiver_info: '',
        amount: '',
        password: '',
        payment_type: 'x'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSendMoneyData(prevData => ({
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

    const validationCheck = async (email, password, amount) => {
        // Email format validation
        const isValidEmail = (str) => /\S+@\S+\.\S+/.test(str);

        // Password format validation
        const isValidPassword = (str) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/.test(str);

        if (!email) {
            // alert('Email error 1');
            setEmail_Error("Email is required");
            return false;
        } else if (!isValidEmail(email)) {
            // alert('Email error 2');
            setEmail_Error("Email is required in the correct format");
            return false;
        } else if( !password){
            // alert('Pass error 1');
            setPassword_Error("Password is required");
            return false;
        }else if (!isValidPassword(password)) {
            // alert('Email error 2');
            setPassword_Error("Password must have at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be 8+ characters long");
            return false;
        }else if (isNaN(amount)) {
            // alert('Amount error 1');
            setAmount_Error("Amount can only be numerical format only");
            return false;
        }else if(!parseFloat(amount) > 0){
            // alert('Amount error 2');
            setAmount_Error("Amount has to more than 0");
            return false;
        }
        // All validation checks passed
        return true;
    }

    const handleSubmit = async (e) => {
        // alert('Handle Submit called');
        e.preventDefault();

        // alert('Receiver Email = '+sendMoneyData.receiver_info);
        // alert('My Pass = '+sendMoneyData.password);
        // alert('Amount = '+sendMoneyData.amount);

        const parsedValue = parseFloat(sendMoneyData.amount);

        const decision = await validationCheck(sendMoneyData.receiver_info, sendMoneyData.password, parsedValue);
        // alert('Decision = '+decision);
        if(decision){
            try {

                setIsLoading(true);
                const response = await axios.post(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerCashOut,
                    {
                        amount: sendMoneyData.amount,
                        receiver_info:sendMoneyData.receiver_info,
                        password:sendMoneyData.password,
                        payment_type: sendMoneyData.payment_type
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
                    show_Success("Transaction Successful")
                    navigate(routes.customer_dashboard);
                } else {
                    setIsLoading(false);
                    show_Error("Transaction failed");
                    navigate(routes.send_money);
                }

                console.log("Response Data = "+response.data);
            } catch (error) {
                setIsLoading(false);
                show_Error("Transaction failed");
                console.error("Error Sending Transaction Request"+error);
                navigate(routes.login)
            }
        }else{
            // alert("Got Final Error, so in the else section");
        }
    };





    useEffect(() => {

    }, []);

    const navigate = (page) => {
        router.push(page)
    }

    return (
        <>
            <_Title title="Paisa" />
            <Navbar />
            <form onSubmit={handleSubmit}>
                {
                    showReceiverEmailForm &&
                    <div className="flex flex-col justify-center items-center font-[sans-serif] text-[#333] md:h-screen bg-black">
                        <div className="bg-white grid md:grid-cols-2 items-center gap-y-8 max-w-7xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] m-6 rounded-md relative overflow-hidden">
                            <div className="max-md:order-1 p-4 bg-gray-50 h-full">
                                <img src="/images/cash_out.png" className="lg:max-w-[90%] w-full h-full object-contain block mx-auto" alt="login-image" />
                            </div>
                            <div className="flex items-center p-6 max-w-md w-full h-full mx-auto">
                                <div className="w-full">
                                    <div className="mb-12">
                                        <h3 className="text-blue-500 lg:text-3xl text-2xl font-extrabold max-md:text-center">Cash Out</h3>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold block mb-3">Agent Email</label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="email"
                                                name="receiver_info"
                                                value={sendMoneyData.receiver_info}
                                                onChange={handleChange}
                                                id="receiver_info"
                                                placeholder="Enter receiver email"
                                                className="w-full bg-transparent text-sm border-2 focus:border-blue-500 px-4 py-3.5 outline-none rounded-xl"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                                <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                                <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-12">
                                        <button
                                            onClick={() => {
                                                setShowReceiverEmailForm(false);
                                                setShowAmountForm(true);
                                                setShowPasswordForm(false);
                                            }}
                                            id={"btn_mail"}
                                            type="button" className="w-full shadow-xl py-3.5 px-8 text-sm font-semibold rounded-xl bg-blue-500 hover:bg-blue-600 text-white border focus:outline-none transition-all">
                                            Next Step
                                        </button>
                                        <div className="flex items-center justify-center gap-6 mt-12">
                                            <div className="w-3 h-3 shrink-0 rounded-full bg-blue-600 cursor-pointer"></div>
                                            <div className="w-3 h-3 shrink-0 rounded-full bg-gray-300 cursor-pointer"></div>
                                            <div className="w-3 h-3 shrink-0 rounded-full bg-gray-300 cursor-pointer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-blue-400 max-sm:hidden"></div>
                        </div>
                    </div>
                }

                {
                    showAmountForm &&

                    <div className="flex flex-col justify-center items-center font-[sans-serif] bg-black text-[#333] md:h-screen">
                        <div className="bg-white grid md:grid-cols-2 items-center gap-y-8 max-w-7xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] m-6 rounded-md relative overflow-hidden">
                            <div className="max-md:order-1 p-4 bg-gray-50 h-full">
                                <img src="/images/cash_out.png" className="lg:max-w-[90%] w-full h-full object-contain block mx-auto" alt="login-image" />
                            </div>
                            <div className="flex items-center p-6 max-w-md w-full h-full mx-auto">
                                <form className="w-full">
                                    <div className="mb-12">
                                        <h3 className="text-blue-500 lg:text-3xl text-2xl font-extrabold max-md:text-center">Cash Out</h3>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold block mb-3">Amount</label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="text"
                                                name="amount"
                                                value={sendMoneyData.amount}
                                                onChange={handleChange}
                                                id="amount"
                                                placeholder="Enter amount"
                                                className="w-full bg-transparent text-sm border-2 focus:border-blue-500 px-4 py-3.5 outline-none rounded-xl"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                                <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                                <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-12">
                                        <button
                                            onClick={() => {
                                                setShowReceiverEmailForm(false);
                                                setShowAmountForm(false);
                                                setShowPasswordForm(true);
                                                setBackwardGoing(true);
                                            }}
                                            type="button" id={"btn_amount"} className="w-full shadow-xl py-3.5 px-8 text-sm font-semibold rounded-xl bg-blue-500 hover:bg-blue-600 text-white border focus:outline-none transition-all">
                                            Next Step
                                        </button>
                                        <div className="flex items-center justify-center gap-6 mt-12">
                                            <div
                                                onClick={() => {
                                                    if(backwardGoing === true){
                                                        setShowReceiverEmailForm(true);
                                                        setShowAmountForm(false);
                                                        setShowPasswordForm(false);
                                                    }
                                                }}
                                                className="w-3 h-3 shrink-0 rounded-full bg-gray-300 cursor-pointer"></div>
                                            <div className="w-3 h-3 shrink-0 rounded-full bg-blue-600 cursor-pointer"></div>
                                            <div className="w-3 h-3 shrink-0 rounded-full bg-gray-300 cursor-pointer"></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-blue-400 max-sm:hidden"></div>
                        </div>
                    </div>

                }


                {
                    showPasswordForm &&

                    <div className="flex flex-col justify-center items-center font-[sans-serif] bg-black text-[#333] md:h-screen">
                        <div className="bg-white grid md:grid-cols-2 items-center gap-y-8 max-w-7xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] m-6 rounded-md relative overflow-hidden">
                            <div className="max-md:order-1 p-4 bg-gray-50 h-full">
                                <img src="/images/cash_out.png" className="lg:max-w-[90%] w-full h-full object-contain block mx-auto" alt="login-image" />
                            </div>
                            <div className="flex items-center p-6 max-w-md w-full h-full mx-auto">
                                <form className="w-full">
                                    <div className="mb-12">
                                        <h3 className="text-blue-500 lg:text-3xl text-2xl font-extrabold max-md:text-center">Cash Out</h3>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold block mb-3">Your Password</label>
                                        <div className="relative flex items-center">
                                            <input
                                                type="password"
                                                name="password"
                                                value={sendMoneyData.password}
                                                onChange={handleChange}
                                                id="password"
                                                placeholder="Enter your password"
                                                className="w-full bg-transparent text-sm border-2 focus:border-blue-500 px-4 py-3.5 outline-none rounded-xl"
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                                <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                                <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-12">
                                        <button
                                            id={"btn_pass"}
                                            onClick={handleSubmit}
                                            type="submit"
                                            className="w-full shadow-xl py-3.5 px-8 text-sm font-semibold rounded-xl bg-blue-500 hover:bg-blue-600 text-white border focus:outline-none transition-all">
                                            Next Step
                                        </button>
                                        <div className="flex items-center justify-center gap-6 mt-12">
                                            <div
                                                onClick={() => {
                                                    if(backwardGoing === true){
                                                        setShowReceiverEmailForm(true);
                                                        setShowAmountForm(false);
                                                        setShowPasswordForm(false);
                                                    }
                                                }}
                                                className="w-3 h-3 shrink-0 rounded-full bg-gray-300 cursor-pointer"></div>
                                            <div
                                                onClick={() => {
                                                    if(backwardGoing === true){
                                                        setShowReceiverEmailForm(false);
                                                        setShowAmountForm(true);
                                                        setShowPasswordForm(false);
                                                    }
                                                }}
                                                className="w-3 h-3 shrink-0 rounded-full bg-gray-300 cursor-pointer"></div>
                                            <div className="w-3 h-3 shrink-0 rounded-full bg-blue-600 cursor-pointer"></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-blue-400 max-sm:hidden"></div>
                        </div>
                    </div>

                }
            </form>
            <div id="y" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }}>
                {isLoading && <Spinner_Indicator />}
                {Show_Success_Alert && <Success_Alert message={SuccessMessage} />}
                {Show_Error_Alert && <Error_Alert message={ErrorMessage} />}
            </div>


        </>
    );
}
