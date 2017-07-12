
exports.up = function(knex, Promise) {
  return knex.schema.createTable('pick_arrays', function(t){
    t.string('EventID').notNullable().unique();
    t.specificType('OverPickArray', 'jsonb[]');
    t.specificType('UnderPickArray', 'jsonb[]');
    t.specificType('AwaySpreadPickArray', 'jsonb[]');
    t.specificType('HomeSpreadPickArray', 'jsonb[]');
    t.specificType('AwayMLPickArray', 'jsonb[]');
    t.specificType('HomeMLPickArray', 'jsonb[]');
    t.specificType('NoPickArray', 'jsonb[]');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pick_arrays');
};
