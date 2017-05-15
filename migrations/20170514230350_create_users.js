
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.increments();
    t.string('username');
    t.string('email');
    t.string('nameFirst');
    t.string('nameLast');
    t.integer('buyin');
    t.string('hash');
    t.string('salt');
    t.string('resetPasswordToken');
    t.date('resetPasswordExpires');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
