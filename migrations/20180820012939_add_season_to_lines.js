
exports.up = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.integer('season');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.dropColumn('season');
  })
};
