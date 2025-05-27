const request = require('supertest');
const app = require('../app');
const User = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');

describe('User Endpoints', () => {
  let token;
  let testUser;

  beforeEach(async () => {
    // Criar um usuário de teste
    testUser = await User.create({
      name: 'Test User',
      email: 'test@teste.com',
      password: 'password123'
    });

    // Gerar token para o usuário
    token = jwt.sign(
      { id: testUser._id },
      process.env.secret || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id with valid token', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not get user without token', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser._id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('msg', 'Acesso Negado!');
    });

    it('should not get user with invalid token', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'O token é inválido!');
    });

    it('should not get non-existent user', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // ID válido mas não existente
      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('msg', 'Usuário não encontrado!');
    });
  });
}); 