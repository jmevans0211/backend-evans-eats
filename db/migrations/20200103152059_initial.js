exports.up = knex => {
  return Promise.all([
    knex.schema.createTable('categories', table => {
      table.increments('id').primary();
      table.string('category_name');

      table.timestamps(true, true)
    }),

    knex.schema.createTable('recipes', table => {
      table.increments('id').primary();
      table.string('recipe_name');
      table.string('approx_time');
      table.string('ingredients', 1000);
      table.string('instructions', 1000);
      table.string('notes', 1000);
      table.string('image_url', 500);
      table.string('category');
      table.integer('category_id').unsigned();
      table.foreign('category_id')
        .references('categories.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  ])
};

exports.down = knex => {
  return Promise.all([
    knex.schema.dropTable('recipes'),
    knex.schema.dropTable('categories')
  ])
};
