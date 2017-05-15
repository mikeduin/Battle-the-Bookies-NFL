
exports.up = function(knex, Promise) {
  return knex.schema.createTable('lines', function(t){
    t.increments();
    t.string('EventID').unique().notNullable();
    t.string('HomeTeam').notNullable();
    t.string('AwayTeam').notNullable();
    t.timestamp('MatchTime').notNullable();
    t.string('OddType');
    t.string('MatchDay');
    t.integer('DateNumb');
    t.string('WeekNumb');
    t.integer('Week');
    t.string('HomeAbbrev');
    t.string('AwayAbbrev');
    t.string('HomeHelmet');
    t.string('AwayHelmet');
    t.string('HomeColor');
    t.string('AwayColor');
    t.integer('MoneyLineHome');
    t.integer('MoneyLineAway');
    t.float('PointSpreadHome');
    t.float('PointSpreadAway');
    t.integer('PointSpreadAwayLine');
    t.integer('PointSpreadHomeLine');
    t.float('TotalNumber');
    t.integer('OverLine');
    t.integer('UnderLine');
    t.string('GameStatus');
    t.integer('HomeScore');
    t.integer('AwayScore');
    t.integer('MLHomePicks').defaultTo(0);
    t.integer('MLAwayPicks').defaultTo(0);
    t.integer('SpreadHomePicks').defaultTo(0);
    t.integer('SpreadAwayPicks').defaultTo(0);
    t.integer('OverPicks').defaultTo(0);
    t.integer('UnderPicks').defaultTo(0);
    t.float('HomeSpreadBest');
    t.float('HomeSpreadWorst');
    t.float('AwaySpreadBest');
    t.float('AwaySpreadWorst');
    t.integer('AwayMLBest');
    t.integer('AwayMLWorst');
    t.integer('HomeMLBest');
    t.integer('HomeMLWorst');
    t.float('TotalHigh');
    t.float('TotalLow');
    t.boolean('ArraysBuilt');
    t.boolean('RangesSet');
    t.boolean('CapperGraded');
    t.jsonb('AwaySpreadIndex');
    t.jsonb('HomeSpreadIndex');
    t.jsonb('TotalOverIndex');
    t.jsonb('TotalUnderIndex');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('lines');
};
