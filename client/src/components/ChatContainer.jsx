import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets"; // Import assets for icons and images
import { formatMessageTime } from "../lib/utils"; // Utility function for formatting time
import { AuthContext } from "../../context/AuthContext"; // AuthContext for authentication-related data
import { ChatContext } from "../../context/ChatContext"; // ChatContext for chat-related data
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, getMessages, selectedUser, setSelectedUser, sendMessage } = useContext(ChatContext); // Chat context values
  const { authUser, onlineUsers } = useContext(AuthContext); // Auth context values

  const [input, setInput] = useState(""); // State for input text
  const scrollEnd = useRef(); // Reference for auto-scrolling to the bottom of the chat

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return; // Prevent empty messages
    await sendMessage({ text: input.trim() }); // Send the message
    setInput(""); // Clear the input field
  };

  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file"); // Show error if the file is not an image
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result }); // Send the image as a base64 string
      e.target.value = ""; // Reset the file input
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  // Fetch messages for the selected user
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [getMessages,selectedUser]); // Re-run if the selected user changes

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]); // Re-run if messages change

  return selectedUser ? (
    <div className="h-full overflow-y-scroll no-scrollbar relative backdrop-blur-lg">
      {/* ------------- Header ------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7 cursor-pointer" // Added "cursor-pointer" for better UX
        />
        <img src={assets.help_icon} alt="Help" className="md:hidden max-w-5" />
      </div>
      {/* ------------- Chat Area ------------- */}
      <div className="flex flex-col h-[calc(100%_-_120px)] overflow-y-scroll no-scrollbar p-3 pb-6">
        {messages.map((msg) => (
          <div
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
            key={msg._id}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="Message Image"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser.profilePic || assets.avatar_icon // Correction: Fixed incorrect reference to authUser?.AuthContext.profilePic
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt="Sender"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* --------------- Bottom Message Area -------------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Attach"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          src={assets.send_button}
          alt="Send"
          className="w-7 cursor-pointer"
          onClick={handleSendMessage} // Correction: Added onClick for sending messages
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img
        src={assets.logo_icon}
        alt="Logo"
        className="max-w-16 cursor-pointer"
      />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;