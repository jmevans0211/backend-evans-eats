const request = require('supertest');
const app = require('./app');
const environment = 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status code', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
    });
  });
});