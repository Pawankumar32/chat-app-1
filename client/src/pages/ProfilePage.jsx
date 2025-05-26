import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets"; // Import assets for icons/images
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext to access user data and update profile function

const ProfilePage = () => {
  // Extract authUser and updateProfile function from AuthContext
  const { authUser, updateProfile } = useContext(AuthContext);

  // State variables for the form
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected profile image
  const [name, setName] = useState(authUser.fullName); // State for the user's name (pre-filled from authUser)
  const [bio, setBio] = useState(authUser.bio); // State for the user's bio (pre-filled from authUser)
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // If no image is selected, update only the full name and bio
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate('/profile'); // Navigate back to the profile page
      return;
    }

    // Read the selected image as a Base64 string
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result; // Convert image to Base64
      await updateProfile({ fullName: name, bio, profilePic: base64Image }); // Update profile with image
      navigate('/'); // Navigate back to the home page
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      {/* Profile Editing Container */}
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>

          {/* Profile Image Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input 
              onChange={(e) => setSelectedImage(e.target.files[0])} 
              type="file" 
              id="avatar" 
              accept=".png, .jpg, .jpeg" 
              hidden 
            />
            {/* Display selected image or fallback avatar */}
            <img 
              src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} 
              alt="Profile Preview" 
              className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} 
            />
            Upload profile image
          </label>

          {/* Name Input Field */}
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            required 
            placeholder="Your Name" 
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" 
          />

          {/* Bio Textarea Field */}
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            placeholder="Write Bio" 
            required 
            rows={4} 
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          ></textarea>

          {/* Save Button */}
          <button 
            type="submit" 
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        {/* Profile Image Display Section */}
        <img 
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} 
          src={authUser?.profilePic || assets.logo_icon} 
          alt="Profile Display" 
        />
      </div>
    </div>
  );
};

export default ProfilePage;