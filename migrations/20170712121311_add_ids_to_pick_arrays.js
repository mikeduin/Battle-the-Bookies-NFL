
exports.up = function(knex, Promise) {
  return knex.schema.table('pick_arrays', function(t){
    t.increments();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('pick_arrays', function(t){
    t.dropColumn('id');
  })
};
