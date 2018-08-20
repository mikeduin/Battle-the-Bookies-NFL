
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.specificType('seasons', 'jsonb[]');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.dropColumn('seasons');
  })
};
