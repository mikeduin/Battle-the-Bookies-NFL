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
      var currentWeek = vm.weekSetter(moment().subtract(2, 'd').format());
      vm.currentWeekNumb = parseInt(currentWeek.substring(5));
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
    authService.logOut()
  }

  vm.currentUser = function(){
    return authService.currentUser();
  }

  vm.weekSetter = function(MatchTime) {
    if (moment(MatchTime).isBetween('2017-06-23', '2017-07-11')) {
      return "Preseason"
    } else if (moment(MatchTime).isBetween('2017-07-11', '2017-07-19')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2017-07-19', '2017-07-26')) {
      return "Week 4"
    } else if (moment(MatchTime).isBetween('2017-07-26', '2017-08-02')) {
      return "Week 5"
    } else if (moment(MatchTime).isBetween('2017-08-02', '2017-08-09')) {
      return "Week 6"
    } else if (moment(MatchTime).isBetween('2017-08-09', '2017-08-16')) {
      return "Week 7"
    } else if (moment(MatchTime).isBetween('2017-08-16', '2017-08-23')) {
      return "Week 8"
    } else if (moment(MatchTime).isBetween('2017-08-23', '2017-08-30')) {
      return "Week 9"
    } else if (moment(MatchTime).isBetween('2017-10-26', '2017-11-02')) {
      return "Week 10"
    } else if (moment(MatchTime).isBetween('2017-11-02', '2017-11-09')) {
      return "Week 11"
    } else if (moment(MatchTime).isBetween('2017-11-09', '2017-11-16')) {
      return "Week 12"
    } else if (moment(MatchTime).isBetween('2017-11-16', '2017-11-23')) {
      return "Week 13"
    } else if (moment(MatchTime).isBetween('2017-11-23', '2017-11-30')) {
      return "Week 14"
    } else if (moment(MatchTime).isBetween('2017-11-30', '2017-12-07')) {
      return "Week 15"
    } else if (moment(MatchTime).isBetween('2017-12-07', '2017-12-14')) {
      return "Week 16"
    } else if (moment(MatchTime).isBetween('2017-12-14', '2017-12-21')) {
      return "Week 17"
    } else if (moment(MatchTime).isBetween('2017-12-21', '2017-12-28')) {
      return "Week 18"
    } else if (moment(MatchTime).isBetween('2017-12-28', '2017-01-04')) {
      return "Week 19"
    } else {
      return "Postseason"
    }
  }

}
