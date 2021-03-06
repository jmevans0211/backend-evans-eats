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

  describe('GET /api/v1/recipe/:id', () => {
    it('should return a 200 status code and the recipe with the matching id', async () => {
      const expectedRecipe = await database('recipes').first();
      const { id } = expectedRecipe;

      const response = await request(app).get(`/api/v1/recipe/${id}`);
      const recipe = response.body[0];

      expect(response.status).toBe(200);
      expect(recipe.recipe_name).toBe(expectedRecipe.recipe_name);
    });

    it('should return a 404 status code and the message `Recipe not found.`', async () => {
      const invalidId = -1;

      const response = await request(app).get(`/api/v1/recipe/${invalidId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Recipe not found');
    });
  });

  describe('POST /api/v1/recipes/:id', () => {
    it('should return a 201 status code and add a new recipe to the database', async () => {
      const selected = await database('categories').first();
      const { id } = selected;
      const newRecipe = {
        recipe_name: 'Tacos',
        category_id: `${id}`,
        approx_time: 'Taco time',
        ingredients: 'Tortillas, chicken, pico',
        instructions: 'Wing it',
        notes: 'Best tacos ever',
        image_url: 'image.jpeg',
      };
      const response = await request(app)
        .post(`/api/v1/recipes/${id}`)
        .send(newRecipe);
      const recipe = await database('recipes')
        .where({ recipe_name: 'Tacos' })
        .first();

      expect(response.status).toBe(201);
      expect(recipe.recipe_name).toBe(newRecipe.recipe_name);
    });

    it('should return a 422 status code and an error message', async () => {
      const selected = await database('categories').first();
      const { id } = selected;
      const incompleteRecipe = {
        recipe_name: 'Tacos',
        category_id: `${id}`,
        approx_time: 'Taco time',
        ingredients: 'Tortillas, chicken, pico',
        notes: 'Best tacos ever',
        image_url: 'image.jpeg',
      };
      const response = await request(app)
        .post(`/api/v1/recipes/${id}`)
        .send(incompleteRecipe);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(
        'POST failed, missing required parameters: recipe_name, category_id, approx_time, ingredients, instructions, notes, image_url. Missing: instructions'
      );
    });
  });

  describe('DELETE /api/v1/recipe/:id', () => {
    it('should return a 200 status code and remove the recipe from the category and the database', async () => {
      const currentRecipes = await database('recipes').select();
      const recipeToDelete = await database('recipes').first();

      const response = await request(app).delete(
        `/api/v1/recipe/${recipeToDelete.id}`
      );
      const updatedRecipes = await database('recipes').select();

      expect(response.status).toBe(200);
      expect(updatedRecipes.length).toBe(currentRecipes.length - 1);
    });

    it('should return a 404 status code and an error message when there is no recipe found', async () => {
      const response = await request(app).delete('/api/v1/recipe/-1');
      const expectedMessage = 'No recipe with this id can be found';

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(expectedMessage);
    });
  });
});