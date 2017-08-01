
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('picks', function(t){
    t.float('resultBinary').alter();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('picks', function(t){
    t.integer('resultBinary').alter();
  })
};
