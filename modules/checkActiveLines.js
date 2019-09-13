var fetch = require('node-fetch');
var knex = require('../db/knex');
var currentSeason = require('./currentSeason');

var mainDb = knex.mainDb;
var userDb = knex.userDb;

const seasonYear = currentSeason.fetchSystemYear();

function Lines () {
  return mainDb('lines');
}

module.exports = {
  checkActiveLines: async () => {
    const pendingGames = await Lines().where({
      GameStatus: null,
      season: seasonYear,
      active: true
    }).pluck('EventID');

    const activeGamesPull = await fetch('https://jsonodds.com/api/odds/nfl?oddType=Game', {
      method: 'GET',
      headers: {
        'x-api-Key': process.env.API_KEY
      }
    });

    const activeGames = await activeGamesPull.json();
    const activeGameIds = activeGames.map(activeGame => activeGame.ID);

    pendingGames.forEach(game => {
      if (activeGameIds.indexOf(game) == -1) {
        Lines().where({EventID: game}).update({
          active: false
        }, '*').then(game => {
          console.log(game[0].ID, ' has been deactivated');
        })
      } else {
        console.log(game, ' is active');
      }
    });

    const inactiveGames = await Lines().where({
      GameStatus: null,
      season: seasonYear,
      active: false
    }).pluck('EventID');

    inactiveGames.forEach(inactiveGame => {
      if (activeGameIds.indexOf(inactiveGame) !== -1) {
        Lines().where({EventID: inactiveGame}).update({
          active: true
        }, '*'),then(ret => {
          console.log(ret[0].ID, ' has been reactivated!');
        })
      } else {
        console.log(inactiveGame, ' is still inactive');
      }
    })
  }
}
