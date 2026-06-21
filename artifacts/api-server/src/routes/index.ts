import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stripeWebhookRouter from "./stripe-webhook";
import clinicsRouter from "./clinics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stripeWebhookRouter);
router.use(clinicsRouter);

export default router;
