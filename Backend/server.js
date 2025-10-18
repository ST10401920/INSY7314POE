import https from "https";
import express from "express";
import fs from "fs";
import { connect } from "./db/db.js";
import user from "./auth/user.js";
import helmet from "helmet";
import cors from "cors";
import transactionRoutes from "./models/transaction.js";
import staff from "./auth/staff.js";

const app = express();
app.use(express.json());

// https://expressjs.com/en/advanced/best-practice-security.html
// Protects against common web vulnerabilities
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// Enable CORS for your frontend running on HTTPS
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);

const PORT = 5400;

// HTTPS certificate (mkcert or local)
const server = https.createServer(
  {
    key: fs.readFileSync("keys/localhost+1-key.pem"),
    cert: fs.readFileSync("keys/localhost+1.pem"),
  },
  app
);

connect();

app.use(user);
app.use(transactionRoutes);
app.use(staff)

server.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
