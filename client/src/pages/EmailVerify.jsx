import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContent } from '../context/AppContext'



function EmailVerify() {

  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContent);

  const navigate = useNavigate();

  const inputRef = React.useRef([]);

  // auto focus on next input field
  // when user enters a value in the current input field
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus()
    }
  }
  // auto focus on previous input field
  // when user deletes a value in the current input field
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus()
    }
  }
  // paste the otp in each input fields one by one
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((item, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = item;
      }
    })
  }

  // submit the form and verify the otp
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map(e => e.value);
      const otp = otpArray.join('');

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp })
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  // redirect to home page if user is already logged in and account is verified

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/'), [isLoggedIn, userData]
  })


  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-28 cursor-pointer' />
      <form onSubmit={onSubmitHandler}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' action="">
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verification OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Please enter the OTP sent to your email</p>
        <div className='flex justify-between items-center mb-8' onPaste={handlePaste}>
          {
            Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index}
                className='w-12 h-12 text-center text-white bg-[#333a5c] text-xl rounded-md'

                ref={e => inputRef.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            )
            )}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Email</button>

      </form>

    </div>
  )
}

export default EmailVerify
