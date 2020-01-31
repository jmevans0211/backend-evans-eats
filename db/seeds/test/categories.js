const data = require('../../../data')

const createCategory = (knex, category) => {
  return knex('categories')
    .insert(
      {
        category_name: category.category_name
      },
      'id'
    )
    .then(category_id => {
      let recipePromises = [];

      data.recipes.forEach(recipe => {
        if (recipe.category === category.category_name) {
          recipePromises.push(
            createRecipe(knex, {
              recipe_name: recipe.recipe_name,
              approx_time: recipe.approx_time,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
              notes: recipe.notes,
              image_url: recipe.image_url,
              category: recipe.category,
              category_id: category_id[0]
            })
          );
        }
      });

      return Promise.all(recipePromises);
    });
};

const createRecipe = (knex, recipe) => {
  return knex('recipes').insert(recipe);
};

exports.seed = knex => {
  return knex('recipes')
    .del()
    .then(() => knex('categories').del())
    .then(() => {
      let categoryPromises = []

      data.categories.forEach(category => {
        categoryPromises.push(createCategory(knex, category));
      });

      return Promise.all(categoryPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
}
