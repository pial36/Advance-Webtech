import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";
import Success_Alert from "@/pages/components/toast/Success_Alert";
import Error_Alert from "@/pages/components/toast/Error_Alert";
import {useAuth} from "@/pages/utils/authcontext";
import routes from "@/route/routes";
import _Title from "@/pages/components/layout/_title";
import API_ENDPOINTS from "@/route/api";

export default function Login() {
    const router = useRouter();
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    const [Show_Success_Alert, setShow_Success_Alert] = useState(false);
    const [Show_Error_Alert, setShow_Error_Alert] = useState(false);

    const [Email_Error, setEmail_Error] = useState('');
    const [Password_Error, setPassword_Error] = useState('');

    const { login, user } = useAuth();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Defining Some Extra colors
    const form_color = 'rgb(31, 41, 55)';
    const input_field_color = 'rgb(55, 65, 81)';
    const forms_others_text_color = 'rgb(181, 186, 194)';
    const input_field_placeholder_color = 'rgb(156, 154, 142)';

    // Function to handle changes in email and password inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevData => ({
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


    const validationCheck = async (email, password) => {
        // Email format validation
        const isValidEmail = (str) => /\S+@\S+\.\S+/.test(str);

        // Password format validation
        const isValidPassword = (str) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/.test(str);

        if (!email) {
            setEmail_Error("Email is required");
            return false;
        } else if (!isValidEmail(email)) {
            setEmail_Error("Email is required in the correct format");
            return false;
        } else if( !password){
            setPassword_Error("Password is required");
            return false;
        }else if (!isValidPassword(password)) {
            setPassword_Error("Password must have at least 1 uppercase, 1 lowercase, 1 digit, 1 special character, and be 8+ characters long");
            return false;
        }
        // All validation checks passed
        return true;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const decision = await validationCheck(loginData.email, loginData.password);
        // alert('Decision = '+decision);
        if(decision){
            try {

                setIsLoading(true);
                const response = await axios.post(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerAuthLogin,
                    {
                        email:loginData.email,
                        password:loginData.password
                    },
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        withCredentials: true,
                    }
                );
                const receivedData = response.data;
                if (response.data) {
                    login(await response.data.access_token, document.cookie);
                    console.log(response.data);
                    setIsLoading(false);
                    show_Success("Login Successful")
                    navigate(routes.customer_dashboard);
                } else {
                    setIsLoading(false);
                    show_Error("Login failed");
                    navigate(routes.login)
                }

                console.log("JWT = "+response.data.access_token);
            } catch (error) {
                setIsLoading(false);
                show_Error("Login failed");
                console.error("Error Sending Login Request"+error);
                navigate(routes.login)
            }
        }else{
            // alert("Got Final Error, so in the else section");
        }
    };


    const playAudio = async () =>{
        console.log("Playing MP3");
        if(!isPlaying){
            const audio = new Audio("/audio/paisa_bgm.mp3");
            audio.volume = 0.03; // Set the volume to 20%
            setAudio(audio);
            setIsPlaying(true);
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
            });
            await audio.play(); // Play the audio
        }
    }

    const navigate = (page) => {
        router.push(page)
    }


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
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleChange}
                                        id="email"
                                        placeholder="name@company.com"
                                        onClick={() => { playAudio(); }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    <label className="label">
                                        {/* <span className="label-text-alt">Bottom Left label</span> */}
                                        <span className="label-text-alt text-red-600">
                                            {Email_Error}
                                        </span>
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleChange}
                                        id="password"
                                        placeholder="••••••••"
                                        onClick={() => { playAudio();}}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    <label className="label">
                                         {/*<span className="label-text-alt text-gray-900">Bottom Left label</span>*/}
                                        <span className="label-text-alt text-red-600">
                                            {Password_Error}
                                        </span>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">

                                    </div>
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={(e) => {e.preventDefault(); navigate(routes.forget_password)}}>Forgot password?</a>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={(e) => {e.preventDefault(); navigate(routes.type)}}>Sign up</a>
                                </p>
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
