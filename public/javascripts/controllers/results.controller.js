angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', '$scope', '$timeout', '$stateParams', '$state', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, $scope, $timeout, $stateParams, $state) {

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
  }, 6000);

  vm.weekValues = [
    {"value": "-w1dollars", "text": "Week 1 $", "weekNumb": "01"},
    {"value": "-w2dollars", "text": "Week 2 $", "weekNumb": "02"},
    {"value": "-w3dollars", "text": "Week 3 $", "weekNumb": "03"},
    {"value": "-w4dollars", "text": "Week 4 $", "weekNumb": "04"},
    {"value": "-w5dollars", "text": "Week 5 $", "weekNumb": "05"},
    {"value": "-w6dollars", "text": "Week 6 $", "weekNumb": "06"},
    {"value": "-w7dollars", "text": "Week 7 $", "weekNumb": "07"},
    {"value": "-w8dollars", "text": "Week 8 $", "weekNumb": "08"},
    {"value": "-w9dollars", "text": "Week 9 $", "weekNumb": "09"},
    {"value": "-w10dollars", "text": "Week 10 $", "weekNumb": "10"},
    {"value": "-w11dollars", "text": "Week 11 $", "weekNumb": "11"},
    {"value": "-w12dollars", "text": "Week 12 $", "weekNumb": "12"},
    {"value": "-w13dollars", "text": "Week 13 $", "weekNumb": "13"},
    {"value": "-w14dollars", "text": "Week 14 $", "weekNumb": "14"},
    {"value": "-w15dollars", "text": "Week 15 $", "weekNumb": "15"},
    {"value": "-w16dollars", "text": "Week 16 $", "weekNumb": "16"},
    {"value": "-w17dollars", "text": "Week 17 $", "weekNumb": "17"},
  ]

  vm.checkWeekNumb = function(){
    vm.weekNumb = $stateParams.weekNumb;
    vm.week = parseInt(vm.weekNumb);
    console.log('weeknumb is', vm.weekNumb);
    console.log('vm.userSort is ', vm.userSort)
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
      vm.users = result;
      console.log(vm.users);
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
