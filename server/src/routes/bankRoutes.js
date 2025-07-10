import express from "express";
import { addBank, getallBanks, getBankById } from "../controllers/bankControllers.js";

const router = express.Router();



router.get("/", getallBanks);
router.post("/", addBank);
router.get("/:id", getBankById);




export default router;