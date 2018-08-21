
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.specificType('btb_seasons', 'jsonb[]');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.dropColumn('btb_seasons');
  })
};
