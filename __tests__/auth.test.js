const request = require('supertest');
const app = require('../app');
const User = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@teste.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Erro de validação!');
    });

    it('should not register user with existing email', async () => {
      // Primeiro, criar um usuário
      const userData = {
        name: 'Test User',
        email: 'test@teste.com',
        password: 'password123'
      };

      await User.create(userData);

      // Tentar criar outro usuário com o mesmo email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Erro de validação!');
    });

    it('should not register user with invalid data', async () => {
      const invalidData = {
        name: 'Test',
        email: 'invalid-email',
        password: '123' // senha muito curta
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Erro de validação!');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Criar um usuário para teste de login
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('password123', salt);
      
      await User.create({
        name: 'Test User',
        email: 'test@teste.com',
        password: passwordHash
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@teste.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('msg', 'Autenticação realiazada com sucesso');
    });

    it('should not login with invalid password', async () => {
      const loginData = {
        email: 'test@teste.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('msg', 'Senha incorreta');
    });

    it('should not login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@teste.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('msg', 'Usuário não encontrado!');
    });
  });
}); 