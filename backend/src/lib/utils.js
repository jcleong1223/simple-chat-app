import jwt from "jsonwebtoken";


/****** function to generate token and then send it to the user in cookie ******/
export const generateToken = ( userId, res) => {

    /****** Generate JWT token based on unique user ID, and a secret key *******/
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    /****** Send JWT token in cookie by appending it to the response ******/
    res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, /****** 7 days in milliseconds ******/
        httpOnly: true, /****** Make sure the cookie is only accessible from the server, not accessible from the client/js to prevent XSS attacks ******/
        sameSite: "strict", /****** Prevent CSRF attacks ******/
        secure: process.env.NODE_ENV !== "development" ? false : true, /****** Only send the cookie over HTTPS in production and http is not allowed, but false in development environment ******/
    }) /****** The "jwt" can be any name ******/

    return token
}