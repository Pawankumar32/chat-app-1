import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";


export const AppContent = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthStatus = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong!')
            // toast.error(error.message);
        }
    }


    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`,{withCredentials: true})
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong!')
            // toast.error(error.message);
        }
    }
    useEffect(()=>{
        getAuthStatus();
    },[])

      

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData

    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>

    )
}