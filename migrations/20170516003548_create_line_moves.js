
exports.up = function(knex, Promise) {
  return knex.schema.createTable('line_moves', function(t){
    t.string('EventID').notNullable().unique();
    t.string('AwayAbbrev');
    t.string('HomeAbbrev');
    t.specificType('HomeSpreads', 'jsonb[]');
    t.specificType('HomeSpreadJuices', 'jsonb[]');
    t.specificType('AwaySpreads', 'jsonb[]');
    t.specificType('AwaySpreadJuices', 'jsonb[]');
    t.specificType('HomeMLs', 'jsonb[]');
    t.specificType('AwayMLs', 'jsonb[]');
    t.specificType('Totals', 'jsonb[]');
    t.specificType('TotalOverJuices', 'jsonb[]');
    t.specificType('TotalUnderJuices', 'jsonb[]');
    t.specificType('TimeLogged', 'jsonb[]');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('line_moves');
};
