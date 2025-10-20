import express from "express";
import { checkAuth, authorizeRole  } from "../auth/checkAuth.js"; //middleware to enforce JWT authentication
import { client } from "../db/db.js";
import Joi from "joi"; //Input validation to prevent injection attacks
import rateLimit from "express-rate-limit"; // mitigating brute force attacks / DoS attacks
import { ObjectId } from "mongodb";

const router = express.Router();
const db = client.db("INSY7314-Task2-DB");
let collection = db.collection('Transactions');

//rate limiter -> preventing brute force / DoS attacks on transaction endpoints
const transactionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, //window - 5 minutes
  limit: 5,                 // max 1 request per user every 5 minutes
  message: { message: "Too many transaction requests. Please wait 5 minutes." },
  //user account number is preffered if logged in, otherwise fallback to IP
  keyGenerator: (req) => req.user?.accountNum || req.user?.employeeNumber || rateLimit.ipKeyGenerator(req)

});

// POST transactions -> Customer creates a new transaction
router.post("/transactions", checkAuth, authorizeRole(["customer"]), transactionLimiter, async (req, res) => {
  try {
    //Preventing NoSQL injection and malformed payloads
    const schema = Joi.object({
      amount: Joi.number().positive().required(),
      currency: Joi.string().length(3).required(), // e.g. "USD", "ZAR"
      provider: Joi.string().valid("SWIFT").required(),
      payeeAccount: Joi.string().pattern(/^[0-9]+$/).min(12).max(20).required(),
      recipientName: Joi.string().min(3).required(), 
      swiftCode: Joi.string().alphanum().min(8).max(11).required()
    }).unknown(false);

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const transaction = {
      customerAccount: req.user.accountNum,
      amount: value.amount,
      currency: value.currency,
      provider: value.provider,
      payeeAccount: value.payeeAccount,
      recipientName: value.recipientName,
      swiftCode: value.swiftCode,
      status: "PENDING", //Employees will verify later before submitting to SWIFT
      createdAt: new Date()
    };

    await collection.insertOne(transaction);
    res.status(201).json({ message: "Transaction creation successfully", transaction });
  } catch (err) {
    console.error("Transaction failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET transactions - Employees view all transactions
router.get("/transactions", checkAuth , authorizeRole(["employee"]), async (req, res) => {
  try {
    const allTransactions = await collection.find().toArray();
    res.status(200).json(allTransactions);
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch(
  "/transactions/:id/approve",
  checkAuth,
  authorizeRole(["employee"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "APPROVED", approvedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.status(200).json({ message: "Transaction approved successfully" });
    } catch (err) {
      console.error("Approval error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


export default router;
