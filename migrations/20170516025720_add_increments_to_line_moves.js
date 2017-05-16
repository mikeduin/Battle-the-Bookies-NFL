
exports.up = function(knex, Promise) {
  return knex.schema.table('line_moves', function(t){
    t.increments();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('line_moves', function(t){
    t.dropColumn('id');
  })
};
