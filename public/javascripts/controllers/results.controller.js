angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', '$scope', '$timeout', '$stateParams', '$state', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, $scope, $timeout, $stateParams, $state) {

  console.log($state);

  $scope.uiRouterState = $state;
  var vm = this;
  vm.gameWeekFilter;
  vm.dateNumbFilter;
  vm.weekNumbFilter;
  vm.weekNumb;
  vm.week;
  vm.weeksOfGames = [];
  vm.nflLines = [];
  $scope.nflLines={};
  vm.getNflLines = getNflLines;
  vm.getWeeklyNflLines = getWeeklyNflLines;
  vm.updatePicks = updatePicks;
  vm.gameSort = "MatchTime";
  vm.gameSortTwo = "EventID";
  vm.userSort = "-totalDollars";
  vm.updateResults = updateResults;
  vm.getPicks = getPicks;
  vm.getWeeklyPicks = getWeeklyPicks;
  // vm.getDates = getDates;
  vm.picks = [];
  vm.users = [];

  // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
  //   vm.showSpinner = false;
  // })
  $timeout(function(){
    vm.showSpinner = false
  }, 6000)

  console.log('$stateParams are', $stateParams.weekNumb);

  vm.checkWeekNumb = function(){
    vm.weekNumb = $stateParams.weekNumb;
    vm.week = parseInt(vm.weekNumb);
  };
  vm.checkWeekNumb();

  vm.checkTime = function(gametime) {
    if (moment(gametime).isBefore(vm.currentTime)){
      return true
    } else {
      return false
    }
  }

  vm.currentTime = moment().format();

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  };

  vm.updateDollars = function(){
    picksService.updateDollars().then(function(){
      console.log('res controller says update dollars')
    })
  }

  function getNflLines (){
    vm.showSpinner = true;
    oddsService.getNflLines().then(function(games){
      vm.nflLines = games;
    })
  }

  function getWeeklyNflLines(){
    vm.showSpinner = true;
    oddsService.getWeeklyNflLines($stateParams.weekNumb).then(function(games){
      vm.nflLines = games;
      console.log('nfl lines are', vm.nflLines);
      for (i=0; i<vm.nflLines.length; i++){
        // var nflLine = vm.nflLines[i].AwayAbbrev + 'v' + vm.nflLines[i].HomeAbbrev;
        // $scope[nflLine] = vm.nflLines[i];
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
  }

  function updatePicks() {
    picksService.updatePicks();
  }

  function updateResults () {
    resultsService.updateResults().then(function(){
    })
  };

  function getPicks () {
    oddsService.getPicks().then(function(data){
      vm.picks = data;
    })
  }

  function getWeeklyPicks () {
    oddsService.getWeeklyPicks($stateParams.weekNumb).then(function(data){
      vm.picks = data;
    })
  }

  // function getDates () {
  //   oddsService.getDates().then(function(dates){
  //     vm.weeksOfGames = dates;
  //     var dateArray = vm.weeksOfGames;
  //     var lastWeek = dateArray[dateArray.length - 1];
  //     if (currentWeek === "Preseason") {
  //       vm.gameWeekFilter = "Week 1";
  //       vm.weekNumbFilter = "01";
  //     } else if (
  //       currentWeek === "Postseason"
  //     ) {
  //       vm.gameWeekFilter = "Week 17";
  //       vm.weekNumbFilter - "17";
  //     } else {
  //       vm.gameWeekFilter = currentWeek;
  //       vm.weekNumbFilter = currentWeekNumb;
  //     }
  //     console.log('current weekNumb is', vm.weekNumbFilter);
  //   })
  // };

}
