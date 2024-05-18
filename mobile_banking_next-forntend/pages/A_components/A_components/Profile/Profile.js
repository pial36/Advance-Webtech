import React, {useEffect, useState} from "react";
import axios from "axios";
import _Title from "@/pages/components/layout/_title";
import API_ENDPOINTS from "@/route/api";
import {useRouter} from "next/router";
import routes from "@/route/routes";

export default function Profile({ user, image }) {

    const router = useRouter();

    const [imageData, setImageData] = useState(null);
    // const [newImage, setNewImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    const [Show_Success_Alert, setShow_Success_Alert] = useState(false);
    const [Show_Error_Alert, setShow_Error_Alert] = useState(false);

    const [Email_Error, setEmail_Error] = useState('');
    const [Password_Error, setPassword_Error] = useState('');



    const [formData, setFormData] = useState({
        name: user ? user.name : "",
        nid: user ? user.nid : "",
        phone: user ? user.phone : "",
        credit_amount: user ? user.credit_amount : "",
        email: user ? user.email : "",
        image: user ? user.image : "",
    });




    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // setNewImage(file);
            setImageData(URL.createObjectURL(file));
            console.warn("New Image File = "+file);
            // console.warn("New Image that is stored  = "+newImage);
            handleImageSubmit(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerProfileUpdate,
                {
                    id: -1,
                    name: formData.name,
                    nid: formData.nid,
                    phone: formData.phone,
                    credit_amount: 0,
                    image:'',
                    email: formData.email
                },
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    withCredentials: true,
                }
            );
            const receivedData = response.data;
            navigate(routes.customer_profile);
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log('Data Updated Successfully');
        } catch (error) {
            console.error("Error fetching Data : ", error);
        }
    };

    const handleImageSubmit = async (newImage) => {
        if (!newImage) {
            console.error("No image selected");
            return;
        }

        const formData = new FormData();
        formData.append("myfile", newImage);

        try {
            setIsLoading(true);
            const response = await axios.put(
                process.env.NEXT_PUBLIC_API_ENDPOINT + API_ENDPOINTS.customerProfileUpload,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setIsLoading(false);
            console.log(response);
            localStorage.setItem("userImage", newImage);
            setSuccessMessage("Image uploaded successfully");
            setShow_Success_Alert(true);
        } catch (error) {
            setIsLoading(false);
            console.error("Error uploading image: ", error);
            setErrorMessage("Failed to upload image");
            setShow_Error_Alert(true);
        }
    };


    useEffect(() => {
        if (image) {
            setImageData(image);
        }
    }, [image]);

    const navigate = (page) => {
        router.push(page)
    }

    return (
        <>
            <_Title title={"Paisa"} />
            <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-4 text-black">My Profile</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold text-black">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="nid" className="block font-semibold text-black">NID:</label>
                        <input
                            type="text"
                            id="nid"
                            name="nid"
                            value={formData.nid}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block font-semibold text-black">Phone:</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-semibold text-black">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block font-semibold">Profile Image:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div className="flex items-center justify-center">
                            <img
                                src={imageData || formData.image}
                                alt="Profile"
                                className="max-w-48 max-h-48 mb-4 cursor-pointer"
                                onClick={() => document.getElementById('image').click()}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </>
    );
}
