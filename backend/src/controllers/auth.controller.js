import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {

        if(!fullName || !email || !password){

            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 8){

            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const user = await User.findOne({ email });
        if(user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10); /****** The value 10 is the conversion number of salt rounds ******/
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if(newUser)
        {
            /****** Generate JWT token here ******/
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            }); /****** Code 201 means created ******/

        } else {
            res.status(500).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

};

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({ message: "Invalid credential" });

        const isMatched = await bcrypt.compare(password, user.password)

        if(!isMatched) return res.status(400).json({ message: "Invalid credentials" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {

        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {

    try {

        res.cookie("jwt", "", { maxAge: 0 }) /****** Logout by clearing the cookie, just give it a empty string ******/
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (res, req) => {
    try {

        const { profilePic } = req.body;

        /****** We can access the user because this method is protected by the middleware, in the middleware we have added the user object to the request object ******/
        const userId = req.user._id;

        if(!profilePic) return res.status(404).json({ message: "No profile picture provided" });

        /****** Upload the profile picture to cloudinary (Cloud server)******/
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        /****** Update the user profile picture in the database ******/
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }); /****** Can hover the {new: true} to understand its function *******/

        res.status(200).json(updateUser);

    } catch (error) {

        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }
};


export const checkAuth = (req, res) => {

    try {

        res.status(200).json(req.user);

    } catch (error) {

        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }

}