exports.up = function(knex) {
  return knex.schema.createTable('podiums', t => {
    t.increments();
    t.integer('league_id');
    t.string('league_name');
    t.integer('season');
    t.string('first');
    t.string('second');
    t.string('third');
    t.timestamp('updated_at');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('podiums');
};
