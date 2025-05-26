import jwt from "jsonwebtoken";
const userAuth = (req, res, next) => {
    const {token} = req.cookies; // Extract token from cookies

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized Access" });
    }
    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);


        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id; // Attach user ID to request object

        } else {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        next(); //it execute controller function(sendVerifyOtp)

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}

export default userAuth;