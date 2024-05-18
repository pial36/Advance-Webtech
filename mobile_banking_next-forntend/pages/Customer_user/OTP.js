import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import OTP_six_digit from "@/pages/components/otp/OTP_six_digit";
import routes from "@/route/routes";
import axios from "axios";
import API_ENDPOINTS from "@/route/api";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";
import Success_Alert from "@/pages/components/toast/Success_Alert";
import Error_Alert from "@/pages/components/toast/Error_Alert";

export default function OTP() {
    const router = useRouter();
    const [pinCode, setPinCode] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    const [Show_Success_Alert, setShow_Success_Alert] = useState(false);
    const [Show_Error_Alert, setShow_Error_Alert] = useState(false);



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

    const handleSubmit = async (e) => {


        try {

            setIsLoading(true);
            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerOTP,
                {
                    otp: pinCode
                },
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    withCredentials: true,
                });
            const receivedData = response.status;
            if (response.status === 200) {
                setIsLoading(false);
                show_Success("Pin code matched")
                navigate(routes.new_password);
            } else {
                setIsLoading(false);
                show_Error("Pin code did not matched");
                navigate(routes.forget_password);
            }
            console.log("Messages = "+response.status);
        } catch (error) {
            setIsLoading(false);
            show_Error("Pin code did not matched");
            console.error("Error Sending Login Request"+error);
            navigate(routes.forget_password);
        }

    };



    const handlePinCodeChange = (newPinCode) => {
        setPinCode(newPinCode);
    };


    useEffect(() => {
        if (pinCode !== '') {
            handleSubmit(pinCode);
            // alert('Pin code = ' + pinCode);
        }
    }, [pinCode]);

    const navigate = (page) => {
        router.push(page)
    }

    return (
        <>
            <div className="relative min-h-screen flex flex-col justify-center bg-black overflow-hidden">
                <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
                    <div className="flex justify-center">

                        <div className="max-w-md mx-auto text-center bg-black px-4 sm:px-8 py-10 rounded-xl shadow">
                            <header className="mb-8">
                                <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
                                <p className="text-[15px] text-slate-500">Enter the 6-digit verification code that was sent to your phone number.</p>
                            </header>
                            <OTP_six_digit onPinEntered={handlePinCodeChange} />
                            <div class="text-sm text-slate-500 mt-4">Did not receive code?
                                <a class="font-medium text-indigo-500 hover:text-indigo-600" href="#" onClick={(e) => {e.preventDefault(); navigate(routes.forget_password)}}>
                                    Resend
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="y" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }}>
                    {isLoading && <Spinner_Indicator />}
                    {Show_Success_Alert && <Success_Alert message={SuccessMessage} />}
                    {Show_Error_Alert && <Error_Alert message={ErrorMessage} />}
                </div>

            </div>
        </>
    );
}
