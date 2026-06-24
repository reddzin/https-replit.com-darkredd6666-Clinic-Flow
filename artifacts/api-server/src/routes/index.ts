import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stripeWebhookRouter from "./stripe-webhook";
import clinicsRouter from "./clinics";
import reviewsRouter from "./reviews";
import appReviewsRouter from "./app-reviews";
import patientsRouter from "./patients";
import clinicUsersRouter from "./clinic-users";
import clinicConveniosRouter from "./clinic-convenios";
import reportsRouter from "./reports";
import caktoRouter from "./cakto";
import { requireSubscription } from "../middleware/requireSubscription";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stripeWebhookRouter);
router.use(caktoRouter);

// Public clinic routes (booking page, etc.) — no subscription check
router.use(clinicsRouter);
router.use(reviewsRouter);
router.use(appReviewsRouter);
router.use(patientsRouter);

// Protected sub-routes: /api/clinics/:slug/* — subscription required
// This middleware only matches paths with something after the slug (e.g. /reports, /users)
// It does NOT match /api/clinics/:slug (the public clinic profile used by booking pages)
router.use("/clinics/:slug/", requireSubscription as IRouter);

router.use(clinicUsersRouter);
router.use(clinicConveniosRouter);
router.use(reportsRouter);

export default router;
