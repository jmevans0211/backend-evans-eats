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

app.post('/api/v1/recipes/:id', async (request, response) => {
  //id refers to the category id...?
  const recipe = request.body;
  const parameters = [
    'recipe_name',
    'category_id',
    'approx_time',
    'ingredients',
    'instructions',
    'notes',
    'image_url'
  ];

  for (let requiredParameter of parameters) {
    if (!recipe[requiredParameter]) {
      response.status(422).json({
        error: `POST failed, missing required parameters: ${parameters.join(
          ', '
        )}. Missing: ${requiredParameter}`
      });
      return;
    }
  }

  try {
    const newRecipe = await database('recipes').insert(recipe, 'id');
    response.status(201).json({ id: newRecipe[0] });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/v1/recipe/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const recipe = await database('recipes')
      .where('id', id)
      .del();

    if (recipe > 0) {
      return response.status(200).json({ id });
    } else {
      response
        .status(404)
        .json({ error: 'No recipe with this id can be found' });
    }
  } catch (error) {
    response.status(500).json(error);
  }
});
// get recipes based off of category DONE
// get individual recipe?? DONE
// post new recipe DONE
// delete recipe

module.exports = app;