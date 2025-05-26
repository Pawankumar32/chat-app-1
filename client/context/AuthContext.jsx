import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; 
axios.defaults.baseURL = backendUrl; // Set Axios default base URL

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token")); // Retrieve token from localStorage
    const [authUser, setAuthUser] = useState(null); // Store authenticated user details
    const [onlineUsers, setOnlineUsers] = useState([]); // List of online users
    const [socket, setSocket] = useState(null); // Socket instance

    // Function to check if the user is authenticated
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check"); // API call to check authentication
            if (data.success) {
                setAuthUser(data.user); // Set authenticated user details
                connectSocket(data.user); // Establish socket connection
            }
        } catch (error) {
            console.log(error.response?.data || error.message); 
            toast.error(error.response?.data?.message || "Authentication check failed");
        }
    };

    // Login function
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData); // Set authenticated user details
                connectSocket(data.userData); // Establish socket connection
                setTokenInHeaders(data.token); // Set token in Axios headers
                setToken(data.token); // Update token state
                localStorage.setItem("token", data.token); // Save token in localStorage
                toast.success(data.message); // Show success notification
            } else {
                toast.error(data.message); // Show error notification
            }
        } catch (error) {
            console.log(error.response?.data || error.message); 
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        setToken(null); // Clear token state
        setAuthUser(null); // Clear authenticated user details
        setOnlineUsers([]); // Clear online users list
        delete axios.defaults.headers.common["Authorization"]; // Remove token from Axios headers
        toast.success("Logged out successfully");
        socket?.disconnect(); // Disconnect socket
    };

    // Update profile function
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user); // Update authenticated user details
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.log(error.response?.data || error.message); 
            toast.error(error.response?.data?.message || "Profile update failed");
        }
    };

    // Set token in Axios headers
    const setTokenInHeaders = (token) => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    };

    // Connect socket with backend
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return; // Avoid reconnecting if socket is already connected

        const newSocket = io(backendUrl); // Create a new socket connection
        setSocket(newSocket); // Save socket instance in state

        newSocket.on("connect", () => {
            newSocket.emit("addUser", userData._id); // Notify server about connected user
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds); // Update online users list
        });

        return () => {
            newSocket.disconnect(); // Clean up socket connection on component unmount
        };
    };

    // useEffect to initialize authentication check and socket connection
    useEffect(() => {
        if (token) {
            setTokenInHeaders(token); // Ensure token is set in Axios headers
            checkAuth(); // Check if user is authenticated
        }

        return () => {
            socket?.disconnect(); // Clean up socket connection on component unmount
        };
    }, [token]); // React to changes in the token

    // Context value to provide to children components
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};