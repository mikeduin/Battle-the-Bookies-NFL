const knex = require('../db/knex');
const mainDb = knex.mainDb;
const dateConstants = require('./dateConstants');
const sf = require('./currentSeason');
const getSeasonUsers = require('./getSeasonUsers');

// console.log(dateConstants[2017].start);

function Picks () {
  return mainDb('picks')
}

const season = sf.fetchSystemYear();

function sortWeekNumbers(a, b) {
  return parseInt(a.substring(5)) - parseInt(b.substring(5))
};
// change this to setInterval
//
// setTimeout(async () => {
//   const seasonUsers = await getSeasonUsers.getUsers(season);
//   const weeks = await Picks()
//     .where({season: season})
//     .whereNot({WeekNumb: "PRE"})
//     .whereNot({WeekNumb: "POST"})
//     .pluck('Week')
//     .distinct();
//   weeks.sort(sortWeekNumbers);
//   seasonUsers.forEach(async user => {
//     let ytdResults = {
//       dollars: 0,
//       games: 0,
//       wins: 0,
//       losses: 0,
//       capperGrade: 0
//     }
//     const weekResults = await Promise.all(weeks.map(week => {
//       return Picks().where({username: user.username, Week: week, season: season}).then(function(results){
//
//         let totCapperGrade = 0;
//         let cappedGames = 0;
//         let totalDollars = 0;
//         let totalGames = 0;
//         let totalWins = 0;
//         let totalLosses = 0;
//         let week;
//         let username;
//
//         results.forEach(result => {
//           // these results logged below are divided into EACH PICK
//             if (result.finalPayout !== 0) {
//               username = result.username;
//               week = result.Week;
//               totalDollars += result.finalPayout;
//               ytdResults.dollars += result.finalPayout;
//               totalGames++;
//               ytdResults.games++;
//               totalWins += result.resultBinary;
//               ytdResults.wins += result.resultBinary;
//               totalLosses += (1-result.resultBinary);
//               ytdResults.losses += (1-result.resultBinary);
//               if (result.capperGraded) {
//                 totCapperGrade += result.capperGrade;
//                 cappedGames++;
//               }
//             };
//         });
//
//         const avgCapperGrade = totCapperGrade / cappedGames;
//         ytdResults.capperGrade += avgCapperGrade;
//         return {username: user.username, week, totalDollars, totalWins, totalLosses, totalGames, avgCapperGrade}
//       })
//
//     }));
//     // console.log(weekResults);
//     // console.log(user.username, ytdResults);
//   })
// }, 1000)
//

// router.get('/weeklyStats/:username/:season', function(req, res, next){
//   var username = req.params.username;
//   var season = req.params.season;
//   var weekArray = [];
//   Picks()
//     .where({season: season})
//     .whereNot({WeekNumb: "PRE"})
//     .whereNot({WeekNumb: "POST"})
//     .pluck('Week')
//     .distinct()
//   .then(function(weeks){
//     weekArray = weeks;
//     weeks = weekArray.sort();
//     return weeks
//   }).then(function(weeks){
//
//     var weekNumbers = [];
//     var newWeeks = [];
//     for (i=0; i<weeks.length; i++) {
//       var weekNumber = parseInt(weeks[i].substring(5));
//       weekNumbers.push(weekNumber)
//     };
//     weekNumbers.sort(sortNumber);
//     for (i=0; i<weekNumbers.length; i++) {
//       var newWeek = "Week " + weekNumbers[i];
//       newWeeks.push(newWeek)
//     };
//
//     Promise.all(newWeeks.map(function(week){
//       return Picks().where({username: username, Week: week, season: season}).then(function(results){
//
//         var totCapperGrade = 0;
//         var cappedGames = 0;
//
//         var totalDollars = 0;
//         var totalGames = 0;
//         var totalWins = 0;
//         var totalLosses = 0;
//         var week;
//         var username;
//
//         results.forEach(function(result){
//           // these results logged below are divided into EACH PICK
//             if (result.finalPayout !== 0) {
//               username = result.username;
//               week = result.Week;
//               // MatchDay = result.MatchDay;
//               totalDollars += result.finalPayout;
//               totalGames += 1;
//               totalWins += result.resultBinary;
//               totalLosses += (1-result.resultBinary);
//               if (result.capperGraded) {
//                 totCapperGrade += result.capperGrade;
//                 cappedGames +=1;
//               }
//             };
//         });
//
//         var avgCapperGrade = totCapperGrade / cappedGames;
//
//         return {username: username, week: week, totalDollars: totalDollars, totalWins: totalWins, totalLosses: totalLosses, totalGames: totalGames, avgCapperGrade: avgCapperGrade}
//       })
//
//     })).then(function(userArray){
//       console.log(userArray);
//       res.json(userArray)
//     })
//   })
// })
