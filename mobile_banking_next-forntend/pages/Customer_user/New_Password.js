import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {useAuth} from "@/pages/utils/authcontext";
import API_ENDPOINTS from "@/route/api";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";
import Success_Alert from "@/pages/components/toast/Success_Alert";
import Error_Alert from "@/pages/components/toast/Error_Alert";
import routes from "@/route/routes";

export default function New_Password() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    const [Show_Success_Alert, setShow_Success_Alert] = useState(false);
    const [Show_Error_Alert, setShow_Error_Alert] = useState(false);

    const [Password_Error, setPassword_Error] = useState('');
    const [ConfirmPassword_Error, setConfirmPassword_Error] = useState('');

    const [terms_condition_decision, setTerms_condition_decision] = useState(false);

    const { login, user } = useAuth();

    const [changePasswordData, setChangePasswordData] = useState({
        password: '',
        confirm_password: ''
    });


    // Function to handle changes in email and password inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setChangePasswordData(prevData => ({
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


    const validationCheck = async (password, confirm_password, is_terms_condition_checked) => {

        // Password format validation
        const isValidPassword = (str) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/.test(str);

        if (!isValidPassword(password)) {
            setPassword_Error("Password must have at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be 8+ characters long");
            return false;
        } else if (password !== confirm_password) {
            setConfirmPassword_Error("Confirm Password should be same as new password");
            return false;
        }else if (is_terms_condition_checked !== true) {
            show_Error("Please read & accept the terms and conditions")
            return false;
        }
        // All validation checks passed
        return true;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const decision = await validationCheck(changePasswordData.password, changePasswordData.confirm_password, terms_condition_decision);
        // alert('Decision = '+decision);
        if(decision){
            try {
                // alert('New Password = '+changePasswordData.password); // Working
                setIsLoading(true);
                const response = await axios.post(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerAuthChangePassword,
                    {
                        password:changePasswordData.password
                    },
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        withCredentials: true,
                    }
                );
                const receivedData = response.status;

                // alert('Response Status = '+response.status);
                if (response.status === 200) {
                    // login(await response.data.access_token, document.cookie);
                    console.log(response.data);
                    setIsLoading(false);
                    show_Success("Password Reset Successful")
                    navigate(routes.login);
                } else {
                    setIsLoading(false);
                    show_Error("Password Reset failed");
                    navigate(routes.forget_password);
                }

                console.log("JWT = "+response.data);
            } catch (error) {
                setIsLoading(false);
                show_Error("Password Reset failed");
                console.error("Error Sending Password Reset Request"+error);
                navigate(routes.forget_password);
                alert('Caught Error and message = '+error.message);
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
            <section className="bg-black dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-5xl font-semibold text-white-900 dark:text-white">
                        <img className="w-12 h-12 mr-2" src="/images/Logo.png" alt="logo" />
                        Paisa
                    </a>
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Change Password
                        </h2>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={changePasswordData.password}
                                    onChange={handleChange}
                                    id="password"
                                    placeholder="••••••••"
                                    required=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <label className="label">
                                    {/* <span className="label-text-alt">Bottom Left label</span> */}
                                    <span className="label-text-alt text-red-600">
                                            {Password_Error}
                                        </span>
                                </label>
                            </div>
                            <div>
                                <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={changePasswordData.confirm_password}
                                    onChange={handleChange}
                                    id="confirm_password"
                                    placeholder="••••••••"
                                    required=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <label className="label">
                                    {/* <span className="label-text-alt">Bottom Left label</span> */}
                                    <span className="label-text-alt text-red-600">
                                            {ConfirmPassword_Error}
                                        </span>
                                </label>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="newsletter"
                                        aria-describedby="newsletter"
                                        type="checkbox"
                                        onChange={(e) => setTerms_condition_decision(e.target.checked)}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="newsletter" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/pdf/Online_Banking_Management_System___Terms___Conditions.pdf" target="_blank" rel="noopener noreferrer">Terms and Conditions</a></label>
                                </div>
                            </div>
                            <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Reset password</button>
                        </form>
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
