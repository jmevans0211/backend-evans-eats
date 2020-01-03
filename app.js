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
    console.log('in get recipes--->', recipes)
    if (recipes.length) {
      response.status(200).json(recipes)
    } else {
      response.status(404).json({error: '400 error!'})
    }
  } catch (error) {
    response.status(500).json({error: '500 error'})
  }
})

module.exports = app;