import express from "express";
import cookieParser from "cookie-parser";
import adminAuth from "./src/routes/adminAuth.Routes.js";
import userAuth from "./src/routes/userAuth.Routes.js";
import records from "./src/routes/record.Routes.js";
import analytics from "./src/routes/analytics.Routes.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

app.use(
    cors({
        origin : "http://localhost:5173",
        credentials : true,
        methods : ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
        allowHeaders : ["Content-Type","Authorization"],
    }),
);

app.use("/api/v1/auth",adminAuth);
app.use("/api/v1/user",userAuth);
app.use("/api/v1/records",records);
app.use("/api/v1/records",analytics);


export default app;