
exports.up = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.integer('MLHomePicks').defaultTo(0);
    t.integer('MLAwayPicks').defaultTo(0);
    t.integer('SpreadHomePicks').defaultTo(0);
    t.integer('SpreadAwayPicks').defaultTo(0);
    t.integer('OverPicks').defaultTo(0);
    t.integer('UnderPicks').defaultTo(0);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.dropColumn('MLHomePicks');
    t.dropColumn('MLAwayPicks');
    t.dropColumn('SpreadHomePicks');
    t.dropColumn('SpreadAwayPicks');
    t.dropColumn('OverPicks');
    t.dropColumn('UnderPicks');
  })
};
