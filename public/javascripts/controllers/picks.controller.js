angular
  .module('battleBookies')
  .controller('PickController', ['oddsService', 'picksService', 'resultsService', 'authService', '$scope', '$state', '$stateParams', PickController])

function PickController (oddsService, picksService, resultsService, authService, $scope, $state, $stateParams) {
  var vm = this;
  getSeasons();
  vm.season = $stateParams.season;
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
  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
    vm.showSpinner = false;
  });
  Array.max = function(array){
    return Math.max.apply(Math, array)
  };

  var now = moment();

  function sortNumber(a, b) {
    return a - b
  };

  function getSeasons () {
    oddsService.getSeasons().then(function(seasons){
      vm.seasons = seasons;
    })
  };

  vm.seasonChange = function(){
    $state.go('home.makepicks', {season: vm.season});
  };

  vm.checkDisplay = function(game){
    var week = parseInt(vm.gameWeekFilter.substring(4));

    if (moment(game.MatchTime).isBefore(now)) {
      return true
    } else {
      return false
    }
  };

  vm.checkGametimes = function() {
    picksService.checkGametimes().then(function(result){
      return result
    })
  }

  function currentUser() {
    return authService.currentUser();
  }

  function getNflLines(season) {
    vm.showSpinner = true;
    oddsService.getNflLines(season).then(function(lines){
      vm.nflLines = lines;
    })
  };

  function getNflResults() {
    resultsService.getNflResults().then(function(results){
      vm.nflResults = results;
    })
  }

  function getDates () {
    // hide triple-week funcionality below in offseason
    // var week = vm.weekSetter(moment());
    // var week2 = vm.weekSetter(moment().add(1, 'w'));
    // var week3 = vm.weekSetter(moment().subtract(1, 'w'));
    // vm.weeksOfGames = [week3, week, week2];
    oddsService.getDates(vm.season).then(function(dates){
       var weekNumbers = [];
       for (i=0; i<dates.length; i++) {
         var weekNumber = parseInt(dates[i].substring(5));
         weekNumbers.push(weekNumber)
       };
       weekNumbers.sort(sortNumber);
       for (i=0; i<weekNumbers.length; i++) {
         var newWeek = "Week " + weekNumbers[i];
         vm.weeksOfGames.push(newWeek)
       };
      var currentWeek = vm.weekSetter(moment().format());
      // console.log('currentWeek is ', currentWeek);
      if (currentWeek === "Preseason") {
        vm.gameWeekFilter = "Week 1"
      } else if (
        currentWeek === "Postseason"
      ) {
        vm.gameWeekFilter = "Week 17"
      } else {
        vm.gameWeekFilter = currentWeek
      };
    });
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
      vm.pick.activeGame = {};
    })
  };

  function updateResults () {
    resultsService.updateResults().then(function(){
      console.log("results updated")
    })
  };

  function submitPick () {
    if (vm.pick.username === undefined) {
      Materialize.toast('YOUR PICK WAS NOT SAVED; you are not logged in. If you believe this is an error, please log out and login again.', 7000, 'rounded');
    };
    picksService.submitPick(vm.pick).then(function(){
      vm.pick.activeGame = {};
    }, function(){
      vm.pick.activeGame = {};
    });
  };

  function timeCheck (game) {
    if(moment(game.MatchTime).isBefore(moment())) {
      game.locked = true;
    }
  }

  function awaySpread (game) {
    vm.pick.favType;
    vm.pick.betType;
    vm.pick.geoType;
    if (game.PointSpreadAway > 0) {
      vm.pick.favType = "Underdog";
      vm.pick.geoType = "Away Dog";
      vm.pick.betType = "Dog Spread";
    } else if (game.PointSpreadAway < 0) {
      vm.pick.favType = "Favorite";
      vm.pick.geoType = "Away Fav";
      vm.pick.betType = "Fav Spread";
    } else {
      vm.pick.favType = "Neither";
      vm.pick.geoType = "Away +0";
      vm.pick.betType = "Spread +0"
    };

    vm.pick.activeGame = game.EventID;
    vm.pick.activeSpread = game.PointSpreadAway;
    vm.pick.activeLine = game.PointSpreadAwayLine;
    vm.pick.activePick = (game.AwayAbbrev + ' ' + vm.mlFormat(game.PointSpreadAway));
    vm.pick.activePayout = vm.activePayCalc(game.PointSpreadAwayLine);
    vm.pick.pickType = "Away Spread";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.PointSpreadAwayLine);
  }

  function homeSpread (game) {
    vm.pick.favType;
    vm.pick.betType;
    vm.pick.geoType;
    if (game.PointSpreadHome > 0) {
      vm.pick.favType = "Underdog";
      vm.pick.geoType = "Home Dog";
      vm.pick.betType = "Dog Spread";
    } else if (game.PointSpreadHome < 0) {
      vm.pick.favType = "Favorite";
      vm.pick.geoType = "Home Fav";
      vm.pick.betType = "Fav Spread";
    } else {
      vm.pick.favType = "Neither";
      vm.pick.geoType = "Home +0";
      vm.pick.betType = "Spread +0";
    };
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
    vm.pick.betType;
    vm.pick.geoType;
    if (game.MoneyLineAway > game.MoneyLineHome) {
      vm.pick.favType = "Underdog";
      vm.pick.geoType = "Away Dog";
      vm.pick.betType = "Dog ML";
    } else if (game.MoneyLineAway < game.MoneyLineHome) {
      vm.pick.favType = "Favorite";
      vm.pick.geoType = "Away Fav";
      vm.pick.betType = "Fav ML";
    } else {
      vm.pick.favType = "Neither";
      vm.pick.geoType = "Away EV";
      vm.pick.betType = "ML EV"
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
    vm.pick.betType;
    vm.pick.geoType;
    if (game.MoneyLineHome > game.MoneyLineAway) {
      vm.pick.favType = "Underdog";
      vm.pick.geoType = "Home Dog";
      vm.pick.betType = "Dog ML";
    } else if (game.MoneyLineHome < game.MoneyLineAway) {
      vm.pick.favType = "Favorite";
      vm.pick.geoType = "Home Fav";
      vm.pick.betType = "Fav ML";
    } else {
      vm.pick.favType = "Neither";
      vm.pick.geoType = "Home EV";
      vm.pick.betType = "ML EV";
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
    vm.pick.betType = "Total Over";
    vm.pick.geoType = "Total Over";
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
    vm.pick.betType = "Total Under";
    vm.pick.geoType = "Total Under";
    vm.pick.favType = "Neither";
    vm.pick.MatchDay = game.MatchDay;
    vm.pick.MatchTime = game.MatchTime;
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.UnderLine);
  }

  function checkSubmission (game) {
    picksService.checkSubmission(game).then(function(foundPick){
      if(!foundPick[0]) {
        picksService.addTemplate(game);
      } else {
        if(foundPick[0].activePick) {
          game.locked = true;
          game.pick = foundPick[0].activePick;
          game.displayPayout = displayPayCalc(foundPick[0].activePayout);
        } else {
          return
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
  };

  vm.weekSetter = function(MatchTime) {
    if (moment(MatchTime).isBetween('2018-06-23', '2018-09-01')) {
      return "Preseason"
    } else if (moment(MatchTime).isBetween('2018-09-02', '2018-09-12')) {
      return "Week 1"
    } else if (moment(MatchTime).isBetween('2018-09-12', '2018-09-19')) {
      return "Week 2"
    } else if (moment(MatchTime).isBetween('2018-09-19', '2018-09-26')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2018-09-26', '2018-10-03')) {
      return "Week 4"
    } else if (moment(MatchTime).isBetween('2018-10-03', '2018-10-10')) {
      return "Week 5"
    } else if (moment(MatchTime).isBetween('2018-10-10', '2018-10-17')) {
      return "Week 6"
    } else if (moment(MatchTime).isBetween('2018-10-17', '2018-10-24')) {
      return "Week 7"
    } else if (moment(MatchTime).isBetween('2018-10-24', '2018-10-31')) {
      return "Week 8"
    } else if (moment(MatchTime).isBetween('2018-10-31', '2018-11-07')) {
      return "Week 9"
    } else if (moment(MatchTime).isBetween('2018-11-07', '2018-11-14')) {
      return "Week 10"
    } else if (moment(MatchTime).isBetween('2018-11-14', '2018-11-21')) {
      return "Week 11"
    } else if (moment(MatchTime).isBetween('2018-11-21', '2018-11-28')) {
      return "Week 12"
    } else if (moment(MatchTime).isBetween('2018-11-28', '2018-12-05')) {
      return "Week 13"
    } else if (moment(MatchTime).isBetween('2018-12-05', '2018-12-12')) {
      return "Week 14"
    } else if (moment(MatchTime).isBetween('2018-12-12', '2018-12-19')) {
      return "Week 15"
    } else if (moment(MatchTime).isBetween('2018-12-19', '2018-12-26')) {
      return "Week 16"
    } else if (moment(MatchTime).isBetween('2018-12-26', '2019-01-02')) {
      return "Week 17"
    } else {
      return "Postseason"
    };
  }
}
