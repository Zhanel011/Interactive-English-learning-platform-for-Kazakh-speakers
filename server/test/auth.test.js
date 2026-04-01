const chai   = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app    = require('../index');

describe('Auth API', () => {

  it('POST /api/auth/register — тіркелу сәтті болуы керек', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: `test${Date.now()}@test.kz`, password: 'test1234' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('POST /api/auth/login — қате пароль қатені қайтаруы керек', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'damir@linguaflow.kz', password: 'wrongpassword' });
    expect(res.status).to.equal(401);
  });

  it('POST /api/auth/login — дұрыс мәліметтермен кіру', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@linguaflow.kz', password: 'linguaflowadmin' });
  expect(res.status).to.equal(200);
  expect(res.body).to.have.property('token');
});

  it('GET /api/auth/me — токенсіз қатені қайтаруы керек', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).to.equal(401);
  });

  it('GET /api/health — сервер жұмыс істеуі керек', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('ok');
  });

});