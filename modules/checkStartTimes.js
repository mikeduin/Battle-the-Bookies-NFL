// var mongoose = require('mongoose');
// var Line = mongoose.model('Line');
// var Pick = mongoose.model('Pick');
//
// // The function below checks to make sure that no game start times have been adjusted and then updates the associated picks with the new start times in order to show that games and picks are displayed in an identical order on the Results page. It runs roughly four times a day.
//
// module.exports = {
//   checkStartTimes: function (){
//     Line.find({
//       GameStatus: {
//         $ne: "Final"
//       }
//     }, function (err, lines){
//       if (err) {console.log(err)}
//
//     }).then(function(lines){
//       lines.forEach(function(line){
//         Pick.update({
//           EventID: line.EventID
//         }, {
//           MatchTime: line.MatchTime
//         }, {
//           multi: true
//         },function(err, result){
//           if (err) {console.log(err)}
//
//         })
//       })
//     })
//     console.log("game times have been updated")
//   }
// }
