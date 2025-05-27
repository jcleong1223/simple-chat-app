import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";

/****** Need to have this use the data in .env file ******/
dotenv.config();
const PORT = process.env.PORT;

const app = express();

/****** Need to have this to parse request body as JSON ******/
app.use(express.json());

/****** Need to have this to parse the cookie, so we can get the value of the JWT token ******/
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:5173", /****** Allow only this origin, which is the frontend URL *****/
    credentials: true, /****** Allow the cookies or authorization header to be sent with the request *****/
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log("Server running on port: " +PORT);
    connectDB();
})