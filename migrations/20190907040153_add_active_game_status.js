exports.up = function(knex, Promise) {
  return knex.schema.table('lines', (t) => {
    t.boolean('active').defaultTo(true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('lines', (t) => {
    t.dropColumn('active');
  })
};
