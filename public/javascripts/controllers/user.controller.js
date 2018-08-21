angular
  .module('battleBookies')
  .controller('UserController', ['$stateParams', 'picksService', 'usersService', 'oddsService', 'authService','$state', '$scope', UserController])

function UserController ($stateParams, picksService, usersService, oddsService, authService, $state, $scope) {
  var vm = this;
  vm.user = {};
  vm.userFilter;
  vm.username;
  vm.users = [];
  vm.getDates = getDates;
  vm.gameWeekFilter;
  vm.weeksOfGames = [];
  vm.picks;
  vm.abbrev;
  vm.weekNumb;
  vm.seasons = [2017, 2018];
  vm.reReg = false;
  vm.regSeason;

  $(document).ready(function () {
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 20});
  })

  vm.reRegister = function (user) {
    user.newSeason = vm.regSeason;
    user.username = vm.userFilter;
    usersService.reRegister(user).then(function(res){
      console.log(res);
    })
  };

  vm.openModal = function(){
    $('#modal1').modal('open');
  };

  vm.closeModal = function(){
    $('#modal1').modal('close');
  };

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
    vm.showSpinner = false;
  })

  var now = moment();

  function sortNumber(a, b) {
    return a - b
  };

  vm.checkWeekNumb = function(){
    vm.weekNumb = parseInt(vm.gameWeekFilter.substring(4));
  };

  vm.getMatchups = function(){
    usersService.getMatchups().then(function(result){
      vm.matchups = result;
    })
  };

  vm.currentUser = function(){
    return authService.currentUser();
  };

  vm.checkDisplay = function(game){
    if (moment(game.MatchTime).add(10, 'm').isBefore(now) || vm.currentUser() === vm.userFilter) {
      return true
    } else {
      return false
    }
  };

  vm.checkTime = function(game){
    if (moment(game.MatchTime).isBefore(now) && vm.weekNumb > 5) {
      return true
    } else {
      return false
    }
  };

  vm.userChange = function(){
    $state.go('home.user', {username: vm.userFilter});
    vm.getUser();
  }

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result;
      vm.usernames = [];
      for (var i=0; i<result.length; i++) {
        vm.usernames.push(result[i].username);
      };
      vm.usernames.sort();
    })
  }

  vm.pullAbbrevs = function(EventID){
    var home = vm.matchups[EventID].HomeAbbrev;
    var away = vm.matchups[EventID].AwayAbbrev;
    vm.abbrev = "" + away + "@" + home + "";
  }

  vm.getUser = function(){
    usersService.getUser($stateParams.username).then(function(user){
      vm.user = user[0];
      vm.userFilter = user[0].username;
      vm.getUserPicks(user[0].username);
      vm.sumAllPicks(user[0].username);
      vm.getPickStats(user[0].username);
      vm.getWeeklyStats(user[0].username);
    })
  }

  vm.getUserPicks = function(username){
    vm.showSpinner = true;
    usersService.getUserPicks(username).then(function(result){
      vm.picks = result;
    })
  }

  vm.sumAllPicks = function(username) {
    picksService.sumAllPicks(username).then(function(result){
      vm.user.sumYtd = result.totalDollars;
      vm.user.ytdW = result.totalW;
      vm.user.ytdL = result.totalG - result.totalW;
      vm.user.ytdPct = result.totalW / result.totalG;
    })
  }

  vm.getSeasonStats = function() {
    console.log('params.username is ', $stateParams.username);
    usersService.getSeasonStats($stateParams.username).then(function(res){
      console.log(res);
      vm.seasonStats = res;
    })
  };

  vm.getWeeklyStats = function(username){
    picksService.getWeeklyStats(username).then(function(result){
      stats = result.data;
      var ytdDollars = 0
      for (i=0; i<stats.length; i++) {
        var dayDollars = stats[i].totalDollars;
        var lastDate = vm.dailyData.scaleX.values[vm.dailyData.scaleX.values.length - 1]
        var date = stats[i].week;
        ytdDollars += dayDollars;
        if (date !== lastDate && date !== undefined){
          vm.dailyData.scaleX.values.push(date);
          vm.dailyData.series[0].values.push(dayDollars);
          vm.dailyData.series[1].values.push(ytdDollars);
        }
      }
    })
  }

  vm.getPickStats = function(username) {
    picksService.getPickStats(username).then(function(stats){
      stats = stats.data;
      vm.user.awayMlPicks = stats.awayMlPicks;
      vm.tendencyData.series[0].values.push(stats.awayMlPicks);
      vm.user.homeMlPicks = stats.homeMlPicks;
      vm.tendencyData.series[1].values.push(stats.homeMlPicks);
      vm.user.combMlPicks = stats.awayMlPicks + stats.homeMlPicks;
      vm.pickTypeData.series[0].values.push(vm.user.combMlPicks);
      vm.user.awaySpreadPicks = stats.awaySpreadPicks;
      vm.tendencyData.series[2].values.push(stats.awaySpreadPicks);
      vm.user.homeSpreadPicks = stats.homeSpreadPicks;
      vm.tendencyData.series[3].values.push(stats.homeSpreadPicks);
      vm.user.combSpreadPicks = stats.awaySpreadPicks + stats.homeSpreadPicks;
      vm.pickTypeData.series[1].values.push(vm.user.combSpreadPicks);
      vm.user.totalOverPicks = stats.totalOverPicks;
      vm.tendencyData.series[4].values.push(stats.totalOverPicks);
      vm.user.totalUnderPicks = stats.totalUnderPicks;
      vm.tendencyData.series[5].values.push(stats.totalUnderPicks);
      vm.user.combTotalPicks = stats.totalOverPicks + stats.totalUnderPicks;
      vm.pickTypeData.series[2].values.push(vm.user.combTotalPicks);
      vm.user.favPicks = stats.favPicks;
      vm.favData.series[0].values.push(stats.favPicks);
      vm.user.dogPicks = stats.dogPicks;
      vm.favData.series[1].values.push(stats.dogPicks);
    })
  };

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.weeksOfGames = dates;
      var currentWeek = vm.weekSetter(moment().format());
      if (currentWeek === "Preseason") {
        vm.gameWeekFilter = "Week 1"
      } else if (
        currentWeek === "Postseason"
      ) {
        vm.gameWeekFilter = "Week 17"
      } else {
        vm.gameWeekFilter = currentWeek
      };
      vm.weekNumb = parseInt(vm.gameWeekFilter.substring(4))
    })
  };

  vm.weekSetter = function(MatchTime) {
    if (moment(MatchTime).isBetween('2018-06-23', '2018-09-01')) {
      return "Preseason"
    } else if (moment(MatchTime).isBetween('2018-09-02', '2018-09-12')) {
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

  vm.dailyData = {
    'type':'mixed',
    'title': {
      'text':'Profit Progression',
      "fontFamily": "Raleway"
    },
    'plot':{
      'aspect': 'spline',
      'tooltip': '%scale-key-label',
      'line-width': 5,
      'marker': {
        'background-color': '#B68708',
        'size': 7,
        'border-color': '#2F5032',
        'border-width': 1
      }
    },
    'scaleX':{
      'values': [],
      'offset-y': 4,
    },
    'scaleY':{
      'format': '$%v'
    },
    'tooltip':{
      'text': '$%v',
      'decimals': 2,
      'negation':'currency',
      'thousands-separator':','
    },
    'legend':{
    },
    'series':[
      {
        "values": [],
        "type": 'bar',
        "background-color": "#2F5032",
        'legend-text': 'Weekly $',
        "animation": {
          "delay": 0,
          "effect": 13,
          "speed": "1500",
          "method": 0,
          "sequence": "0"
        }
      },
      {
        "values": [],
        "type": 'line',
        "line-color": "#B68708",
        'legend-text': 'YTD $',
        "animation": {
          "delay":10,
          "effect":5,
          "speed":"1500"
        }
      }
    ]
  }

  vm.tendencyData = {
    'type':'pie',
    'title': {
      'text':'Tendency Drill-Down',
      "fontFamily": "Raleway"
    },
    'plot':{
      "animation":{
          "effect":"2",
          "delay":"1000",
          "speed":"2000",
          "method":"5",
          "sequence":"1"
      },
      "valueBox": {
 	    "placement": 'out',
 	    "text": '%t\n%npv%',
 	    "fontFamily": "Raleway",
      "font-size": 10,
      "shadow": true,
      "padding": "10%"
      }
    },
    'series':[
      {
        "values": [],
        "text": 'Away ML',
        "background-color": "#2196f3"
      },
      {
        "values":[],
        "text": "Home ML",
        "background-color": "#90caf9"
      },
      {
        "values":[],
        "text": "Away Spread",
        "background-color": "#4caf50"
      },
      {
        "values":[],
        "text": "Home Spread",
        "background-color": "#a5d6a7"
      },
      {
        "values":[],
        "text": "Total Over",
        "background-color": "#ff5722"
      },
      {
        "values":[],
        "text": "Total Under",
        "background-color": "#ffab91"
      }
    ]
  }

  vm.pickTypeData = {
    'type':'pie',
    'title': {
      'text':'Pick Tendencies',
      "fontFamily": "Raleway"
    },
    'plot':{
      "animation":{
          "effect":"2",
          "delay":"1000",
          "speed":"1500",
          "method":"5",
          "sequence":"1"
      },
      "valueBox": {
 	    "placement": 'in',
 	    "text": '%t\n%npv%',
 	    "fontFamily": "Raleway",
      "font-size": 12,
      "shadow": true,
      "padding": "10%"
      }
    },
    'series':[
      {
        "values": [],
        "text": 'Moneylines',
        "background-color": "#1A237E"
      },
      {
        "values":[],
        "text": "Spreads",
        "background-color": "#1B5E20"
      },
      {
        "values":[],
        "text": "Totals",
        "background-color": "#BF360C"
      }
    ]
  }

  vm.favData = {
    'type':'ring',
    'title': {
      'text':'David ... or Goliath?',
      "fontFamily": "Raleway"
    },
    'plot':{
      "animation":{
          "effect":"4",
          "delay":"2000",
          "speed":"1500",
          "method":"5",
          "sequence":"1"
      },
      "valueBox": {
 	    "placement": 'in',
 	    "text": '%t\n%npv%',
 	    "fontFamily": "Raleway",
      "font-size": 12,
      "shadow": true,
      "padding": "10%"
      }
    },
    'series':[
      {
        "values": [],
        "text": 'Favorites',
        "background-color": "#4A148C"
      },
      {
        "values":[],
        "text": "Underdogs",
        "background-color": "#B71C1C"
      }
    ]
  }

}
