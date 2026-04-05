import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { loginUser, logoutUser, updateUserDetails } from "../controllers/userAuth.controller.js";
import { authorizeRole } from "../middleware/role.middleware.js";


const router = Router();

router.route("/login").post(loginUser);

router.route("/logout").post(verifyjwt,logoutUser);

router.route("/users").put(verifyjwt,authorizeRole(["admin"]),updateUserDetails);


export default router;