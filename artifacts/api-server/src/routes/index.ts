import { Router, type IRouter } from "express";
import healthRouter from "./health";
import walletRouter from "./wallet";
import assetsRouter from "./assets";
import transactionsRouter from "./transactions";
import cardsRouter from "./cards";
import nfcRouter from "./nfc";
import marketRouter from "./market";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(walletRouter);
router.use(assetsRouter);
router.use(transactionsRouter);
router.use(cardsRouter);
router.use(nfcRouter);
router.use(marketRouter);
router.use(dashboardRouter);

export default router;
