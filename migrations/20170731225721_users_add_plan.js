
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.string('plan');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.dropColumn('plan');
  })
};
