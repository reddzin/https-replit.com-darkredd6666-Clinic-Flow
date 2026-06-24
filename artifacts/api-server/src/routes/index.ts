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

const router: IRouter = Router();

router.use(healthRouter);
router.use(stripeWebhookRouter);
router.use(clinicsRouter);
router.use(reviewsRouter);
router.use(appReviewsRouter);
router.use(patientsRouter);
router.use(clinicUsersRouter);
router.use(clinicConveniosRouter);
router.use(reportsRouter);
router.use(caktoRouter);

export default router;
