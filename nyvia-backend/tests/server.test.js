const request = require('supertest');
const express = require('express');

describe('Server Health Check', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
  });

  test('GET /health should return status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

// describe: agrupa testes relacionados
// beforeAll: executa antes de todos os testes do grupo
// test: define um teste individual
// expect: verifica se o resultado está correto