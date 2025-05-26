import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]); // State to store messages
    const [users, setUsers] = useState([]); // State to store user list
    const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
    const [unseenMessages, setUnseenMessages] = useState({}); // State to store unseen messages count

    const { socket, axios } = useContext(AuthContext); // Get socket and axios from AuthContext

    // Function to fetch all users
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {
                setUsers(data.users); // Update user list
                setUnseenMessages(data.unseenMessages); // Update unseen messages count
            }
        } catch (error) {
            // Correction: Improved error handling
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Function to fetch all messages for the selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages); // Update messages for the selected user
            }
        } catch (error) {
            // Correction: Improved error handling
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Function to send a message to the selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, { messageData });
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]); // Append the new message
            } else {
                toast.error(data.message); // Show error if message sending fails
            }
        } catch (error) {
            // Correction: Fixed incorrect property access (error.messages -> error.message)
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Function to subscribe to new messages
    const subscribeToMessages = async () => {
        if (!socket) return; // Check if socket is available

        socket.on('newMessage', (newMessage) => {
            if (selectedUser && newMessage.sender._id === selectedUser._id) {
                newMessage.seen = true; // Mark message as seen
                setMessages((prevMessages) => [...prevMessages, newMessage]); // Append the new message
                axios.put(`/api/messages/marks/${newMessage._id}`); // Mark the message as seen in the backend
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.sender._id]: prevUnseenMessages[newMessage.sender._id]
                        ? prevUnseenMessages[newMessage.sender._id] + 1
                        : 1, // Increment unseen message count
                }));
            }
        });
    };

    // Function to unsubscribe from new messages
    const unsubscribeFromMessages = () => {
        if (socket) socket.off('newMessage');
    };

    useEffect(() => {
        subscribeToMessages(); // Subscribe to new messages
        return () => {
            unsubscribeFromMessages(); // Cleanup: Unsubscribe on component unmount
        };
    }, [socket, selectedUser, axios]); // Dependency array includes socket, selectedUser, and axios

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContext;