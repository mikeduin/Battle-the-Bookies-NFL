angular
  .module('battleBookies')
  .controller('StandingsController', ['picksService', 'oddsService', 'usersService', '$scope', '$timeout', StandingsController])

function StandingsController (picksService, oddsService, usersService, $scope, $timeout) {
  var vm = this;
  vm.getDates = getDates;
  vm.weeksOfGames = [];
  vm.dayArrayLength;
  vm.pageArray = [1];
  vm.activePage = 1;
  vm.pageView;
  vm.sortOrder = "-sumYtd";
  vm.users = [];
  vm.user = {};
  vm.showStandings = false;
  vm.dailyStats = [];
  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
    vm.showSpinner = false;
  })

  function sortNumber(a, b) {
    return a - b
  };

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  };

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.sumAllPicks(username).then(function(result){
      user.sumYtd = result.totalDollars;
      user.ytdW = result.totalW;
      user.ytdL = result.totalG - result.totalW;
      user.ytdPct = result.totalW / result.totalG;
      if (user.plan === "noPlan") {
        user.plan = "";
      } else if (user.plan === "dogSpreads") {
        user.plan = "Underdog ATS"
      } else if (user.plan === "homeSpreads") {
        user.plan = "Home ATS"
      } else if (user.plan === "roadSpreads") {
        user.plan = "Road ATS"
      } else if (user.plan === "favMLs") {
        user.plan = "Favorite ML"
      }
    }).then(function(){
      username = user.username;
      picksService.getWeeklyStats(username).then(function(result){
        user.dailyStats = result.data;
        vm.showStandings = true;
      })
    })
  };

  vm.pageClick = function (i) {
    vm.activePage = i;
    vm.standingsView();
  };

  vm.standingsView = function () {
    vm.pageView = 4*(vm.activePage -1)
  };

  vm.pageUp = function() {
    vm.activePage += 1;
    vm.standingsView();
  };

  vm.pageDown = function() {
    vm.activePage -= 1;
    vm.standingsView();
  };

  function getDates () {
    vm.showSpinner = true;
    oddsService.getDates().then(function(dates){
      vm.dayArrayLength = dates.length;
      vm.weeksOfGames = dates;
      getPageArray(dates)
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
