
exports.up = function(knex, Promise) {
  return knex.schema.createTable('picks', function(t){
    t.increments();
    t.string('username').notNullable();
    t.string('EventID').notNullable();
    t.string('MatchDay');
    t.integer('DateNumb');
    t.string('WeekNumb');
    t.timestamp('MatchTime');
    t.string('Week');
    t.integer('HomeScore');
    t.integer('AwayScore');
    t.boolean('Final');
    t.timestamp('submittedAt');
    t.string('activePick');
    t.float('activeSpread');
    t.float('activeTotal');
    t.integer('activeLine');
    t.float('activePayout');
    t.string('pickType');
    t.string('favType');
    t.string('betType');
    t.string('geoType');
    t.string('pickResult');
    t.integer('resultBinary');
    t.float('finalPayout');
    t.boolean('capperGraded');
    t.float('capperGrade');
    t.float('bestLineAvail');
    t.integer('bestJuiceAvail');
    t.string('matchup');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('picks');
};
