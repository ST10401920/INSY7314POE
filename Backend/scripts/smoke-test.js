async function main() {
  try {
    const res = await fetch('http://localhost:5400/health'); // adjust endpoint
    if(res.status === 200) console.log('API OK');
    else console.log('API response failed', res.status);
  } catch (err) {
    console.error('API test failed', err);
    process.exit(1);
  }
}

main();
