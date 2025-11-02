import fetch from 'node-fetch';

async function testHealth() {
  try {
    const res = await fetch('http://localhost:5400/health'); 
    if (res.status === 200) console.log('✅ /health OK');
    else throw new Error(`/health returned ${res.status}`);
  } catch (err) {
    console.error('❌ /health test failed', err);
    process.exit(1);
  }
}

async function testBruteForce() {
  const url = 'http://localhost:5400/auth/login';
  const badCreds = { username: 'wrong', password: 'wrong' };
  let blocked = false;

  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { method: 'POST', body: JSON.stringify(badCreds), headers: { 'Content-Type': 'application/json' } });
    if (res.status === 429 || res.status === 403) blocked = true; // express-brute blocks
  }

  if (blocked) console.log('✅ express-brute blocking works');
  else {
    console.error('❌ express-brute did not block repeated attempts');
    process.exit(1);
  }
}

async function main() {
  await testHealth();
  await testBruteForce();
}

main();
