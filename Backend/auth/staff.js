import express from "express";
import bcrypt from "bcrypt";
import { client } from "../db/db.js";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";

const app = express();
const db = client.db("INSY7314-Task2-DB");
const collection = db.collection("EmployeeData");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: "Too many login attempts. Try again after 15 minutes" }
});

app.post("/employee-login", limiter, async (req, res) => {
    const { username, employeeNumber, password } = req.body;

    try {
        const employee = await collection.findOne({ username, employeeNumber });

        if (!employee) {
            return res.status(401).json({
                message: "Incorrect credentials. Please check your username, employee number, and password."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect credentials. Please check your username, employee number, and password."
            });
        }

        const token = jwt.sign(
            { username: employee.username, employeeNumber: employee.employeeNumber, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Welcome back!", token });

    } catch (err) {
        console.error("Employee login error:", err);
        res.status(500).json({ message: "Login failed due to server error." });
    }
});

export default app;
