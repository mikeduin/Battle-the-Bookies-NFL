angular
  .module('battleBookies')
  .controller('NavController', ['authService', 'oddsService', '$state', NavController])

function NavController (authService, oddsService, $state) {
  Array.max = function(array){
    return Math.max.apply(Math, array)
  };

  var vm = this;
  getSeasons();

  function sortNumber(a, b) {
    return a - b
  };

  vm.getDates = function (season) {
    oddsService.getDates(season).then(function(dates){
      var currentWeek = vm.weekSetter(moment().format());
      vm.currentWeekNumb = parseInt(currentWeek.substring(5));
      // console.log('current week is ', vm.currentWeekNumb);
      vm.weeksOfGames = dates.reverse();
    })
  };

  function getSeasons () {
    oddsService.getSeasons().then(function(seasons){
      // console.log('seasons are ', seasons);
      vm.seasons = seasons;
      vm.season = Array.max(seasons);
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
    // console.log(authService.currentUser());
    return authService.currentUser();
  }

  vm.weekSetter = function(MatchTime) {
    if (moment(MatchTime).isBetween('2018-06-23', '2018-09-12')) {
      return "Week 1"
    } else if (moment(MatchTime).isBetween('2018-09-12', '2018-09-19')) {
      return "Week 2"
    } else if (moment(MatchTime).isBetween('2018-09-19', '2018-09-26')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2018-09-26', '2018-10-03')) {
      return "Week 4"
    } else if (moment(MatchTime).isBetween('2018-10-03', '2018-10-10')) {
      return "Week 5"
    } else if (moment(MatchTime).isBetween('2018-10-10', '2018-10-17')) {
      return "Week 6"
    } else if (moment(MatchTime).isBetween('2018-10-17', '2018-10-24')) {
      return "Week 7"
    } else if (moment(MatchTime).isBetween('2018-10-24', '2018-10-31')) {
      return "Week 8"
    } else if (moment(MatchTime).isBetween('2018-10-31', '2018-11-07')) {
      return "Week 9"
    } else if (moment(MatchTime).isBetween('2018-11-07', '2018-11-14')) {
      return "Week 10"
    } else if (moment(MatchTime).isBetween('2018-11-14', '2018-11-21')) {
      return "Week 11"
    } else if (moment(MatchTime).isBetween('2018-11-21', '2018-11-28')) {
      return "Week 12"
    } else if (moment(MatchTime).isBetween('2018-11-28', '2018-12-05')) {
      return "Week 13"
    } else if (moment(MatchTime).isBetween('2018-12-05', '2018-12-12')) {
      return "Week 14"
    } else if (moment(MatchTime).isBetween('2018-12-12', '2018-12-19')) {
      return "Week 15"
    } else if (moment(MatchTime).isBetween('2018-12-19', '2018-12-26')) {
      return "Week 16"
    } else if (moment(MatchTime).isBetween('2018-12-26', '2019-01-02')) {
      return "Week 17"
    } else {
      return "Postseason"
    }
  }
}
