
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.boolean('2017');
    t.boolean('2018');
    t.boolean('2019');
    t.boolean('2020');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.dropColumn('2017');
    t.dropColumn('2018');
    t.dropColumn('2019');
    t.dropColumn('2020');
  })
};
