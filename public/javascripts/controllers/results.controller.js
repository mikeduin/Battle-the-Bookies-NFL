angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', '$scope', '$timeout', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, $scope, $timeout) {
  var vm = this;
  vm.gameWeekFilter;
  vm.dateNumbFilter;
  vm.weekNumbFilter;
  vm.weeksOfGames = [];
  vm.nflLines = [];
  vm.getNflLines = getNflLines;
  vm.updatePicks = updatePicks;
  vm.gameSort = "MatchTime";
  vm.gameSortTwo = "EventID";
  vm.userSort = "-sumYtd";
  vm.updateResults = updateResults;
  vm.getPicks = getPicks;
  vm.getDates = getDates;
  vm.activeUserSumToday;
  vm.picks = [];
  vm.users = [];

  // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
  //   vm.showSpinner = false;
  // })
  $timeout(function(){
    vm.showSpinner = false
  }, 10000)

  $scope.$watch('vm.gameWeekFilter', function(){
    if (vm.gameWeekFilter === 'Week 1') {
      vm.weekNumbFilter === "01"
    } else if (vm.gameWeekFilter === 'Week 2') {
      vm.weekNumbFilter === "02"
    } else if (vm.gameWeekFilter === 'Week 3') {
      vm.weekNumbFilter === "03"
    } else if (vm.gameWeekFilter === 'Week 4') {
      vm.weekNumbFilter === "04"
    } else if (vm.gameWeekFilter === 'Week 5') {
      vm.weekNumbFilter === "05"
    } else if (vm.gameWeekFilter === 'Week 6') {
      vm.weekNumbFilter === "06"
    } else if (vm.gameWeekFilter === 'Week 7') {
      vm.weekNumbFilter === "07"
    } else if (vm.gameWeekFilter === 'Week 8') {
      vm.weekNumbFilter === "08"
    } else if (vm.gameWeekFilter === 'Week 9') {
      vm.weekNumbFilter === "09"
    } else if (vm.gameWeekFilter === 'Week 10') {
      vm.weekNumbFilter === "10"
    } else if (vm.gameWeekFilter === 'Week 11') {
      vm.weekNumbFilter === "11"
    } else if (vm.gameWeekFilter === 'Week 12') {
      vm.weekNumbFilter === "12"
    } else if (vm.gameWeekFilter === 'Week 13') {
      vm.weekNumbFilter === "13"
    } else if (vm.gameWeekFilter === 'Week 14') {
      vm.weekNumbFilter === "14"
    } else if (vm.gameWeekFilter === 'Week 15') {
      vm.weekNumbFilter === "15"
    } else if (vm.gameWeekFilter === 'Week 16') {
      vm.weekNumbFilter === "16"
    } else if (vm.gameWeekFilter === 'Week 17') {
      vm.weekNumbFilter === "17"
    } else {
      vm.weekNumbFilter = null
    };
    console.log('adjusted vm.WeekNumbFilter is', vm.weekNumbFilter)
  })

  vm.checkTime = function(gametime) {
    if (moment(gametime).isBefore(vm.currentTime)){
      return true
    } else {
      return false
    }
  }

  vm.currentTime = moment().format();

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  };

  vm.matchTimePull = function(time) {
    vm.dateNumbFilter = moment(time).format('YYYYMMDD')
  };

  vm.weekNumbPull = function(MatchTime) {
    if (moment(MatchTime).isBetween('2016-06-23', '2016-09-06')) {
      return "PRE"
    } else if (moment(MatchTime).isBetween('2016-09-06', '2016-09-13')) {
      return "01"
    } else if (moment(MatchTime).isBetween('2016-09-13', '2016-09-20')) {
      return "02"
    } else if (moment(MatchTime).isBetween('2016-09-20', '2016-09-27')) {
      return "03"
    } else if (moment(MatchTime).isBetween('2016-09-27', '2016-10-04')) {
      return "04"
    } else if (moment(MatchTime).isBetween('2016-10-04', '2016-10-11')) {
      return "05"
    } else if (moment(MatchTime).isBetween('2016-10-11', '2016-10-18')) {
      return "06"
    } else if (moment(MatchTime).isBetween('2016-10-18', '2016-10-25')) {
      return "07"
    } else if (moment(MatchTime).isBetween('2016-10-25', '2016-11-01')) {
      return "08"
    } else if (moment(MatchTime).isBetween('2016-11-01', '2016-11-08')) {
      return "09"
    } else if (moment(MatchTime).isBetween('2016-11-08', '2016-11-15')) {
      return "10"
    } else if (moment(MatchTime).isBetween('2016-11-15', '2016-11-22')) {
      return "11"
    } else if (moment(MatchTime).isBetween('2016-11-22', '2016-11-29')) {
      return "12"
    } else if (moment(MatchTime).isBetween('2016-11-29', '2016-12-06')) {
      return "13"
    } else if (moment(MatchTime).isBetween('2016-12-06', '2016-12-13')) {
      return "14"
    } else if (moment(MatchTime).isBetween('2016-12-13', '2016-12-20')) {
      return "15"
    } else if (moment(MatchTime).isBetween('2016-12-20', '2016-12-27')) {
      return "16"
    } else if (moment(MatchTime).isBetween('2016-12-27', '2017-01-03')) {
      return "17"
    } else {
      return "POST"
    }
  };

  vm.weekSetter = function(MatchTime) {
    if (moment(MatchTime).isBetween('2016-06-23', '2016-09-06')) {
      return "Preseason"
    } else if (moment(MatchTime).isBetween('2016-09-06', '2016-09-13')) {
      return "Week 1"
    } else if (moment(MatchTime).isBetween('2016-09-13', '2016-09-20')) {
      return "Week 2"
    } else if (moment(MatchTime).isBetween('2016-09-20', '2016-09-27')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2016-09-27', '2016-10-04')) {
      return "Week 4"
    } else if (moment(MatchTime).isBetween('2016-10-04', '2016-10-11')) {
      return "Week 5"
    } else if (moment(MatchTime).isBetween('2016-10-11', '2016-10-18')) {
      return "Week 6"
    } else if (moment(MatchTime).isBetween('2016-10-18', '2016-10-25')) {
      return "Week 7"
    } else if (moment(MatchTime).isBetween('2016-10-25', '2016-11-01')) {
      return "Week 8"
    } else if (moment(MatchTime).isBetween('2016-11-01', '2016-11-08')) {
      return "Week 9"
    } else if (moment(MatchTime).isBetween('2016-11-08', '2016-11-15')) {
      return "Week 10"
    } else if (moment(MatchTime).isBetween('2016-11-15', '2016-11-22')) {
      return "Week 11"
    } else if (moment(MatchTime).isBetween('2016-11-22', '2016-11-29')) {
      return "Week 12"
    } else if (moment(MatchTime).isBetween('2016-11-29', '2016-12-06')) {
      return "Week 13"
    } else if (moment(MatchTime).isBetween('2016-12-06', '2016-12-13')) {
      return "Week 14"
    } else if (moment(MatchTime).isBetween('2016-12-13', '2016-12-20')) {
      return "Week 15"
    } else if (moment(MatchTime).isBetween('2016-12-20', '2016-12-27')) {
      return "Week 16"
    } else if (moment(MatchTime).isBetween('2016-12-27', '2017-01-03')) {
      return "Week 17"
    } else {
      return "Postseason"
    }
  }

  vm.sumWeek = function(user, weeknumb) {
    username = user.username;
    console.log("vm.sumWeek weeknumb is", weeknumb)
    return picksService.sumWeek(username, weeknumb).then(function(result){
      // console.log("total returned in controller is " + result);
      return result;
    })
  };

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.sumAllPicks(username).then(function(result){
      user.sumYtd = result.totalDollars
    })
  }

  vm.pickSettle = function(pick) {
    if (pick.pickResult === "win") {
      pick.dollars = pick.activePayout
    } else if (pick.pickResult === "loss") {
      pick.dollars = -100
    } else if (pick.pickResult === "push"){
      pick.dollars = 0
    } else {
      null
    }
  }

  vm.updateDollars = function(){
    picksService.updateDollars().then(function(){
      console.log('res controller says update dollars')
    })
  }

  function getNflLines (){
    vm.showSpinner = true;
    oddsService.getNflLines().then(function(games){
      vm.nflLines = games;
    })
  }

  function updatePicks() {
    picksService.updatePicks();
  }

  function updateResults () {
    resultsService.updateResults().then(function(){
    })
  };

  function getPicks () {
    oddsService.getPicks().then(function(data){
      vm.picks = data;
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.weeksOfGames = dates;
      var dateArray = vm.weeksOfGames;
      var lastWeek = dateArray[dateArray.length - 1];
      var currentWeek = vm.weekSetter(moment().format());
      var currentWeekNumb = vm.weekNumbPull(moment().format());
      if (currentWeek === "Preseason") {
        vm.gameWeekFilter = "Week 1";
        vm.weekNumbFilter = "01";
      } else if (
        currentWeek === "Postseason"
      ) {
        vm.gameWeekFilter = "Week 17";
        vm.weekNumbFilter - "17";
      } else {
        vm.gameWeekFilter = currentWeek;
        vm.weekNumbFilter = currentWeekNumb;
      }
      console.log('current weekNumb is', vm.weekNumbFilter);
    })
  };

}
