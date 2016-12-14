angular
  .module('battleBookies')
  .controller('capperController', ['picksService', 'oddsService', 'usersService', capperController])

function capperController (picksService, oddsService, usersService) {
  var vm = this;

  vm.getDates = getDates;
  vm.getCapperGrades = getCapperGrades;

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  };

  function getDates () {
    vm.showSpinner = true;
    oddsService.getDates().then(function(dates){
      vm.dayArrayLength = dates.length;
      vm.weeksOfGames = dates;
      vm.weekNumbs = [];
      for (var i=0; i<vm.weeksOfGames.length; i++){
        vm.weekNumbs.push(parseInt(vm.weeksOfGames[i].substring(5)))
      };
      // getPageArray(dates)
    })
  };

  function getCapperGrades (user) {
    username = user.username;
    picksService.sumAllPicks(username).then(function(result){
      user.sumYtd = result.totalDollars;
      user.ytdW = result.totalW;
      user.ytdL = result.totalG - result.totalW;
      user.ytdPct = result.totalW / result.totalG;
    }).then(function(){
      picksService.getWeeklyStats(username).then(function(result){
        user.capperGrades = result.data;
      })
    })
  }

}
