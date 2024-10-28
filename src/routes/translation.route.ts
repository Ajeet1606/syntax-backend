import { Router } from "express";
import TranslationController from "../controller/translation.controller";

const translationRouter = Router();
const translationController = new TranslationController();

translationRouter.post("/", translationController.getTranslation);

export default translationRouter;