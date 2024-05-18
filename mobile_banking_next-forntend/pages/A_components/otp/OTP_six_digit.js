import React, {useState} from 'react';
import Spinner_Indicator from "@/pages/components/loading_indicator/Spinner_Indicator";
import Success_Alert from "@/pages/components/toast/Success_Alert";
import Error_Alert from "@/pages/components/toast/Error_Alert";

export default function OTP_six_digit({ onPinEntered }) {
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [Show_Success_Alert, setShow_Success_Alert] = useState(false);
    const [Show_Error_Alert, setShow_Error_Alert] = useState(false);

    // Alert Message Config
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



    const handlePinChange = (index, value) => {
        // Update pin state
        const newPin = pin.substring(0, index) + value + pin.substring(index + 1);
        setPin(newPin);
        // Focus on next input if it exists
        const nextId = `code-${index + 2}`;
        const nextInput = document.getElementById(nextId);
        if (value !== '' && nextInput) {
            nextInput.focus();
        }
    };

    // Callback function to return pin to parent component
    const handleSubmit = () => {
        // Check if all inputs are filled
        if (pin.length === 6) {
            onPinEntered(pin);
        } else {
            show_Error('Please fill all the input fields.');
        }
    };

    return (
        <>
            <form className="max-w-sm mx-auto bg-black">
                <div className="ml-8 flex mb-2 space-x-2 rtl:space-x-reverse">
                    {/* Here we want 6 Digit pin, so array size is 6*/}
                    {[...Array(6)].map((_, index) => (
                        <div key={index}>
                            <label htmlFor={`code-${index + 1}`} className="sr-only">{`Digit ${index + 1}`}</label>
                            <input
                                type="text"
                                maxLength="1"
                                data-focus-input-init
                                data-focus-input-prev={`code-${index}`}
                                data-focus-input-next={`code-${index + 2}`}
                                id={`code-${index + 1}`}
                                className="block w-12 h-12 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={pin.charAt(index)}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>

                <button className="" type="button" onClick={handleSubmit}>
                    Submit
                </button>
            </form>
            <div className="fixed bottom-4 right-4 flex flex-col items-end">
                <div id="y" style={{ marginTop: '30px' }}>
                    {isLoading && <Spinner_Indicator />}
                    {Show_Success_Alert && <Success_Alert message={SuccessMessage} />}
                    {Show_Error_Alert && <Error_Alert message={ErrorMessage} />}
                </div>
            </div>
        </>
    );
}
