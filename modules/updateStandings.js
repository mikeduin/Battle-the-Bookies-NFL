const knex = require('../db/knex');
const mainDb = knex.mainDb;
const dateConstants = require('./dateConstants');

console.log(dateConstants[2017].start);


function Picks () {
  return mainDb('picks')
}
