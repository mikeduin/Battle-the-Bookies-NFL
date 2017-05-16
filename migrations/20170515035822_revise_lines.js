
exports.up = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.dropColumn('Week');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.integer('Week');
  });
};
