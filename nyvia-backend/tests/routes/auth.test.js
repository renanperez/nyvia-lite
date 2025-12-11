const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');

describe('Auth Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
  });

  describe('POST /auth/register', () => {
    test('should fail without email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ password: '123456' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should fail without password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});

// describe: agrupa testes da rota /auth
// beforeAll: configura servidor Express antes dos testes
// test: testa casos específicos (sem email, sem senha)
// expect: valida status HTTP e mensagens de erro