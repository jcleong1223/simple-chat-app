import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoutes = async (req, res, next) => { /****** The next function is used to pass control to the next middleware function, just like the $next($request) in Laravel ******/

    try {

        const token = req.cookies.jwt; /****** The "jwt" is the name we gave to the cookie in the generateToken function ******/

        if(!token) return res.status(401).json({ message: "Not authorized, no token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET); /****** Verify the token with the secret key in the env file ******/

        if(!decoded) return res.status(401).json({ message: "Not authorized, token is invalid" });

        const user = await User.findById(decoded.userId).select("-password"); /****** Find the user by ID, and the user id is in the payload of the token ******/

        if(!user) return res.status(404).json({ message: "User not found" });

        req.user = user; /****** Add the user object to the request object ******/

        next();

    } catch (error) {

        console.log("Error in protectRoutes middleware", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

};
