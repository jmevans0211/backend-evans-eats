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

  describe('GET /api/v1/recipes', () => {
    it('should return a 200 status code and all of the recipes', async () => {
      const expectedProjects = await database('recipes').select();

      const response = await request(app).get('/api/v1/recipes');
      const recipes = response.body;

      expect(response.status).toBe(200);
      expect(recipes[0].recipe_name).toEqual(
        expectedProjects[0].recipe_name
      );
    });
  });

  describe('GET /api/v1/recipes/:id', () => {
    it('should return a status code of 200 and get all recipes with a specific category id', async () => {
      const expectedCategory = await database('categories').first();
      const { id } = expectedCategory;

      const response = await request(app).get(`/api/v1/recipes/${id}`);
      const expectedRecipes = await database('recipes')
        .where('category_id', id)
        .select();
      const { recipe_name, approx_time } = response.body[0];

      expect(response.status).toBe(200);
      expect(recipe_name).toEqual(expectedRecipes[0].recipe_name);
      expect(approx_time).toEqual(expectedRecipes[0].approx_time);
    });

    it('should return a 404 status code and the message `No recipes found for this category.`', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/recipes/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No recipes found for this category');
    });
  });
});