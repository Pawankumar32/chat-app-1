import React, { useContext, useState } from 'react';
import assets from '../assets/assets'; // Import assets for images and icons
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext for authentication-related operations

const LoginPage = () => {
  // State variables to manage form data and user actions
  const [currentState, setCurrentState] = useState("Sign up"); // Tracks whether the user is signing up or logging in
  const [fullName, setFullName] = useState(""); // Stores the user's full name during sign-up
  const [email, setEmail] = useState(""); // Stores the user's email
  const [password, setPassword] = useState(""); // Stores the user's password
  const [bio, setBio] = useState(""); // Stores the user's bio during sign-up
  const [isDataSubmitted, setIsDataSubmitted] = useState(false); // Tracks whether the user has submitted basic data (like name, email, etc.)
  const [termsAgreed, setTermsAgreed] = useState(false); // Tracks whether the user agreed to the terms and conditions
  const [errorMessage, setErrorMessage] = useState(""); // Tracks error messages to display to the user

  const { login } = useContext(AuthContext); // Access the login function from AuthContext

  // Function to handle form submission
  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Validation for sign-up
    if (currentState === "Sign up") {
      if (!termsAgreed) {
        setErrorMessage("You must agree to the terms of use & privacy policy.");
        return;
      }
      if (!isDataSubmitted) {
        setIsDataSubmitted(true); // Proceed to the next step (bio input)
        return;
      }
      if (!bio) {
        setErrorMessage("Please fill out your bio."); // Show error if bio is not provided
        return;
      }
    }

    // Clear error message on valid submission
    setErrorMessage("");

    // Call the login function with appropriate data
    login(currentState === "Sign up" ? "signup" : "login", { fullName, email, password, bio });
  };

  // Function to reset form fields when switching between Login and Sign-Up
  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setIsDataSubmitted(false);
    setErrorMessage(""); // Clear any error messages
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* ----------- Left Section ---------- */}
      <img src={assets.logo_big} alt="Logo" className="w-[min(30vw,250px)]" />

      {/* ----------- Right Section ---------- */}
      <form 
        onSubmit={onSubmitHandler} 
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        {/* Form Heading */}
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {/* Show back button if the user has submitted initial data */}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Go Back"
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {/* Display error messages */}
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        {/* Full Name Input for Sign-Up */}
        {currentState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            aria-label="Full Name"
            required
          />
        )}

        {/* Email and Password Fields */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              aria-label="Email Address"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              autoComplete="off"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              aria-label="Password"
              required
            />
          </>
        )}

        {/* Bio Field for Sign-Up */}
        {currentState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write Bio..."
            aria-label="Bio"
            required
          ></textarea>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* Terms of Use Checkbox for Sign-Up */}
        {currentState === "Sign up" && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              onChange={(e) => setTermsAgreed(e.target.checked)}
              checked={termsAgreed}
              aria-label="Agree to terms"
            />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>
        )}

        {/* Switch Between Login and Sign-Up */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {currentState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Login");
                  resetForm();
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign up");
                  resetForm();
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;