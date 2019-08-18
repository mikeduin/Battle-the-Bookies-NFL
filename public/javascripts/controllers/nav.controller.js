angular
  .module('battleBookies')
  .controller('NavController', ['authService', 'oddsService', 'dateService', '$state', NavController])

function NavController (authService, oddsService, dateService, $state) {
  Array.max = function(array){
    return Math.max.apply(Math, array)
  };

  var vm = this;

  function sortNumber(a, b) {
    return a - b
  };

  vm.seasons = dateService.fetchSeasons();
  vm.season = Array.max(vm.seasons);
  vm.weekSetter = matchTime => {
    return dateService.weekSetter(matchTime);
  }

  vm.getDates = function (season) {
    oddsService.getDates(season).then(function(dates){
      var currentWeek = vm.weekSetter(moment().format("YYYY-MM-DD"));
      console.log('current week is ', currentWeek);
      vm.currentWeekNumb = parseInt(currentWeek.substring(5));
      // console.log('current weekNumb is ', vm.currentWeekNumb);
      vm.weeksOfGames = dates.reverse();
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
    authService.logOut();
  }

  vm.currentUser = function(){
    return authService.currentUser();
  }
}
