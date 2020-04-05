exports.up = function(knex) {
  return knex.schema.createTable('user_seasons', t => {
    t.increments();
    t.string('username');
    t.integer('season');
    t.integer('buyin');
    t.string('plan');
    t.float('ytd_w');
    t.float('ytd_l');
    t.float('ytd_dollars');
    t.float('capper_grade');
    t.string('weekly_results');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_seasons');
};
