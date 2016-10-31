angular
  .module('battleBookies')
  .controller('NavController', ['authService', 'oddsService', '$state', NavController])

function NavController (authService, oddsService, $state) {
  var vm = this;

  function sortNumber(a, b) {
    return a - b
  };

  vm.getDates = function () {
    oddsService.getDates().then(function(dates){
      var weekNumbers = [];
      for (i=0; i<dates.length; i++) {
        var weekNumber = parseInt(dates[i].substring(5));
        weekNumbers.push(weekNumber)
      }
      weekNumbers.sort(sortNumber).reverse();
      vm.weeksOfGames = [];
      for (i=0; i<weekNumbers.length; i++) {
        var newWeek = "Week " + weekNumbers[i];
        vm.weeksOfGames.push(newWeek)
      }
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
