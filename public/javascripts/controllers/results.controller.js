angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', '$scope', '$timeout', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, $scope, $timeout) {
  var vm = this;
  vm.gameWeekFilter;
  vm.dateNumbFilter;
  vm.weekNumbFilter;
  vm.weeksOfGames = [];
  vm.mlbLines = [];
  vm.getMlbLines = getMlbLines;
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

  vm.checkTime = function(gametime) {
    if (moment(gametime).isBefore(vm.currentTime)){
      return true
    } else {
      return false
    }
  }

  vm.currentTime = moment().format();
  console.log('current time is ', vm.currentTime);

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  };

  vm.matchTimePull = function(time) {
    vm.dateNumbFilter = moment(time).format('YYYYMMDD')
  };

  vm.weekNumbPull = function(time) {
    if (moment(MatchTime).isBetween('2016-06-23', '2016-09-07')) {
      return "PRE"
    } else if (moment(MatchTime).isBetween('2016-09-07', '2016-09-14')) {
      return "01"
    } else if (moment(MatchTime).isBetween('2016-09-14', '2016-09-21')) {
      return "02"
    } else if (moment(MatchTime).isBetween('2016-09-21', '2016-09-28')) {
      return "03"
    } else if (moment(MatchTime).isBetween('2016-09-28', '2016-10-05')) {
      return "04"
    } else if (moment(MatchTime).isBetween('2016-10-05', '2016-10-12')) {
      return "05"
    } else if (moment(MatchTime).isBetween('2016-10-12', '2016-10-19')) {
      return "06"
    } else if (moment(MatchTime).isBetween('2016-10-19', '2016-10-26')) {
      return "07"
    } else if (moment(MatchTime).isBetween('2016-10-26', '2016-11-02')) {
      return "08"
    } else if (moment(MatchTime).isBetween('2016-11-02', '2016-11-09')) {
      return "09"
    } else if (moment(MatchTime).isBetween('2016-11-09', '2016-11-16')) {
      return "10"
    } else if (moment(MatchTime).isBetween('2016-11-16', '2016-11-23')) {
      return "11"
    } else if (moment(MatchTime).isBetween('2016-11-23', '2016-11-30')) {
      return "12"
    } else if (moment(MatchTime).isBetween('2016-11-30', '2016-12-07')) {
      return "13"
    } else if (moment(MatchTime).isBetween('2016-12-07', '2016-12-14')) {
      return "14"
    } else if (moment(MatchTime).isBetween('2016-12-14', '2016-12-21')) {
      return "15"
    } else if (moment(MatchTime).isBetween('2016-12-21', '2016-12-28')) {
      return "16"
    } else if (moment(MatchTime).isBetween('2016-12-28', '2017-01-04')) {
      return "17"
    } else {
      return "POST"
    }
  };

  vm.sumWeek = function(user, weeknumb) {
    username = user.username;
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

  function getMlbLines (){
    vm.showSpinner = true;
    oddsService.getMlbLines().then(function(games){
      console.log(games);
      vm.mlbLines = games;
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
      console.log(vm.picks);
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.weeksOfGames = dates;
      var dateArray = vm.weeksOfGames;
      var lastWeek = dateArray[dateArray.length - 1];
      var currentWeek = oddsService.weekSetter(moment().format());
      vm.gameWeekFilter = currentWeek;
    })
  };

}
