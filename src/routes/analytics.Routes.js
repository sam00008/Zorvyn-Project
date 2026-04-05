import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { getCategory, getMonthly, getRecentAcitvity, getSummary } from "../controllers/analytics.controller";

const router = Router();

router.route("/summary").get(verifyjwt,authorizeRole(["admin","analyst"]),getSummary);

router.route("/category").get(verifyjwt,authorizeRole(["admin","analyst"]),getCategory);

router.route("/monthly").get(verifyjwt,authorizeRole(["admin","analyst"]),getMonthly);

router.route("/recent").get(verifyjwt,authorizeRole(["admin","analyst"]),getRecentAcitvity);

export default router;