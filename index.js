import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/db/index.js";
import { createAdmin } from "./src/controllers/adminAuth.controller.js";

dotenv.config();
const port = process.env.PORT || 8000;
const startServer = async () => {
    try {
         await connectDB();
         await createAdmin();
         console.log("MongoDB connected successfully");

        app.listen(port,() => {
            console.log(`Server running at http://localhost:${port}`)
        })
    } catch (error) {
        console.error("MongoDB connection failed", error.message);
    }
};

startServer();