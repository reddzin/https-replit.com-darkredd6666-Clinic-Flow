import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stripeWebhookRouter from "./stripe-webhook";
import clinicsRouter from "./clinics";
import reviewsRouter from "./reviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stripeWebhookRouter);
router.use(clinicsRouter);
router.use(reviewsRouter);

export default router;
