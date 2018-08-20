angular
  .module('battleBookies')
  .controller('capperController', ['picksService', 'oddsService', 'usersService', '$scope', '$state', '$location', '$anchorScroll', '$stateParams', capperController])

function capperController (picksService, oddsService, usersService, $scope, $state, $location, $anchorScroll, $stateParams) {
  var vm = this;
  getSeasons();
  vm.getDates = getDates;
  vm.getCapperGrades = getCapperGrades;
  vm.getAllUsers = getAllUsers;
  vm.sortOrder = "-totalCapperScore";
  vm.tutRedirect = tutRedirect;
  vm.season = $stateParams.season;

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
    vm.showSpinner = false;
  })

  function getAllUsers (){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  };

  vm.seasonChange = function(){
    $state.go('home.capper-grades', {season: vm.season});
  };

  function getDates (season) {
    vm.showSpinner = true;
    oddsService.getDates(season).then(function(dates){
      vm.dayArrayLength = dates.length;
      vm.weeksOfGames = dates;
      vm.weekNumbs = [];
      for (var i=0; i<vm.weeksOfGames.length; i++){
        vm.weekNumbs.push(parseInt(vm.weeksOfGames[i].substring(5)))
      };
      // getPageArray(dates)
    })
  };

  function getSeasons () {
    oddsService.getSeasons().then(function(seasons){
      vm.seasons = seasons;
    })
  }

  function getCapperGrades (user, season) {
    username = user.username;
    picksService.sumSeasonPicks(username, season).then(function(result){
      user.sumYtd = result.totalDollars;
      user.ytdW = result.totalW;
      user.ytdL = result.totalG - result.totalW;
      user.ytdPct = result.totalW / result.totalG;
    }).then(function(){
      username = user.username;
      picksService.getWeeklyStats(username, season).then(function(result){
        user.capperGrades = result.data;
        user.totalCapperScore = 0;
        for (var i=0; i<user.capperGrades.length; i++) {
          user.totalCapperScore += user.capperGrades[i].avgCapperGrade
        };
        vm.showStandings = true;
      })
    })
  }

  function tutRedirect () {
    $state.go('home.tutorial').then(function(){
      $location.hash('capperGrades');
      $anchorScroll.yOffset = 50;
      $anchorScroll();
    })
  }

}
