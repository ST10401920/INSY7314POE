// Backend/scripts/smoke-test.js
const express = require("express");
const app = express();
app.get("/health", (req, res) => res.sendStatus(200));

const server = app.listen(3000, async () => {
  console.log("Mock server running...");
  try {
    const fetch = (await import("node-fetch")).default;
    const res = await fetch("http://localhost:3000/health");
    if (res.ok) console.log("API is responding correctly!");
    else console.log("API responded with status:", res.status);
  } catch (err) {
    console.error("API test failed:", err.message);
    process.exit(1);
  } finally {
    server.close();
  }
});
