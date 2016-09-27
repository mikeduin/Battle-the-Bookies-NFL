angular
  .module('battleBookies')
  .controller('NavController', ['authService', 'oddsService', '$state', NavController])

function NavController (authService, oddsService, $state) {
  var vm = this;

  vm.getDates = function () {
    oddsService.getDates().then(function(dates){
      vm.weeksOfGames = dates.reverse();
      console.log(vm.weeksOfGames);
      var dateArray = vm.weeksOfGames;
      var lastWeek = dateArray[dateArray.length - 1];
      vm.lastWeekNumb = lastWeek.substring(5);
    })
  };

  vm.weekConfig = function(week){
    var newWeek = week.toString();
    if (newWeek.length === 1) {
      return ("0" + newWeek)
    } else {
      return newWeek;
    }
  }

  vm.isLoggedIn = function(){
    return authService.isLoggedIn();
  }

  vm.logOut = function(){
    authService.logOut()
  }

  vm.currentUser = function(){
    return authService.currentUser();
  }


}
