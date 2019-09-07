var fetch = require('node-fetch');
var knex = require('../db/knex');
var currentSeason = require('./currentSeason');

const seasonYear = currentSeason.fetchSystemYear();

function Lines () {
  return knex('lines');
}

let now = new Date();

module.exports = {
  checkActiveLines: async () => {
    let pendingGames = await Lines().where({
      GameStatus: null,
      season: seasonYear
    }).pluck('EventID');

    let activeGamesPull = await fetch('https://jsonodds.com/api/odds/nfl?oddType=Game', {
      method: 'GET',
      headers: {
        'x-api-Key': process.env.API_KEY
      }
    });

    let activeGames = await activeGamesPull.json();
    let activeGameIds = activeGames.map(game => game.ID);

    // console.log(activeGameIds);

    pendingGames.forEach(game => {
      if (activeGameIds.indexOf(game) == -1) {
        console.log(game, ' is no longer listed!');
      } else {
        console.log(game, ' is active');
      }
    });


  }
}
