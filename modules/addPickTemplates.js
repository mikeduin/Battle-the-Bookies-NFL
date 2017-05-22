// var mongoose = require('mongoose');
// var User = mongoose.model('User');
// var Line = mongoose.model('Line');
// var Pick = mongoose.model('Pick');
//
// // This function below checks every 12 minutes to see if new lines have been added, and if so, adds user pick templates for those lines to ensure results are displayed correctly and in the proper order.

// THIS MODULE IS DEPRECATED PER SQL INTEGRATION; PICK TEMPLATES ARE NOW ADDED IMMEDIATELY AFTER NEW LINES ARE ENTERED INTO THE SYSTEM.

// CHANGE THAT THOUGHT: YOU STILL NEED THIS FOR PRESEASON, BECAUSE IF A USER ENTERS AFTER A LINE HAS BEEN ADDED ... THEY WON'T HAVE A TEMPLATE BUILT FOR THEM AUTOMATICALLY. OR ... DOES THAT NOT MATTER ... ?
//
// module.exports = {
//   addPickTemplates: function(){
//     User.find(function(err, users){
//       if (err) {console.log(err)}
//
//     }).then(function(users){
//       users.forEach(function(user){
//         Line.find({
//           Week: {
//             $nin: ["Preseason", "Postseason"]
//           }
//         }, function(err, lines){
//           if (err) {console.log(err)}
//
//         }).then(function(lines){
//           lines.forEach(function(line){
//             Pick.find({
//               username: user.username,
//               EventID: line.EventID
//             }, function (err, pick){
//               if (err) {console.log(err)}
//
//               if(!pick[0]) {
//
//                 var template = Pick({
//                   username: user.username,
//                   EventID: line.EventID,
//                   MatchDay: line.MatchDay,
//                   MatchTime: line.MatchTime,
//                   Week: line.Week,
//                   DateNumb: line.DateNumb,
//                   WeekNumb: line.WeekNumb,
//                   matchup: line.AwayAbbrev + ' @ ' + line.HomeAbbrev,
//                   finalPayout: 0
//                 });
//
//                 template.save(function(err, template){
//                   if (err) {console.log(err)}
//
//                   console.log(template + 'has been saved as a template!')
//                 })
//               }
//             })
//           })
//         })
//       })
//     })
//     console.log("auto-templating complete")
//   }
// }
