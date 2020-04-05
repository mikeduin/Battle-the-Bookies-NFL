const knex = require('../db/knex');
const mainDb = knex.mainDb;
const dateConstants = require('./dateConstants');
const sf = require('./currentSeason');
const getSeasonUsers = require('./getSeasonUsers');

function Picks () {
  return mainDb('picks')
}

function UserSeasons () {
  return mainDb('user_seasons');
}

let season = sf.fetchSystemYear();

function sortWeekNumbers(a, b) {
  return parseInt(a.substring(5)) - parseInt(b.substring(5))
};


setInterval(async () => {
  if (moment().isSameOrAfter(dateConstants[season.start]) && moment().isSameOrBefore(dateConstants[season.end])) {
    const seasonUsers = await getSeasonUsers.getUsers(season);
    const weeks = await Picks()
      .where({season: season})
      .whereNot({WeekNumb: "PRE"})
      .whereNot({WeekNumb: "POST"})
      .pluck('Week')
      .distinct();
    weeks.sort(sortWeekNumbers);
    seasonUsers.forEach(async user => {

      let seasonObj = user.btb_seasons.filter(btb_season => btb_season.season === season);

      let ytdResults = {
        dollars: 0,
        games: 0,
        wins: 0,
        losses: 0,
        capperGrade: 0
      }
      const weekResults = await Promise.all(weeks.map(week => {
        return Picks().where({username: user.username, Week: week, season: season}).then(function(results){

          let totCapperGrade = 0;
          let cappedGames = 0;
          let totalDollars = 0;
          let totalGames = 0;
          let totalWins = 0;
          let totalLosses = 0;
          let week;
          let username;

          results.forEach(result => {
            // these results logged below are divided into EACH PICK
              if (result.finalPayout !== 0) {
                username = result.username;
                week = result.Week;
                totalDollars += result.finalPayout;
                ytdResults.dollars += result.finalPayout;
                totalGames++;
                ytdResults.games++;
                totalWins += result.resultBinary;
                ytdResults.wins += result.resultBinary;
                totalLosses += (1-result.resultBinary);
                ytdResults.losses += (1-result.resultBinary);
                if (result.capperGraded) {
                  totCapperGrade += result.capperGrade;
                  cappedGames++;
                }
              };
          });

          const avgCapperGrade = totCapperGrade / cappedGames;
          ytdResults.capperGrade += (avgCapperGrade || 0);
          return {username: user.username, week, totalDollars, totalWins, totalLosses, totalGames, avgCapperGrade}
        })
      }));

      // !! DEADCTIVATING INSERT FUNCTION !!
      // let upd = await UserSeasons().insert({
      //   username: user.username,
      //   season: season,
      //   buyin: seasonObj[0].buyin,
      //   plan: seasonObj[0].plan,
      //   ytd_w: ytdResults.wins,
      //   ytd_l: ytdResults.losses,
      //   ytd_dollars: ytdResults.dollars,
      //   capper_grade: ytdResults.capperGrade,
      //   weekly_results: JSON.stringify(weekResults)
      // }, '*');
      // console.log(upd[0].username, ' has been updated for ', season);

      let upd = await UserSeasons().where({username: user.username, season: season}).update({
        ytd_w: ytdResults.wins,
        ytd_l: ytdResults.losses,
        ytd_dollars: ytdResults.dollars,
        capper_grade: ytdResults.capperGrade,
        buyin: seasonObj[0].buyin,
        plan: seasonObj[0].plan,
        weekly_results: JSON.stringify(weekResults)
      }, '*');
      console.log(upd[0].username, ' has been updated for ', season);
    })
  }
}, 600000)
