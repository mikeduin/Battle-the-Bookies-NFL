angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', '$scope', '$timeout', '$stateParams', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, $scope, $timeout, $stateParams) {

  var vm = this;
  vm.gameWeekFilter;
  vm.dateNumbFilter;
  vm.weekNumbFilter;
  vm.weekNumb;
  vm.weeksOfGames = [];
  vm.nflLines = [];
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
    vm.weekNumb = $stateParams.weekNumb
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
