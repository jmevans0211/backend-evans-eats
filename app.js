const express = require('express');
const cors = require('cors');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Evans Eats';
app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.json('Let us Eat!')
});

app.get('/api/v1/recipes', async (request, response) => {
  try {
    const recipes = await database('recipes').select();
    if (recipes.length) {
      response.status(200).json(recipes)
    } else {
      response.status(404).json({error: '400 error!'})
    }
  } catch (error) {
    response.status(500).json({error: '500 error'})
  }
})

app.get('/api/v1/recipes/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const categoryRecipes = await database('recipes')
      .where('category_id', id)
      .select()
    if (categoryRecipes.length) {
      response.status(200).json(categoryRecipes)
    } else {
      response
        .status(404)
        .json({ error: '404 error'})
    }
  } catch (error) {
    response.status(500).json({ error: '500 error'})
  }
})

// get recipes based off of category
// get individual recipe??
// post new recipe
// delete recipe
// delete category

module.exports = app;