import express from 'express';
import fetch from 'node-fetch';

let server;

beforeAll(() => {
  const app = express();
  app.get('/health', (req, res) => res.status(200).send('OK'));
  server = app.listen(5400);
});

afterAll(() => {
  server.close();
});

test('Mock server /health endpoint returns 200', async () => {
  const res = await fetch('http://localhost:5400/health');
  expect(res.status).toBe(200);
});
