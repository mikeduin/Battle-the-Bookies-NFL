angular
  .module('battleBookies')
  .controller('GameController', ['$stateParams', 'gameService', GameController])

function GameController ($stateParams, gameService) {
  var vm = this;
  vm.EventID = $stateParams.EventID;
  vm.utcAdjust;
  vm.dogMLs = [];
  vm.favMLs = [];
  vm.dogSpreads = [];
  vm.favSpreads = [];
  vm.overs = [];
  vm.unders = [];
  vm.dogSpreadRange = [];
  vm.favSpreadRange = [];
  vm.dogMLRange = [];
  vm.favMLRange = [];
  vm.totalRange = [];
  vm.totalRangeRev = [];
  vm.timeValues = [];
  vm.favSpreadChartValues = [];
  vm.favSpreadJuices = [];
  vm.favSpreadUsers = [];
  vm.favSpreadAbbrevs = [];
  vm.dogSpreadChartValues = [];
  vm.dogSpreadJuices = [];
  vm.dogSpreadUsers = [];
  vm.dogSpreadAbbrevs = [];
  vm.favMLChartValues = [];
  vm.favMLActivePicks = [];
  vm.favMLUsers = [];
  vm.dogMLChartValues = [];
  vm.dogMLActivePicks = [];
  vm.dogMLUsers = [];
  vm.overChartValues = [];
  vm.overJuices = [];
  vm.overUsers = [];
  vm.overActivePicks = [];
  vm.underChartValues = [];
  vm.underJuices = [];
  vm.underUsers = [];
  vm.underActivePicks = [];
  vm.dateRangeLow;
  vm.message = 'hello';

  vm.checkDST = function() {
    if (moment().isDST() === true){
      vm.utcAdjust = -7
    } else {
      vm.utcAdjust = -8
    }
  };
  Array.max = function(array){
    return Math.max.apply(Math, array)
  };
  Array.min = function(array){
    return Math.min.apply(Math, array)
  };

  vm.getLineData = function(){
    gameService.getLineData(vm.EventID).then(function(result){
      vm.game = result[0];
      vm.awayColor = vm.game.AwayColor;
      vm.homeColor = vm.game.HomeColor;

      if(vm.game.PointSpreadAway < 0) {
        vm.myConfig.graphset[5].series[0].marker.backgroundColor = vm.awayColor;
        vm.myConfig.graphset[5].series[0].tooltip.fontColor = vm.awayColor;
        vm.myConfig.graphset[10].series[0].marker.backgroundColor = vm.awayColor;
        vm.myConfig.graphset[10].series[0].tooltip.fontColor = vm.awayColor;
        vm.myConfig.graphset[5].series[1].marker.backgroundColor = vm.homeColor;
        vm.myConfig.graphset[5].series[1].tooltip.fontColor = vm.homeColor;
        vm.myConfig.graphset[10].series[1].marker.backgroundColor = vm.homeColor;
        vm.myConfig.graphset[10].series[1].tooltip.fontColor = vm.homeColor;
        vm.favColor = vm.awayColor;
        vm.dogColor = vm.homeColor;
      } else {
        vm.myConfig.graphset[5].series[0].marker.backgroundColor = vm.homeColor;
        vm.myConfig.graphset[5].series[0].tooltip.fontColor = vm.homeColor;
        vm.myConfig.graphset[10].series[0].marker.backgroundColor = vm.homeColor;
        vm.myConfig.graphset[10].series[0].tooltip.fontColor = vm.homeColor;
        vm.myConfig.graphset[5].series[1].marker.backgroundColor = vm.awayColor;
        vm.myConfig.graphset[5].series[1].tooltip.fontColor = vm.awayColor;
        vm.myConfig.graphset[10].series[1].marker.backgroundColor = vm.awayColor;
        vm.myConfig.graphset[10].series[1].tooltip.fontColor = vm.awayColor;
        vm.favColor = vm.homeColor;
        vm.dogColor = vm.awayColor;
      };

      if (moment(vm.game.MatchTime).day() !== 0 && moment(vm.game.MatchTime).day() !== 1) {
        vm.dateRangeLow = moment(vm.game.MatchTime).day(0).hour(19).valueOf()
      } else {
        vm.dateRangeLow = moment(vm.game.MatchTime).day(-7).hour(19).valueOf()
      };

      vm.dateRangeHigh = moment(vm.game.MatchTime).valueOf();
      var extraDay = vm.dateRangeHigh + 80000001;

      for (i=vm.dateRangeLow; i<extraDay; i+=86400000){
        vm.timeValues.push(i)
      };

      var spreadRangeMin = (vm.game.SpreadLow)-0.5;
      var spreadRangeLoopMax = (vm.game.SpreadHigh)+1;
      var spreadRange = [];

      for (i=spreadRangeMin; i<spreadRangeLoopMax; i+=0.5){
        vm.dogSpreadRange.push(i)
      };

      for (i=0; i<vm.dogSpreadRange.length; i++){
        vm.favSpreadRange.push(-vm.dogSpreadRange[i]);
      };
      vm.favSpreadRange.reverse();

      var dogMLRangeMin = (vm.game.DogMLWorst) - 15;
      var dogMLRangeMax = (vm.game.DogMLBest) + 30;

      for (i=dogMLRangeMin; i<dogMLRangeMax; i+=15){
        vm.dogMLRange.push(i)
      };

      var favMLRangeMin = (vm.game.FavMLWorst) - 15;
      var favMLRangeMax = (vm.game.FavMLBest) + 30;

      for (i=favMLRangeMin; i<favMLRangeMax; i+=15){
        vm.favMLRange.push(i)
      };

      var totalRangeMin = (vm.game.TotalLow) - 0.5;
      var totalRangeMax = (vm.game.TotalHigh) + 1;

      for (i=totalRangeMin; i<totalRangeMax; i+=0.5){
        vm.totalRange.push(i);
        vm.totalRangeRev.unshift(i);
      };

    }).then(function(){
      console.log('vm.game is', vm.game);
      console.log('vm.homeColor is', vm.homeColor);

      gameService.getPickArrays(vm.EventID).then(function(result){

        vm.dogMLPicks = result[0].DogMLPickArray;
        vm.dogSpreadPicks = result[0].DogSpreadPickArray;
        vm.favMLPicks = result[0].FavMLPickArray;
        vm.favSpreadPicks = result[0].FavSpreadPickArray;
        vm.overPicks = result[0].OverPickArray;
        vm.underPicks = result[0].UnderPickArray;
        vm.noPicks = result[0].NoPickArray;

        vm.dogMLPickPct = Math.round((vm.dogMLPicks.length/38)*100);
        vm.dogSpreadPickPct = Math.round((vm.dogSpreadPicks.length/38)*100);
        vm.favMLPickPct = Math.round((vm.favMLPicks.length/38)*100);
        vm.favSpreadPickPct = Math.round((vm.favSpreadPicks.length/38)*100);
        vm.overPickPct = Math.round((vm.overPicks.length/38)*100);
        vm.underPickPct = Math.round((vm.underPicks.length/38)*100);

        vm.favAbbrev = vm.favSpreadPicks[0].activePick.substr(0, vm.favSpreadPicks[0].activePick.indexOf(' '));

        vm.dogAbbrev = vm.dogSpreadPicks[0].activePick.substr(0, vm.dogSpreadPicks[0].activePick.indexOf(' '));

        vm.myConfig.graphset[1].subtitle.fontColor = vm.favColor;
        vm.myConfig.graphset[3].subtitle.fontColor = vm.dogColor;

        vm.myConfig.graphset[1].subtitle.text= "<div>" + vm.favSpreadPickPct +"%</div>";
        vm.myConfig.graphset[2].title.text= "<div>" + vm.favAbbrev +" SPREAD</div>";
        vm.myConfig.graphset[3].subtitle.text= "<div>" + vm.dogSpreadPickPct +"%</div>";
        vm.myConfig.graphset[4].title.text= "<div>" + vm.dogAbbrev +" SPREAD</div>";

        console.log(vm.favAbbrev);
        console.log(vm.dogAbbrev);

        console.log(vm.dogMLPickPct)

        for (i=0; i<vm.favSpreadPicks.length; i++) {
          var unixTime = moment(vm.favSpreadPicks[i].submittedAt).valueOf();
          var favAbbrev = vm.favSpreadPicks[i].activePick.substr(0, vm.favSpreadPicks[i].activePick.indexOf(' '));

          vm.favSpreadChartValues.push([unixTime, vm.favSpreadPicks[i].relevantLine]);
          vm.favSpreadJuices.push(vm.favSpreadPicks[i].activeLine);
          vm.favSpreadUsers.push(vm.favSpreadPicks[i].username);
          vm.favSpreadAbbrevs.push(favAbbrev);
        };

        for (i=0; i<vm.dogSpreadPicks.length; i++) {
          var unixTime = moment(vm.dogSpreadPicks[i].submittedAt).valueOf();
          var dogAbbrev = vm.dogSpreadPicks[i].activePick.substr(0, vm.dogSpreadPicks[i].activePick.indexOf(' '));

          vm.dogSpreadChartValues.push([unixTime, vm.dogSpreadPicks[i].relevantLine]);
          vm.dogSpreadJuices.push(vm.dogSpreadPicks[i].activeLine);
          vm.dogSpreadUsers.push(vm.dogSpreadPicks[i].username);
          vm.dogSpreadAbbrevs.push(dogAbbrev);
        };

        for (i=0; i<vm.favMLPicks.length; i++){
          var unixTime = moment(vm.favMLPicks[i].submittedAt).valueOf();

          vm.favMLChartValues.push([unixTime, vm.favMLPicks[i].relevantLine]);
          vm.favMLActivePicks.push(vm.favMLPicks[i].activePick);
          vm.favMLUsers.push(vm.favMLPicks[i].username);
        };

        for (i=0; i<vm.dogMLPicks.length; i++){
          var unixTime = moment(vm.dogMLPicks[i].submittedAt).valueOf();

          vm.dogMLChartValues.push([unixTime, vm.dogMLPicks[i].relevantLine]);
          vm.dogMLActivePicks.push(vm.dogMLPicks[i].activePick);
          vm.dogMLUsers.push(vm.dogMLPicks[i].username);
        };

        for (i=0; i<vm.overPicks.length; i++){
          var unixTime = moment(vm.overPicks[i].submittedAt).valueOf();

          vm.overChartValues.push([unixTime, vm.overPicks[i].relevantLine]);
          vm.overActivePicks.push(vm.overPicks[i].activePick);
          vm.overJuices.push(vm.overPicks[i].activeLine);
          vm.overUsers.push(vm.overPicks[i].username);
        };

        for (i=0; i<vm.underPicks.length; i++){
          var unixTime = moment(vm.underPicks[i].submittedAt).valueOf();

          vm.underChartValues.push([unixTime, vm.underPicks[i].relevantLine]);
          vm.underActivePicks.push(vm.underPicks[i].activePick);
          vm.underJuices.push(vm.underPicks[i].activeLine);
          vm.underUsers.push(vm.underPicks[i].username);
        };

      })
    })
  }



  // zingchart.THEME="classic";
  vm.myConfig = {
    "background-color":"#d6d6d6",
    "graphset":[
        {
            "type":"null",
            "x":"2%",
            "y":"3%",
            "width":"63%",
            "background-color":"#f9f9f9",
            "title":{
                "text":":: CHRONOLOGICAL SELECTION CHARTING",
                "font-size":"16px",
                "color":"#605958",
                "background-color":"#f9f9f9",
                "border-bottom":"1px solid #d6d6d6",
                "padding":"26 30 28 30"
            }
        },
        {
            "type":"null",
            "x":"2%",
            "y":"13.33%",
            "width":"15%",
            "height": "13%",
            "background-color":"#f75b48",
            "title":
            {
                "height":"40px",
                "text":"SPREAD",
                "font-size":"12px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#d44434",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"40px"
            },
            "subtitle":{
                "html-mode": true,
                "offset-y":"10px",
                "background-color":"#f75b48",
                "font-size":"60px",
                "padding":"10 0 0 0",
                "alpha": 1
            }
        },
        {
            "type":"null",
            "x":"2%",
            "y":"26.33%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#f75b48",
            "title":{
                "html-mode": true,
                "offset-y":"-18px",
                "background-color":"#f75b48",
                "font-color":"black",
                "text-align":"center",
                "padding":"5 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"2%",
            "y":"29.6%",
            "width":"15%",
            "height": "10%",
            "background-color":"#f75b48",
            "subtitle":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-45px",
                "background-color":"#f75b48",
                "font-size":"60px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"2%",
            "y":"36.67%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#f75b48",
            "title":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-18px",
                "background-color":"#f75b48",
                "font-color":"white",
                // "font-size":"60px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"scatter",
            "x":"17%",
            "y":"13.33%",
            "height":"26.67%",
            "width":"48%",
            "background-color":"#f75b48",
            "title":{
                "height":"40px",
                "text":"",
                "font-size":"10px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#d44434",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"30px"
            },
            "plotarea":{
                "margin":"60 40 40 20"
            },
            "plot":{
                "line-color":"#fff",
                "marker":{
                    "type":"circle",
                    "background-color":"#f75b48",
                    "border-width":2,
                    "size":4,
                    "shadow":0,
                    "border-color":"#ffffff"
                },
                "hover-marker":{
                    "size": 12,
                    "alpha": 0.5
                },
                "hover-state":{
                    "visible":false
                }
            },
            // "utc" : true,
            // "timezone" : vm.utcAdjust,
            "scale-x":{
                "values": vm.timeValues,
                "transform":{
                  "type":"date",
                  "all":"%D<br>%m/%d/%y"
                },
                "item":{
                    "font-color":"#C13D2F"
                },
                "line-width":1,
                "line-color":"#D44434",
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1,
                    "line-color": "#D44434"
                },
                "tick":{
                    "visible":false
                }
            },
            "scale-y":{
                "values": vm.favSpreadRange,
                "guide":{
                    "visible":false
                },
                "line-color":"none",
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"black",
                    "offset-x":"5px"
                },
                "label":{
                  "text": "Favorite Spread",
                  "font-color": "black",
                  "offset-x": "7px"
                }
            },
            "scale-y-2":{
                "values": vm.dogSpreadRange,
                "guide":{
                    "visible":false
                },
                "line-color":"none",
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"white",
                    "offset-x":"-10px"
                },
                "label":{
                  "text": "Underdog Spread",
                  "font-color": "white",
                  "offset-x": "-10px"
                }
            },
            "series":[
                {
                    "values": vm.favSpreadChartValues,
                    "data-username": vm.favSpreadUsers,
                    "data-submitted": vm.favSpreadTimes,
                    "data-juice": vm.favSpreadJuices,
                    "data-favAbbrev": vm.favSpreadAbbrevs,
                    "marker":{
                      "border-color":"black",
                      "border-width": 2,
                      "background-repeat":"no-repeat",
                      "shadow":false,
                      "size": 9
                    },
                    "scales": "scale-x, scale-y",
                    "tooltip":{
                        "text": "%data-favAbbrev %v (%data-juice)<br>%data-username",
                        "font-size":"20px",
                        "border-radius":"6px",
                        "background-color":"#fff",
                        "shadow":true,
                        "padding":"10px"
                    },
                },
                {
                    "values": vm.dogSpreadChartValues,
                    "data-username": vm.dogSpreadUsers,
                    "data-submitted": vm.dogSpreadTimes,
                    "data-juice": vm.dogSpreadJuices,
                    "data-dogAbbrev": vm.dogSpreadAbbrevs,
                    "marker":{
                      "border-color":"white",
                      "background-repeat":"no-repeat",
                      "border-width": 2,
                      "shadow":false,
                      "size": 9
                    },
                    "scales": "scale-x, scale-y-2",
                    "tooltip":{
                        "text": "%data-dogAbbrev +%v (%data-juice)<br>%data-username",
                        "font-size":"20px",
                        "border-radius":"6px",
                        "background-color":"#fff",
                        "shadow":true,
                        "padding":"10px"
                    },
                }
            ]
        },
        {
            "type":"null",
            "x":"2%",
            "y":"40%",
            "width":"15%",
            "height": "13.33%",
            "background-color":"#969191",
            "title":{
                "height":"40px",
                "text":"MONEYLINE",
                "font-size":"12px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#605958",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"40px"
            },
            "subtitle":{
                "height":"145px",
                "offset-y":"10px",
                "background-color":"#969191",
                "font-color":"#f0f0f0",
                "font-size":"60px",
                "text-align":"center",
                "text":"98.7"
            }
        },
        {
            "type":"null",
            "x":"2%",
            "y":"53.33%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#969191",
            "title":{
                "html-mode": true,
                "offset-y":"-18px",
                "background-color":"#969191",
                "font-color":"black",
                "text-align":"center",
                "padding":"5 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"2%",
            "y":"57.7%",
            "width":"15%",
            "height": "10%",
            "background-color":"#969191",
            "subtitle":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-45px",
                "background-color":"#969191",
                "font-size":"60px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"2%",
            "y":"67.7%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#969191",
            "title":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-18px",
                "background-color":"#969191",
                "font-color":"white",
                // "font-size":"60px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"scatter",
            "x":"17%",
            "y":"40%",
            "height":"26.67%",
            "width":"48%",
            "background-color":"#969191",
            "title":{
                "height":"40px",
                "text":"",
                "font-size":"10px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#605958",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"30px"
            },
            "plotarea":{
                "margin":"60 40 40 20",
                "background-color":"#969191"
            },
            "plot":{
                "line-color":"#fff",
                "marker":{
                    "type":"circle",
                    "background-color":"#969191",
                    "border-width":2,
                    "size":4,
                    "shadow":0,
                    "border-color":"#ffffff"
                },
                "hover-marker":{
                    "size": 12,
                    "alpha": 0.5
                },
                "hover-state":{
                    "visible":false
                }
            },
            "scale-x":{
                "values": vm.timeValues,
                "transform":{
                  "type":"date",
                  "all":"%D<br>%m/%d/%y"
                },
                "item":{
                    "font-color":"#726F6E"
                },
                "line-width":1,
                "line-color":"#827E7E",
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1,
                    "line-color": "#827E7E"
                },
                "tick":{
                    "visible":false
                }
            },
            "scale-y":{
                "values": vm.favMLRange,
                "guide":{
                    "visible":false
                },
                "line-color":"none",
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"black",
                    "offset-x":"5px"
                },
                "label":{
                  "text": "Favorite ML",
                  "font-color": "black",
                  "offset-x": "7px"
                }
            },
            "scale-y-2":{
                "values": vm.dogMLRange,
                "guide":{
                    "visible":false
                },
                "line-color":"none",
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"white",
                    "offset-x":"-10px"
                },
                "label":{
                  "text": "Underdog ML",
                  "font-color": "white",
                  "offset-x": "-12px"
                }
            },
            "tooltip":{
                "text":"%v",
                "font-color":"#605958",
                "font-size":"20px",
                "border-radius":"6px",
                "background-color":"#fff",
                "shadow":true,
                "padding":"10px"
            },
            "series":[
              {
                  "values": vm.favMLChartValues,
                  "data-username": vm.favMLUsers,
                  "data-submitted": vm.favMLTimes,
                  "data-activePicks": vm.favMLActivePicks,
                  "marker":{
                    "border-color":"black",
                    "background-repeat":"no-repeat",
                    "shadow":false,
                    "size": 9
                  },
                  "scales": "scale-x, scale-y",
                  "tooltip":{
                      "text": "%data-activePicks<br>%data-username",
                      "font-size":"20px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"10px"
                  },
              },
              {
                "values": vm.dogMLChartValues,
                "data-username": vm.dogMLUsers,
                "data-submitted": vm.dogMLTimes,
                "data-activePicks": vm.dogMLActivePicks,
                  "marker":{
                    "border-color":"white",
                    "background-repeat":"no-repeat",
                    "shadow":false,
                    "size": 9
                  },
                  "scales": "scale-x, scale-y-2",
                  "tooltip":{
                      "text":"%data-activePicks<br>%data-username",
                      "font-size":"20px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"10px"
                  },
              }
            ]
        },
        {
            "type":"null",
            "x":"2%",
            "y":"66.67%",
            "width":"15%",
            "height": "26.67%",
            "background-color":"#7BA7F5",
            "title":{
                "height":"40px",
                "text":"TOTAL",
                "font-size":"12px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#5B7DB9",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"40px"
            },
            "subtitle":{
                "height":"145px",
                "offset-y":"10px",
                "background-color":"#7BA7F5",
                "font-color":"#f0f0f0",
                "font-size":"60px",
                "text-align":"center",
                "text":"98.7"
            }
        },
        {
            "type":"scatter",
            "x":"17%",
            "y":"66.67%",
            "height":"26.67%",
            "width":"48%",
            "background-color":"#7BA7F5",
            "title":{
                "height":"40px",
                "text":"",
                "font-size":"10px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#5B7DB9",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"30px"
            },
            "plotarea":{
                "margin":"60 40 40 20",
                "background-color":"#7BA7F5"
            },
            "plot":{
                "line-color":"#fff",
                "marker":{
                    "type":"circle",
                    "background-color":"#7BA7F5",
                    "border-width":2,
                    "size":4,
                    "shadow":0,
                    "border-color":"#ffffff"
                },
                "hover-marker":{
                    "size": 12,
                    "alpha": 0.5
                },
                "hover-state":{
                    "visible":false
                }
            },
            "scale-x":{
                "values": vm.timeValues,
                "transform":{
                  "type":"date",
                  "all":"%D<br>%m/%d/%y"
                },
                "item":{
                    "font-color":"#5B7DB9"
                },
                "line-width":1,
                "line-color":"#5B7DB9",
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1,
                    "line-color": "#7099E2"
                },
                "tick":{
                    "visible":false
                }
            },
            "scale-y":{
                "values": vm.totalRange,
                "guide":{
                    "visible":false
                },
                "line-color":"none",
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"black",
                    "offset-x":"10px"
                },
                "label":{
                  "text": "Total Under",
                  "font-color": "black",
                  "offset-x": "14px"
                }
            },
            "scale-y-2":{
                "values": vm.totalRangeRev,
                "guide":{
                    "visible":false
                },
                "line-color":"none",
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"white",
                    "offset-x":"-12px"
                },
                "label":{
                  "text": "Total Over",
                  "font-color": "white",
                  "offset-x": "-17px"
                }
            },
            "tooltip":{
                "text":"%v",
                "font-color":"#605958",
                "font-size":"20px",
                "border-radius":"6px",
                "background-color":"#fff",
                "shadow":true,
                "padding":"10px"
            },
            "series":[
              {
                  "values": vm.overChartValues,
                  "data-username": vm.overUsers,
                  "data-submitted": vm.overTimes,
                  "data-activePicks": vm.overActivePicks,
                  "marker":{
                    "border-color":"white",
                    "background-color": "#E8E8E8",
                    "background-repeat":"no-repeat",
                    "shadow":false,
                    "size": 9
                  },
                  "scales": "scale-x, scale-y-2",
                  "tooltip":{
                      "text": "%data-activePicks<br>%data-username",
                      "font-size":"20px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"10px"
                  },
              },
              {
                "values": vm.underChartValues,
                "data-username": vm.underUsers,
                "data-submitted": vm.underTimes,
                "data-activePicks": vm.underActivePicks,
                  "marker":{
                    "border-color":"black",
                    "background-color": "#2D2D2D",
                    "background-repeat":"no-repeat",
                    "shadow":false,
                    "size": 9
                  },
                  "scales": "scale-x, scale-y",
                  "tooltip":{
                      "text":"%data-activePicks<br>%data-username",
                      "font-size":"20px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"10px"
                  },
              }
            ]
        }
        // {
        //     "type":"grid",
        //     "x":"67%",
        //     "y":"3%",
        //     "width":"48%",
        //     "title":{
        //         "text":":: DEMOGRAPHICS",
        //         "font-size":"12px",
        //         "color":"#605958",
        //         "background-color":"#f9f9f9",
        //         "border-bottom":"1px solid #d6d6d6",
        //         "padding":"26 30 28 30"
        //     },
        //     // "shapes":[
        //     //     {
        //     //         "type":"square",
        //     //         "x":"94%",
        //     //         "y":"10px",
        //     //         "gradient-colors":"#f9f9f9 #f9f9f9 #d44434 #d44434",
        //     //         "gradient-stops":"0 0.5 0.5 1",
        //     //         "fill-angle":45,
        //     //         "size":7,
        //     //         "angle":-90
        //     //     }
        //     // ],
        //     "plotarea":{
        //         "margin":"70 0 0 0"
        //     },
        //     "options":{
        //         "header-row":false,
        //         "col-widths":["35%","65%"],
        //         "style":{
        //             ".tr":{
        //                 "border-width":"0px",
        //                 "border-bottom":"0px",
        //                 "padding":"24 10 19 10",
        //                 "height":67
        //             },
        //             ".tr_even":{
        //                 "background-color":"#fcfcfc"
        //             },
        //             ".tr_odd":{
        //                 "background-color":"#f9f9f9"
        //             },
        //             ".td_0":{
        //                 "align":"right",
        //                 "font-color":"#969191"
        //             },
        //             ".td_1":{
        //                 "font-weight":"bold"
        //             }
        //         }
        //     },
        //     "series":[
        //         {
        //             "values":["NAME","John Smith"]
        //         },
        //         {
        //             "values":["GENDER","Male"]
        //         },
        //         {
        //             "values":["AGE","30"]
        //         },
        //         {
        //             "values":["HEIGHT","6 ft."]
        //         },
        //         {
        //             "values":["WEIGHT","180 lbs."]
        //         },
        //         {
        //             "values":["CITY","Chicago"]
        //         }
        //     ]
        // }
    ]
};

// zingchart.render({
// 	id : 'myChart',
// 	data : myConfig,
// 	height: 750,
// 	width: '75%'
// });

}
