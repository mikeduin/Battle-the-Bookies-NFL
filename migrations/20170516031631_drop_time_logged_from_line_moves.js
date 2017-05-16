
exports.up = function(knex, Promise) {
  return knex.schema.table('line_moves', function(t){
    t.dropColumn('TimeLogged');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('line_moves', function(t){
    t.specificType('TimeLogged', 'jsonb[]');
  })
};
