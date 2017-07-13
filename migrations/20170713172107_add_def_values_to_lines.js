
exports.up = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.dropColumn('MLHomePicks');
    t.dropColumn('MLAwayPicks');
    t.dropColumn('SpreadHomePicks');
    t.dropColumn('SpreadAwayPicks');
    t.dropColumn('OverPicks');
    t.dropColumn('UnderPicks');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('lines', function(t){
    t.integer('MLHomePicks');
    t.integer('MLAwayPicks');
    t.integer('SpreadHomePicks');
    t.integer('SpreadAwayPicks');
    t.integer('OverPicks');
    t.integer('UnderPicks');
  })
};
