angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', 'dateService', '$scope', '$timeout', '$stateParams', '$state', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, dateService, $scope, $timeout, $stateParams, $state) {

  $scope.uiRouterState = $state;
  var vm = this;
  vm.seasons = dateService.fetchSeasons();
  vm.season = $stateParams.season;
  vm.weekNumb;
  vm.week;
  vm.nflLines = [];
  vm.lastWeekNumb;
  $scope.nflLines= {};
  vm.getWeeklyNflLines = getWeeklyNflLines;
  vm.gameSort = "MatchTime";
  vm.gameSortTwo = "EventID";
  vm.userSort = "-sumYtd";
  vm.updateResults = updateResults;
  vm.getWeeklyPicks = getWeeklyPicks;
  vm.getDates = getDates;
  vm.showResults = false;
  vm.picks = [];
  vm.users = [];

  $timeout(function(){
    vm.showSpinner = false
  }, 6000);

  function sortNumber(a, b) {
    return a - b
  };

  vm.weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  vm.currentTime = moment().format();

  vm.chartDisplay = function(gametime){
    if (moment(gametime).add(10, 'm').isBefore(vm.currentTime)){
      return true
    } else {
      return false
    }
  };

  vm.seasonChange = function(){
    $state.go('home.results.picks', {
      season: vm.season,
      weekNumb: $stateParams.weekNumb
    });
  };

  vm.weekConfig = function(week){
    return week.toString();
  }

  vm.checkTime = function(gametime) {
    if (moment(gametime).isBefore(vm.currentTime)){
      return true
    } else {
      return false
    }
  }

  // vm.getAllUsers = function(){
  //   usersService.getAllUsers().then(function(result){
  //     vm.users = result;
  //   })
  // };

  vm.getSeasonUsers = function(season){
    console.log('season is ', season);
    usersService.getSeasonUsers(season).then(function(result){
      vm.users = result;
    })
  }

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.sumSeasonPicks(username, vm.season).then(function(result){
      return result.totalDollars
    }).then(function(totalDollars){
      username = user.username;
      picksService.sumWeek(username, $stateParams.season, $stateParams.weekNumb).then(function(weeklyDollars){
        vm.showResults = true;
        username = user.username;
        user.sumYtd = totalDollars;
        user.weeklyDollars = weeklyDollars;
      })
    })
  };

  // vm.sumAllPicks = function(user) {
  //   username = user.username;
  //   picksService.sumAllPicks(username).then(function(result){
  //     return result.totalDollars
  //   }).then(function(totalDollars){
  //     username = user.username;
  //     picksService.sumWeek(username, $stateParams.weekNumb).then(function(weeklyDollars){
  //       vm.showResults = true;
  //       username = user.username;
  //       user.sumYtd = totalDollars;
  //       user.weeklyDollars = weeklyDollars;
  //     })
  //   })
  // };

  function updateResults () {
    resultsService.updateResults().then(function(){
    })
  };

  function getWeeklyPicks () {
    vm.weekNumb = $stateParams.weekNumb;
    if (vm.weekNumb < 10 ) {
      vm.weekNumb = '0' + vm.weekNumb;
    };
    vm.week = parseInt(vm.weekNumb);
    oddsService.getWeeklyPicks(vm.season, vm.weekNumb).then(function(data){
      vm.picks = data;
    })
  }

  function getDates () {
    oddsService.getDates(vm.season).then(function(dates){
      var weekNumbers = [];
      for (i=0; i<dates.length; i++) {
        var weekNumber = parseInt(dates[i].substring(5));
        weekNumbers.push(weekNumber)
      }
      weekNumbers.sort(sortNumber);
      vm.lastWeekNumb = weekNumbers[weekNumbers.length-1]
    })
  };

  function getWeeklyNflLines(){
    vm.showSpinner = true;
    oddsService.getWeeklyNflLines(vm.season, $stateParams.weekNumb).then(function(games){
      vm.nflLines = games;
      for (i=0; i<vm.nflLines.length; i++){
        vm.nflLines[i].homeColor = "#B68708";
        $scope.nflLines[vm.nflLines[i].AwayAbbrev] =
          {
            "globals": {
              "font-family" : "Raleway"
            },
            "type": "hbar",
            "plotarea": {
              "adjust-layout":true
            },
            "scaleX": {
              "label":{ /* Scale Title */
              },
              "labels":[] /* Scale Labels */
            },
            "scaleY": {
              "label":{ /* Scale Title */
                "text":"Total Pool Selections",
              },
              "values": "0:40:5",
              "labels":[] /* Scale Labels */
            },
            "tooltip": {
              "text": "<b>%kl</b><br>%v Picks",
              "shadow": false,
              "font-color": "#e5ebeb",
              "border-color": "#ffffff",
              "border-width": "2px",
              "border-radius": "10px",
              "padding": "8px 15px"
            },
            "series": [
              {"values": [],
              "value-box": {
                        "placement":"top-out",
                        "text":"%v Picks",
                        "decimals":0,
                        "font-color":"#5E5E5E",
                        "font-size":"14px",
                        "alpha":0.6
                    },
                "animation": {
                    "delay": 100,
                    "effect": "ANIMATION_EXPAND_BOTTOM",
                    "speed": "1600",
                    "method": "0",
                    "sequence": "1"
                },
                "rules":[ ]
              }
              ]
          }
          $scope.nflLines[vm.nflLines[i].AwayAbbrev].scaleX.labels.push(vm.nflLines[i].AwayAbbrev + '/' + vm.nflLines[i].HomeAbbrev + ' Under', vm.nflLines[i].AwayAbbrev + '/' + vm.nflLines[i].HomeAbbrev + ' Over', vm.nflLines[i].HomeAbbrev + ' ML', vm.nflLines[i].AwayAbbrev + ' ML', vm.nflLines[i].HomeAbbrev + ' Spread', vm.nflLines[i].AwayAbbrev + ' Spread');

          $scope.nflLines[vm.nflLines[i].AwayAbbrev].series[0].values.push(vm.nflLines[i].UnderPicks, vm.nflLines[i].OverPicks, vm.nflLines[i].MLHomePicks, vm.nflLines[i].MLAwayPicks, vm.nflLines[i].SpreadHomePicks, vm.nflLines[i].SpreadAwayPicks);

          $scope.nflLines[vm.nflLines[i].AwayAbbrev].series[0].rules.push(
            {
                "rule":"%i==0",
                "background-color": "#838383"
            },
            {
                "rule":"%i==1",
                "background-color": "#2D2D2D"
            },
            {
                "rule":"%i==2",
                "background-color": vm.nflLines[i].HomeColor
            },
            {
                "rule":"%i==3",
                "background-color": vm.nflLines[i].AwayColor
            },
            {
                "rule":"%i==4",
                "background-color": vm.nflLines[i].HomeColor
            },
            {
                "rule":"%i==5",
                "background-color": vm.nflLines[i].AwayColor
            }
          )
      }
    })
  };

  vm.weeklyToggle = function() {
    if (vm.userSort !== '-weeklyDollars') {
      vm.userSort = '-weeklyDollars'
    } else {
      vm.userSort = 'weeklyDollars'
    }
  };

  vm.ytdToggle = function() {
    if (vm.userSort !== '-sumYtd') {
      vm.userSort = '-sumYtd'
    } else {
      vm.userSort = 'sumYtd'
    }
  };

  vm.userToggle = function() {
    if (vm.userSort !== 'username') {
      vm.userSort = 'username'
    } else {
      vm.userSort = '-username'
    }
  };


}
