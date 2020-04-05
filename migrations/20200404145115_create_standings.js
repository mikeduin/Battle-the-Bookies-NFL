exports.up = function(knex) {
  return knex.schema.createTable('standings', t => {
    t.increments();
    t.string('username');
    t.integer('season');
    t.integer('ytd_w')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('standings');
};
