// Backend/scripts/smoke-test.js
console.log("Running smoke test...");

async function test() {
  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    // Example endpoint test
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
