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
    authService.logOut();
  }

  vm.currentUser = function(){
    return authService.currentUser();
  }

  vm.weekSetter = function(MatchTime) {
    if (moment(MatchTime).isBetween('2017-06-23', '2017-09-01')) {
      return "Preseason"
    } else if (moment(MatchTime).isBetween('2017-09-02', '2017-09-13')) {
      return "Week 1"
    } else if (moment(MatchTime).isBetween('2017-09-13', '2017-09-20')) {
      return "Week 2"
    } else if (moment(MatchTime).isBetween('2017-09-20', '2017-09-27')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2017-09-27', '2017-10-04')) {
      return "Week 4"
    } else if (moment(MatchTime).isBetween('2017-10-04', '2017-10-11')) {
      return "Week 5"
    } else if (moment(MatchTime).isBetween('2017-10-11', '2017-10-18')) {
      return "Week 6"
    } else if (moment(MatchTime).isBetween('2017-10-18', '2017-10-25')) {
      return "Week 7"
    } else if (moment(MatchTime).isBetween('2017-10-25', '2017-11-01')) {
      return "Week 8"
    } else if (moment(MatchTime).isBetween('2017-11-01', '2017-11-08')) {
      return "Week 9"
    } else if (moment(MatchTime).isBetween('2017-11-08', '2017-11-15')) {
      return "Week 10"
    } else if (moment(MatchTime).isBetween('2017-11-15', '2017-11-22')) {
      return "Week 11"
    } else if (moment(MatchTime).isBetween('2017-11-22', '2017-11-29')) {
      return "Week 12"
    } else if (moment(MatchTime).isBetween('2017-11-29', '2017-12-06')) {
      return "Week 13"
    } else if (moment(MatchTime).isBetween('2017-12-06', '2017-12-13')) {
      return "Week 14"
    } else if (moment(MatchTime).isBetween('2017-12-13', '2017-12-20')) {
      return "Week 15"
    } else if (moment(MatchTime).isBetween('2017-12-20', '2017-12-27')) {
      return "Week 16"
    } else if (moment(MatchTime).isBetween('2017-12-27', '2017-01-03')) {
      return "Week 17"
    } else {
      return "Postseason"
    }
  }
}
