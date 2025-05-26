import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets"; // Removed unnecessary empty import
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

// all image variables are imported from assets.js
// for more details check assets.js file
// no-scrollbar is a custom class to hide scrollbar 
// no-scrollbar is defined in index.css file
// no-scrollbar is not a tailwind class

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImage, setMsgImage] = useState([]);

  // Extract all images from messages and set them to the state
  useEffect(() => {
    setMsgImage(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`bg-[#818582]/10 text-white w-full relative overflow-y-scroll no-scrollbar ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* User Profile Section */}
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="User Profile"
            className="w-20 aspect-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
            )}
            {selectedUser.fullName /* Fixed typo: fullname -> fullName */}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4" />

        {/* Media Section */}
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll no-scrollbar grid grid-cols-2 gap-4 opacity-80">
            {msgImage.map((url, index) => (
              <div
                onClick={() => window.open(url)}
                key={index}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="Message Media" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;