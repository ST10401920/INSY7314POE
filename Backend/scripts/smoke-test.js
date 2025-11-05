// Backend/scripts/smoke-test.js
console.log("Running smoke test...");

// Simple test to ensure server starts (optional)
const fetch = require("node-fetch");

async function test() {
  try {
    // Example: test a local endpoint
    const res = await fetch("http://localhost:3000/health");
    if (res.ok) {
      console.log("API is responding correctly!");
    } else {
      console.log("API responded with status:", res.status);
      process.exit(1);
    }
  } catch (err) {
    console.error("API test failed:", err.message);
    process.exit(1);
  }
}

test();
