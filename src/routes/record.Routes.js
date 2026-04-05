
import { Router } from "express";
import { authorizeRole } from "../middleware/role.middleware.js";
import { createRecord, deleteRecord, getRecord, updateRecord } from "../controllers/records.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(verifyjwt,authorizeRole(["admin"]),createRecord);

router.route("/").get(verifyjwt,getRecord);

router.route("/:id").put(verifyjwt,authorizeRole(["admin"]),updateRecord);

router.route("/:id").delete(verifyjwt,authorizeRole(["admin"]),deleteRecord);

export default router;