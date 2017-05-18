
exports.up = function(knex, Promise) {
  return knex.schema.createTable('results', function(t){
    t.increments();
    t.string('EventID').unique().notNullable();
    t.integer('HomeScore');
    t.integer('AwayScore');
    t.string('OddType');
    t.boolean('Final');
    t.string('FinalType');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('results');
};
