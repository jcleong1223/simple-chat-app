import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";


/****** path is a built-in Node.js module. It’s used to safely build file and directory paths that work across different operating systems (Windows, macOS, Linux). ******/
/****** exp: const filePath = path.join(__dirname, 'folder', 'file.txt'); ouptput: C:\Users\yourname\project\folder\file.txt ******/
import path from "path";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

/****** Need to have this use the data in .env file ******/
dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();
/****** Exp of path.resolve();
 * path.resolve('/a', 'b', 'c');     //    C:\a\b\c
 * path.resolve('/a', '/b', 'c');    //    C:\b\c
 * path.resolve('/a', '/b', '/c');   //    C:\c
******/

/****** Need to have this to parse request body as JSON ******/
app.use(express.json());

/****** Need to have this to parse the cookie, so we can get the value of the JWT token ******/
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:5173", /****** Allow only this origin, which is the frontend URL *****/
    credentials: true, /****** Allow the cookies or authorization header to be sent with the request *****/
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {

    /****** The below code is to: Serve static files. This line allows the browser to request assets like /main.js, /style.css, etc., and receive them from the dist folder.******/
    /****** Unlike development, in production, the project is serving together, so need to have this static dist file that compiled into the (index.html, main..js, styles.css) for browser to read ******/
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    /****** If the file is at /Users/alex/project/server/index.js, then __dirname is /Users/alex/project/server ******/


    /****** For example, if a user visits /about, the server won’t find a file called about, so it sends back index.html, and the front-end JS takes over to display the right page. ******/
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist" , "index.html"));
    });
    /****** Why only the production environment needs to include the fallback for SPA? ******/
    /****** Because in development, typically use a frontend development server (like Vite, Webpack Dev Server) which already handles routing and fallback. In development, the frontend runs separately on something like http://localhost:3000 and handles its own routes. The Express backend usually just serves API routes (/api/...), not the frontend. ******/
    /****** But in production, usually serving both backend and frontend from the same Express server: The server needs to handle any route that the frontend might navigate to (e.g., /about, /profile). These routes don’t exist on the server (they’re client-side routes), so the fallback sends index.html******/
}

server.listen(PORT, () => {
    console.log("Server running on port: " +PORT);
    connectDB();
})