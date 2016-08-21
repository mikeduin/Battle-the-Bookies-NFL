angular
  .module('battleBookies')
  .controller('PickController', ['oddsService', 'picksService', 'resultsService', 'authService', PickController])

function PickController (oddsService, picksService, resultsService, authService) {
  var vm = this;
  vm.currentUser = currentUser;
  vm.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  vm.gameWeekFilter;
  vm.pick = {};
  vm.nflLines = [];
  vm.nflResults = [];
  vm.weeksOfGames = [];
  vm.pick.activeGame = {};
  vm.pick.activePick = {};
  vm.pick.activeLine = {};
  vm.pick.activePayout = {};
  vm.pick.favType = {};
  vm.pick.username = vm.currentUser();
  vm.sortOrder = "MatchTime";
  vm.getNflLines = getNflLines;
  vm.getNflResults = getNflResults;
  vm.getDates = getDates;
  vm.getResult = getResult;
  vm.updateOdds = updateOdds;
  vm.updateResults = updateResults;
  vm.submitPick = submitPick;
  vm.timeCheck = timeCheck;
  vm.awaySpread = awaySpread;
  vm.homeSpread = homeSpread;
  vm.awayML = awayML;
  vm.homeML = homeML;
  vm.totalOver = totalOver;
  vm.totalUnder = totalUnder;
  vm.checkSubmission = checkSubmission;
  vm.displayPayCalc = displayPayCalc;
  vm.activePayCalc = activePayCalc;
  vm.mlFormat = mlFormat;

  vm.checkGametimes = function() {
    picksService.checkGametimes().then(function(result){
      return result
    })
  }

  function currentUser() {
    return authService.currentUser();
  }

  function getNflLines() {
    oddsService.getNflLines().then(function(lines){
      vm.nflLines = lines;
    })
  };

  function getNflResults() {
    resultsService.getNflResults().then(function(results){
      vm.nflResults = results;
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.weeksOfGames = dates;
      var dateArray = vm.weeksOfGames;
      var lastWeek = dateArray[dateArray.length - 1];
      var currentWeek = oddsService.weekSetter(moment().format());
      vm.gameWeekFilter = currentWeek;
    })
  };

  function getResult (game) {
    resultsService.getResult(game.EventID).then(function(result){
      game.HomeScore = result[0].HomeScore;
      game.AwayScore = result[0].AwayScore;
      game.status;
      function checkStatus (result) {
        if(result.Final === true) {
          game.status = "In Progress"
        } else {
          game.status = "Final"}
        };
      checkStatus(result);
    })
  }

  function updateOdds () {
    oddsService.updateOdds().then(function(){
      console.log("odds updated")
      vm.pick.activeGame = {};
    })
  };

  function updateResults () {
    resultsService.updateResults().then(function(){
      console.log("results updated")
    })
  };

  function submitPick () {
    picksService.submitPick(vm.pick).then(function(){
      console.log('pick submitted!');
      vm.pick.activeGame = {};
    }, function(){
      console.log('pick failed to submit!');
      vm.pick.activeGame = {};
    });
  };

  function timeCheck (game) {
    if(moment(game.MatchTime).isBefore(moment())) {
      game.locked = true;
      console.log('hello');
    }
  }

  function awaySpread (game) {
    vm.pick.favType;
    if (game.PointSpreadAway > 0) {
      vm.pick.favType = "Underdog"
    } else if (game.PointSpreadAway < 0) {
      vm.pick.favType = "Favorite"
    } else {
      vm.pick.favType = "Neither"
    }
    vm.pick.activeGame = game.EventID;
    vm.pick.activeSpread = game.PointSpreadAway;
    vm.pick.activeLine = game.PointSpreadAwayLine;
    vm.pick.activePick = (game.AwayAbbrev + ' ' +      vm.mlFormat(game.PointSpreadAway));
    vm.pick.activePayout = vm.activePayCalc(game.PointSpreadAwayLine);
    vm.pick.pickType = "Away Spread";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.PointSpreadAwayLine);
  }

  function homeSpread (game) {
    vm.pick.favType;
    if (game.PointSpreadHome > 0) {
      vm.pick.favType = "Underdog"
    } else if (game.PointSpreadHome < 0) {
      vm.pick.favType = "Favorite"
    } else {
      vm.pick.favType = "Neither"
    }
    vm.pick.activeGame = game.EventID;
    vm.pick.activeSpread = game.PointSpreadHome;
    vm.pick.activeLine = game.PointSpreadHomeLine;
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.mlFormat(game.PointSpreadHome));
    vm.pick.activePayout = vm.activePayCalc(game.PointSpreadHomeLine);
    vm.pick.pickType = "Home Spread";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.PointSpreadHomeLine);
  }

  function awayML (game) {
    vm.pick.favType;
    if (game.MoneyLineAway > game.MoneyLineHome) {
      vm.pick.favType = "Underdog"
    } else if (game.MoneyLineAway < game.MoneyLineHome) {
      vm.pick.favType = "Favorite"
    } else {
      vm.pick.favType = "Neither"
    }
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.MoneyLineAway;
    vm.pick.activePick = (game.AwayAbbrev + ' ' + vm.mlFormat(game.MoneyLineAway));
    vm.pick.activePayout = vm.activePayCalc(game.MoneyLineAway);
    vm.pick.pickType = "Away Moneyline";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.MoneyLineAway);
  }

  function homeML (game) {
    vm.pick.favType;
    if (game.MoneyLineHome > game.MoneyLineAway) {
      vm.pick.favType = "Underdog"
    } else if (game.MoneyLineHome < game.MoneyLineAway) {
      vm.pick.favType = "Favorite"
    } else {
      vm.pick.favType = "Neither"
    }
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.MoneyLineHome;
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.mlFormat(game.MoneyLineHome));
    vm.pick.activePayout = vm.activePayCalc(game.MoneyLineHome);
    vm.pick.pickType = "Home Moneyline";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.MoneyLineHome);
  }

  function totalOver (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeTotal = game.TotalNumber;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' O' + game.TotalNumber);
    vm.pick.activeLine = game.OverLine;
    vm.pick.activePayout = vm.activePayCalc(game.OverLine);
    vm.pick.pickType = "Total Over";
    vm.pick.favType = "Neither";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.OverLine);
  }

  function totalUnder (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeTotal = game.TotalNumber;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' U' + game.TotalNumber);
    vm.pick.activeLine = game.UnderLine;
    vm.pick.activePayout = vm.activePayCalc(game.UnderLine);
    vm.pick.pickType = "Total Under";
    vm.pick.favType = "Neither";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.UnderLine);
  }

  function checkSubmission (game) {
    picksService.checkSubmission(game).then(function(foundPick){
      if(!foundPick[0]) {
        console.log('following pick is not found, should be added as template');
        console.log(game);
        picksService.addTemplate(game);
      } else {
        if(foundPick[0].activePick) {
          game.locked = true;
          game.pick = foundPick[0].activePick;
          game.displayPayout = displayPayCalc(foundPick[0].activePayout);
        } else {
          console.log('pick not found')
        }
      }
    })
  }

  vm.checkTemplates = function(){
    picksService.checkTemplates().then(function(result){
      console.log(result)
    })
  }

  function displayPayCalc (line) {
    var payout;
    if (line < 0) {
      payout = "$"+((10000 / -line).toFixed(2))
    } else {
      payout = "$"+(line).toFixed(2)
    };
    return payout
  };

  function activePayCalc (line) {
    var payout;
    if (line < 0) {
      payout = (10000 / -line)
    } else {
      payout = line
    };
    return payout
  };

  function mlFormat (ml) {
    if (ml < 0) {
      return ml
    } else {
      return "+" + ml
    }
  }
}
