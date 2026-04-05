import { Router } from "express";
import { authorizeRole } from "../middleware/role.middleware";
import { verifyjwt } from "../middleware/auth.middleware";
import { adminLogin, adminLogOut, updateDetails } from "../controllers/adminAuth.controller.js";
import { createUser } from "../controllers/userAuth.controller.js";

const router = Router();

router.route("/login").post(adminLogin);

router.route("/admin").put(verifyjwt,authorizeRole(["admin"]),updateDetails);

router.route("/logout").post(verifyjwt,adminLogOut);

router.route("/users").post(verifyjwt,authorizeRole(["admin"]),createUser);

export default router;