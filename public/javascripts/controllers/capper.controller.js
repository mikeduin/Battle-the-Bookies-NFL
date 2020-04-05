angular
  .module('battleBookies')
  .controller('capperController', ['picksService', 'oddsService', 'usersService', 'dateService', '$scope', '$state', '$location', '$anchorScroll', '$stateParams', capperController])

function capperController (picksService, oddsService, usersService, dateService, $scope, $state, $location, $anchorScroll, $stateParams) {
  var vm = this;
  vm.seasons = dateService.fetchSeasons();
  vm.getDates = getDates;
  vm.sortOrder = "-capper_grade";
  vm.tutRedirect = tutRedirect;
  vm.season = $stateParams.season;

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
    vm.showSpinner = false;
  })

  vm.getSeasonUsers = function(season){
    usersService.getSeasonUsers(season).then(function(result){
      vm.users = result;
    })
  }

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
    })
  };

  function tutRedirect () {
    $state.go('home.tutorial').then(function(){
      $location.hash('capperGrades');
      $anchorScroll.yOffset = 50;
      $anchorScroll();
    })
  }

}
