import express from "express";
import bcrypt from "bcrypt";
import { client } from "../db/db.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { rateLimit } from "express-rate-limit";

const app = express();
const db = client.db("INSY7314-Task2-DB");
let salt = 10;
let collection = db.collection('Users');

app.post('/signup', async (req, res) => {
    try {
        // https://medium.com/@artemkhrenov/the-complete-guide-to-joi-validation-in-production-node-js-applications-96acaddae056
        const userSchema = Joi.object({
            name: Joi.string().alphanum().min(3).max(30).required(),
            surname: Joi.string().alphanum().min(3).max(30).required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
            id: Joi.string().min(13).max(13).required(),
            // todo: auto-create accountNum later
            accountNum: Joi.string().min(12).max(12).required(),
            password: Joi.string()
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/)
                .required()
        });

        const validationResult = userSchema.validate(req.body);
        if (validationResult.error) {
            return res.status(400).json({ message: validationResult.error.message });
        }

        const existingUser = await collection.findOne({ id: req.body.id });
        if (existingUser) {
            return res.status(409).json({ message: "ID already in use" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        let userModel = {
            name: validationResult.value.name,
            surname: validationResult.value.surname,
            username: validationResult.value.username,
            id: validationResult.value.id,
            accountNum: validationResult.value.accountNum,
            password: hashedPassword,
            role: "customer"
        };

        await collection.insertOne(userModel);
        res.status(201).send({
            result: `You have successfully signed up ${userModel.name} ${userModel.surname}`
        });
    } catch (err) {
        res.status(500).send({ result: `There was an issue creating your account` });
        console.error("Failed to create account", err);
    }
});

// https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: "Too many login attempts. Try again after 15 minutes" }
});

app.post('/login', limiter, async (req, res) => {
    const { username, accountNum, password } = req.body;
    try {
        const user = await collection.findOne({ username, accountNum });

        if (!user) {
            return res.status(401).send({
                message: "Incorrect credentials. Please check your Account Number, Username and Password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({
                message: "Incorrect credentials. Please check your Account Number, Username and Password"
            });
        } else {
            const token = jwt.sign(
                { accountNum: user.accountNum, role: user.role  },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ message: "Welcome Back", token });
        }
    } catch (err) {
        res.status(401).json({ message: "Failed Login Attempt. Please check your credentials" });
        console.error("Failed Login", err);
    }
});

export default app;
