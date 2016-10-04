angular
  .module('battleBookies')
  .controller('StandingsController', ['picksService', 'oddsService', 'usersService', '$scope', '$timeout', StandingsController])

function StandingsController (picksService, oddsService, usersService, $scope, $timeout) {
  var vm = this;
  vm.getDates = getDates;
  vm.getDateNumbs = getDateNumbs;
  vm.weeksOfGames = [];
  vm.dateNumbs = [];
  vm.dayArrayLength;
  vm.pageArray = [1];
  vm.activePage = 1;
  vm.pageView;
  vm.sortOrder = "-totalDollars";
  vm.users = [];
  vm.user = {};
  vm.dailyStats = [];
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
      vm.showSpinner = false;
    })

  // $timeout(function(){
  //   vm.showSpinner = false
  // }, 6000)

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  }

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.getWeeklyStats(username).then(function(result){
      user.dailyStats = result.data;
      console.log('user daily stats are', user.dailyStats)
    })
  }

  vm.pageClick = function (i) {
    vm.activePage = i;
    vm.standingsView();
  }

  vm.standingsView = function () {
    vm.pageView = 4*(vm.activePage -1)
  }

  vm.pageUp = function() {
    vm.activePage += 1;
    vm.standingsView();
  }

  vm.pageDown = function() {
    vm.activePage -= 1;
    vm.standingsView();
  }

  function getDates () {
    vm.showSpinner = true;
    oddsService.getDates().then(function(dates){
      var weekNumbers = [];
      for (i=0; i<dates.length; i++) {
        var weekNumber = parseInt(dates[i].substring(5));
        weekNumbers.push(weekNumber)
      }
      weekNumbers.sort();
      for (i=0; i<weekNumbers.length; i++) {
        var newWeek = "Week " + weekNumbers[i];
        vm.weeksOfGames.push(newWeek)
      }
    }).then(function(){
      getPageArray(vm.weeksOfGames)
    })
  };

  function getDateNumbs () {
    oddsService.getDateNumbs().then(function(dates){
      console.log("datenumbs are: " + dates);
      vm.dateNumbs = dates;
    })
  };

  function getPageArray (games) {
    var pageArray = [1];
    for (i = 1; i<games.length; i++) {
      if ((i % 4) === 0) {
        pageArray.push((i/4)+1)
      }
    }
    vm.pageArray = pageArray;
  }
}
