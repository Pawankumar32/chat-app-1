import { useContext } from 'react'
import React, { useState, } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContent } from '../context/AppContext'

function ResetPassword() {

  const { backendUrl } = useContext(AppContent)
  axios.defaults.withCredentials = true;

  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);



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

  // (handler function )handle the email submit and send the otp to the email
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/sent-reset-otp`, { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message)

    }
  }

// handle the otp submit and verify the otp
const onSubmitOtp = async (e) => {
  e.preventDefault();
  const otpArray = inputRef.current.map(e => e.value);
   setOtp(otpArray.join(''));
   setIsOtpSubmitted(true);
}

const onSubmitNewPassword = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword });
    data.success ? toast.success(data.message) : toast.error(data.message)
    data.success && navigate('/login')    
  } catch (error) {
    toast.error(error.message)
    
  }
}


  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-28 cursor-pointer' />

      {/* enter email id */}
      {!isEmailSent &&

        <form onSubmit={onSubmitEmail} 
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' action="">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter Your Registered Email </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.mail_icon} className='w-3 h-3' alt="" />
            <input type="email" placeholder='Email'
              className='bg-transparent outline-none text-white'
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-3'>Submit

          </button>
        </form>

      }

      {/* otp input form */}
      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' action="">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
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
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>

        </form>
      }

      {/* Enter New Password */}
      {isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitNewPassword}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' action="">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new password below </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.lock_icon} className='w-3 h-3' alt="" />
            <input type="password" placeholder='Password'
              className='bg-transparent outline-none text-white'
              value={newPassword} onChange={e => setNewPassword(e.target.value)} required
            />
          </div>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-3'>Submit

          </button>
        </form>
      }

    </div>
  )
}

export default ResetPassword
