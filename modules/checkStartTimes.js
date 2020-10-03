const knex = require('../db/knex');
const mainDb = knex.mainDb;
const userDb = knex.userDb;
const moment = require('moment');

function Lines () {
  return mainDb('lines');
}

function Picks () {
  return mainDb('picks');
}

// // The function below checks to make sure that no game start times have been adjusted and then updates the associated picks with the new start times in order to show that games and picks are displayed in an identical order on the Results page. It runs roughly four times a day.
module.exports = {
  checkStartTimes: async function (){
    const pendingGames = await Lines()
      .whereNull('GameStatus')
      .andWhere('MatchTime', '>', new Date())
      .select('EventID', 'MatchTime');

    pendingGames.forEach(async game => {
      const pickUpd = await Picks().where({EventID: game.EventID}).update({
        MatchTime: game.MatchTime
      }, '*');
      console.log('picks updated for ', pickUpd[0].EventID);
    })

  }
}
