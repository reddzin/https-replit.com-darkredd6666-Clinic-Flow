import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stripeWebhookRouter from "./stripe-webhook";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stripeWebhookRouter);

export default router;
