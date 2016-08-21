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
    console.log('hello');
    // console.log('time in weeknumbpull is', time);
    // oddsService.weekNumbSetter(time).then(function(result){
    //   console.log('weekNumbFilter result is ', result)
    // });
    // console.log('vm.weeknumbfilter is', vm.weekNumbFilter);
    // console.log('MatchTime in weekNumbSetter is', time);
    if (moment(time).isBetween('2016-06-23', '2016-07-01')) {
      vm.weekNumbFilter = "01"
    } else if (moment(time).isBetween('2016-06-30', '2016-07-08')) {
      vm.weekNumbFilter = "02"
    } else if (moment(time).isBetween('2016-07-07', '2016-07-15')) {
      vm.weekNumbFilter = "03"
    } else if (moment(time).isBetween('2016-07-14', '2016-07-22')) {
      vm.weekNumbFilter = "04"
    } else {
      vm.weekNumbFilter = "05"
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
