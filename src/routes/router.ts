import { Router } from "express";
import translationRouter from "./translation.route";

const router = Router({ mergeParams: true });

router.use("/translation", translationRouter);

export default router;