
exports.up = function(knex, Promise) {
  return knex.schema.table('picks', function(t){
    t.string('plan');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('picks', function(t){
    t.dropColumn('plan');
  })
};
