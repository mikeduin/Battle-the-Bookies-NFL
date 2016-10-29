angular
  .module('battleBookies')
  .controller('UserController', ['$stateParams', 'picksService', 'usersService', 'oddsService', '$state',  UserController])

function UserController ($stateParams, picksService, usersService, oddsService, $state) {
  var vm = this;
  vm.user = {};
  vm.userFilter;
  vm.username;
  vm.users = [];
  vm.getDates = getDates;
  vm.gameWeekFilter;
  vm.weeksOfGames = [];
  vm.picks;

  vm.getMatchups = function(){
    usersService.getMatchups().then(function(result){
      console.log('matchups are ', result)
    })
  };

  vm.userChange = function(){
    $state.go('home.user', {username: vm.userFilter});
    vm.getUser();
  }

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
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
    usersService.getUserPicks(username).then(function(result){
      vm.picks = result;
      console.log(vm.picks);
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

  vm.getWeeklyStats = function(username){
    picksService.getWeeklyStats(username).then(function(result){
      stats = result.data;

      var ytdDollars = 0

      for (i=0; i<stats.length; i++) {
        var dayDollars = stats[i].totalDollars;
        var lastDate = vm.dailyData.scaleX.values[vm.dailyData.scaleX.values.length - 1]
        var date = stats[i].week;
        ytdDollars += dayDollars;
        if (date !== lastDate){
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
      var weekNumbers = [];
      for (i=0; i<dates.length; i++) {
        var weekNumber = parseInt(dates[i].substring(5));
        weekNumbers.push(weekNumber)
      }
      weekNumbers.sort();
      for (i=0; i<weekNumbers.length; i++) {
        var newWeek = "Week " + weekNumbers[i];
        vm.weeksOfGames.push(newWeek)
      }
      var currentWeek = vm.weekSetter(moment().format());
      if (currentWeek === "Preseason") {
        vm.gameWeekFilter = "Week 1"
      } else if (
        currentWeek === "Postseason"
      ) {
        vm.gameWeekFilter = "Week 17"
      } else {
        vm.gameWeekFilter = currentWeek
      }
    })
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
