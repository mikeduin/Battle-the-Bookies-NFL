
exports.up = function(knex) {
  return knex.schema.alterTable('user_seasons', t => {
    t.boolean('active').defaultTo(true);
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('user_seasons', t => {
    t.dropColumn('active');
  })
};
