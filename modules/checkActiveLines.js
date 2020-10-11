var fetch = require('node-fetch');
var knex = require('../db/knex');
var moment = require('moment');
var currentSeason = require('./currentSeason');

var mainDb = knex.mainDb;
var userDb = knex.userDb;

const seasonYear = currentSeason.fetchSystemYear();

function Lines () {
  return mainDb('lines');
}

module.exports = {
  checkActiveLines: async () => {
    var now = moment();
    const pendingGames = await Lines().where('MatchTime', '>', now).andWhere({
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
    const updatedTimes = {};
    activeGames.forEach(game => {
      updatedTimes[game.ID] = game.Odds[0].LastUpdated;
    })

    pendingGames.forEach(game => {
      const adjHours = moment(updatedTimes[game]).isDST() ? 7 : 8;
      // need to make UTC adjustment in Development
      // if (activeGameIds.indexOf(game) == -1 || moment(updatedTimes[game]).subtract(adjHours, 'hours').utc().isBefore(moment().utc().subtract(15, 'minutes'))) {
      if (activeGameIds.indexOf(game) == -1 || moment(updatedTimes[game]).utc().isBefore(moment().utc().subtract(15, 'minutes'))) {
        Lines().where({EventID: game}).update({
          active: false
        }, '*').then(game => {
          console.log(game[0].EventID, ' has been deactivated as it is not in DB or its updated time is outdated');
        })
      } else {
        console.log(game, ' has been updated recently, staying active');
      }
    });

    const inactiveGames = await Lines().where('MatchTime', '>', now).andWhere({
      GameStatus: null,
      season: seasonYear,
      active: false
    }).pluck('EventID');

    inactiveGames.forEach(inactiveGame => {
      const adjHours = moment(updatedTimes[inactiveGame]).isDST() ? 7 : 8;
      // need to make UTC adjustment in Development
      // if (activeGameIds.indexOf(inactiveGame) !== -1 && (moment(updatedTimes[inactiveGame]).subtract(adjHours, 'hours').utc().isAfter(moment().utc().subtract(15, 'minutes')))) {
      if (activeGameIds.indexOf(inactiveGame) !== -1 && (moment(updatedTimes[inactiveGame]).utc().isAfter(moment().utc().subtract(15, 'minutes')))) {
        Lines().where({EventID: inactiveGame}).update({
          active: true
        }, '*').then(ret => {
          console.log(inactiveGame, ' has been reactivated!');
        })
      } else {
        console.log(inactiveGame, ' is still inactive');
      }
    })
  }
}
