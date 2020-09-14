angular
  .module('battleBookies')
  .controller('StandingsController', ['picksService', 'oddsService', 'usersService', 'dateService', 'authService', '$scope', '$timeout', '$stateParams', '$state', StandingsController])

function StandingsController (picksService, oddsService, usersService, dateService, authService, $scope, $timeout, $stateParams, $state) {
  var vm = this;
  vm.getDates = getDates;
  vm.seasons = dateService.fetchSeasons();
  vm.weeksOfGames = [];
  vm.dayArrayLength;
  vm.pageArray = [1];
  vm.activePage = 1;
  vm.pageView;
  vm.sortOrder = "-ytd_dollars";
  vm.users = [];
  vm.user = {};
  vm.dailyStats = [];
  vm.season = $stateParams.season;
  vm.activeUser;
  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
    vm.showSpinner = false;
  })

  const plans = {
    "noPlan": "",
    "dogSpreads": "Underdog ATS",
    "homeSpreads": "Home ATS",
    "roadSpreads": "Road ATS",
    "favMLs": "Favorite ML"
  }

  function sortNumber(a, b) {
    return a - b
  };

  vm.getSeasonUsers = function(season){
    usersService.getSeasonUsers(season).then(function(users){
      for (var i = 0; i < users.length; i++) {
        users[i].plan = plans[users[i].plan];
      };
      vm.users = users;
    })
  }

  async function getActiveUser() {
    const user = await authService.currentUser();
    vm.activeUser = user;
  }
  getActiveUser();

  vm.seasonChange = function(){
    vm.getSeasonUsers(vm.season);
    $state.go('home.standings', {season: vm.season});
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

  function getDates (season) {
    vm.showSpinner = true;
    oddsService.getDates(season).then(function(dates){
      vm.dayArrayLength = dates.length;
      vm.weeksOfGames = dates;
      getPageArray(dates);
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
