import { Router } from "express";
import { tokenMiddleware } from "../middleware/tokenMiddleware";
import { TransactionRepository } from "../repositories/implementations/transactionRepository";
import { TransactionServices } from "../services/implementations/transactionServices";
import { TransactionController } from "../controllers/transactionController";

const router = Router()

const transactionRepository = new TransactionRepository()
const transactionServices = new TransactionServices(transactionRepository)
const transactionController = new TransactionController(transactionServices)

router.get('/get-transaction', tokenMiddleware, transactionController.getTransactionById)


export default router