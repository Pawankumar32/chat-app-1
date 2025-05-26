import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';
// import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/template.js'; // Import the template


//############## user registration controller function ##############

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }
    try {

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // store user in database
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // set cookie with token(Add token to cookie)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds (Cookie expiration time)        
        });
        // if NODE_ENV === "production", secure cookie will be set to true
        // if NODE_ENV === "development", secure cookie will be set to false

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Our App!",
            text: `Welcome to Authentication App. Your account has been created successfully with email id: ${email}`,
        }
        // sending email
        await transporter.sendMail(mailOptions);

        console.log(" Welcome email sent to", email);

        // generate response
        return res.status(200).json({ success: true, message: "Registered Successful", user });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

//############## user login controller function ##############
export const login = async (req, res) => {

    const { email, password } = req.body;

    // check if user exists
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    // check if user exists in database
    // check if user is registered
    try {
        const user = await userModel.findOne({ email });



        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email" });
        }

        // getting the password from the database and comparing it with the password entered by the user
        // compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);


        // check if password is correct
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }
        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // set cookie with token(Add token to cookie)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds (Cookie expiration time)        
        });
        // if NODE_ENV === "production", secure cookie will be set to true
        // if NODE_ENV === "development", secure cookie will be set to false

        return res.status(200).json({ success: true, message: "Logged In", user });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

//############## user logout controller function ##############
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });


        return res.status(200).json({ success: true, message: "Logged Out" });


    } catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}


// Send Verification OTP To the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // generate 6 digit OTP

        user.verifyOtp = otp; // store OTP in database
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // set OTP expiration time to 10 minutes from now

        // send OTP to user's email
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            // text: `Your OTP for account verification is ${otp}. Please use this OTP to verify your account.`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)

        }
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "OTP sent to your email", user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Verify email account using OTP Type 1
export const verifyEmail = async (req, res) => {

    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(500).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(500).json({ success: false, message: "OTP expired" });
        }

        // if OTP is correct, verify the account
        user.isAccountVerified = true; // set account as verified       
        user.verifyOtp = ''; // remove OTP from database
        user.verifyOtpExpireAt = 0; // remove OTP expiration time from database

        await user.save();

       return res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Verify email account using OTP Type 2
// export const verifyEmail = async (req, res) => {
//     const userId = req.user;  // <-- Access userId from req.user
//     const { otp } = req.body; // Get otp from request body

//     if (!otp) {
//         return res.status(400).json({ success: false, message: "Missing OTP" });
//     }

//     try {
//         const user = await userModel.findById(userId);  // Use userId from req.user
//         if (!user) {
//             return res.status(400).json({ success: false, message: "User not found" });
//         }

//         if (user.verifyOtp === '' || user.verifyOtp !== otp) {
//             return res.status(500).json({ success: false, message: "Invalid OTP" });
//         }

//         if (user.verifyOtpExpireAt < Date.now()) {
//             return res.status(500).json({ success: false, message: "OTP expired" });
//         }

//         // If OTP is correct, verify the account
//         user.isAccountVerified = true; // Set account as verified
//         user.verifyOtp = ''; // Remove OTP from database
//         user.verifyOtpExpireAt = 0; // Remove OTP expiration time from database

//         await user.save();
//         res.status(200).json({ success: true, message: "Email verified successfully" });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };


// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

// Send Password Reset OTP

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is Required" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // generate 6 digit OTP

        user.resetOtp = otp; // store OTP in database
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // set OTP expiration time to 10 minutes from now

        // send OTP to user's email
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            // text: `Your OTP for resetting your password is ${otp}. Please use this OTP to resetting your password.`,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)// Use the template and replace the placeholder with the actual OTP

        };
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "OTP sent to your email", user });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });

    };
};

// Reset Password using OTP
export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {

        return res.status(400).json({ success: false, message: "Email,OTP and New Password is required" });
    }
    try{
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(500).json({ success: false, message: "Invalid OTP" });
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.status(500).json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword; // update password in database
        user.resetOtp = ''; // remove OTP from database
        user.resetOtpExpireAt = 0; // remove OTP expiration time from database
        
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });


    }catch{
        return res.status(500).json({ success: false, message: error.message });
    }
}