angular
  .module('battleBookies')
  .controller('GameController', ['$stateParams', 'gameService', GameController])

function GameController ($stateParams, gameService) {
  var vm = this;
  vm.EventID = $stateParams.EventID;
  vm.utcAdjust;
  vm.awayMLs = [];
  vm.homeMLs = [];
  vm.awaySpreads = [];
  vm.homeSpreads = [];
  vm.overs = [];
  vm.unders = [];
  vm.awaySpreadRange = [];
  vm.homeSpreadRange = [];
  vm.awayMLRange = [];
  vm.homeMLRange = [];
  vm.totalRange = [];
  vm.totalRangeRev = [];
  vm.timeValues = [];
  vm.homeSpreadChartValues = [];
  vm.homeSpreadJuices = [];
  vm.homeSpreadUsers = [];
  vm.homeSpreadAbbrevs = [];
  vm.homeSpreadInd = [];
  vm.awaySpreadChartValues = [];
  vm.awaySpreadJuices = [];
  vm.awaySpreadUsers = [];
  vm.awaySpreadAbbrevs = [];
  vm.awaySpreadInd = [];
  vm.homeMLChartValues = [];
  vm.homeMLActivePicks = [];
  vm.homeMLUsers = [];
  vm.awayMLChartValues = [];
  vm.awayMLActivePicks = [];
  vm.awayMLUsers = [];
  vm.overChartValues = [];
  vm.overJuices = [];
  vm.overUsers = [];
  vm.overActivePicks = [];
  vm.underChartValues = [];
  vm.underJuices = [];
  vm.underUsers = [];
  vm.underActivePicks = [];
  vm.dateRangeLow;
  vm.homeSpreadProg = [];
  vm.awaySpreadProg = [];
  vm.homeMLProg = [];
  vm.awayMLProg = [];
  vm.totalProg = [];
  vm.homeSpreadProgJuices = [];
  vm.homeProgAbbrevs = [];
  vm.homeProgInd = [];
  vm.awaySpreadProgJuices = [];
  vm.awayProgAbbrevs = [];
  vm.awayProgInd = [];
  vm.totalProgOverJuices = [];
  vm.totalProgUnderJuices = [];
  var masterPickArray = [];
  var capperGrades = [];
  var CGranks;
  var capperRanks = [];

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

      vm.myConfig.graphset[5].series[0].marker.backgroundColor = vm.homeColor;
      vm.myConfig.graphset[5].series[0].tooltip.fontColor = vm.homeColor;
      vm.myConfig.graphset[10].series[0].marker.backgroundColor = vm.homeColor;
      vm.myConfig.graphset[10].series[0].tooltip.fontColor = vm.homeColor;
      vm.myConfig.graphset[5].series[1].marker.backgroundColor = vm.awayColor;
      vm.myConfig.graphset[5].series[1].tooltip.fontColor = vm.awayColor;
      vm.myConfig.graphset[10].series[1].marker.backgroundColor = vm.awayColor;
      vm.myConfig.graphset[10].series[1].tooltip.fontColor = vm.awayColor;

      if (moment(vm.game.MatchTime).day() !== 0 && moment(vm.game.MatchTime).day() !== 1) {
        vm.dateRangeLow = moment(vm.game.MatchTime).day(0).hour(14).valueOf()
      } else {
        vm.dateRangeLow = moment(vm.game.MatchTime).day(-7).hour(14).valueOf()
      };

      vm.dateRangeHigh = moment(vm.game.MatchTime).valueOf();
      var extraDay = vm.dateRangeHigh + 80000001;

      for (i=vm.dateRangeLow; i<extraDay; i+=86400000){
        vm.timeValues.push(i)
      };

      var awaySpreadRangeMin = (vm.game.AwaySpreadWorst)-0.5;
      var awaySpreadRangeLoopMax = (vm.game.AwaySpreadBest)+1;
      var awaySpreadRange = [];

      for (i=awaySpreadRangeMin; i<awaySpreadRangeLoopMax; i+=0.5){
        vm.awaySpreadRange.push(i)
      };

      var homeSpreadRangeMin = (vm.game.HomeSpreadWorst)-0.5;
      var homeSpreadRangeLoopMax = (vm.game.HomeSpreadBest)+1;
      var homeSpreadRange = [];

      for (i=homeSpreadRangeMin; i<homeSpreadRangeLoopMax; i+=0.5){
        vm.homeSpreadRange.push(i)
      };

      var awayMLRangeMin = (vm.game.AwayMLWorst) - 15;
      var awayMLRangeMax = (vm.game.AwayMLBest) + 30;

      for (i=awayMLRangeMin; i<awayMLRangeMax; i+=15){
        vm.awayMLRange.push(i)
      };

      var homeMLRangeMin = (vm.game.HomeMLWorst) - 15;
      var homeMLRangeMax = (vm.game.HomeMLBest) + 30;

      for (i=homeMLRangeMin; i<homeMLRangeMax; i+=15){
        vm.homeMLRange.push(i)
      };

      var totalRangeMin = (vm.game.TotalLow) - 0.5;
      var totalRangeMax = (vm.game.TotalHigh) + 1;

      for (i=totalRangeMin; i<totalRangeMax; i+=0.5){
        vm.totalRange.push(i);
        vm.totalRangeRev.unshift(i);
      };

    }).then(function(){
      gameService.getPickArrays(vm.EventID).then(function(result){

        vm.awayMLPicks = result[0].AwayMLPickArray;
        vm.awaySpreadPicks = result[0].AwaySpreadPickArray;
        vm.homeMLPicks = result[0].HomeMLPickArray;
        vm.homeSpreadPicks = result[0].HomeSpreadPickArray;
        vm.overPicks = result[0].OverPickArray;
        vm.underPicks = result[0].UnderPickArray;
        vm.noPicks = result[0].NoPickArray;

        vm.awayMLPickPct = Math.round((vm.awayMLPicks.length/38)*100);
        vm.awaySpreadPickPct = Math.round((vm.awaySpreadPicks.length/38)*100);
        vm.homeMLPickPct = Math.round((vm.homeMLPicks.length/38)*100);
        vm.homeSpreadPickPct = Math.round((vm.homeSpreadPicks.length/38)*100);
        vm.overPickPct = Math.round((vm.overPicks.length/38)*100);
        vm.underPickPct = Math.round((vm.underPicks.length/38)*100);

        vm.homeAbbrev = vm.homeSpreadPicks[0].activePick.substr(0, vm.homeSpreadPicks[0].activePick.indexOf(' '));

        vm.awayAbbrev = vm.awaySpreadPicks[0].activePick.substr(0, vm.awaySpreadPicks[0].activePick.indexOf(' '));

        vm.myConfig.graphset[1].subtitle.fontColor = vm.homeColor;
        vm.myConfig.graphset[6].subtitle.fontColor = vm.homeColor;
        vm.myConfig.graphset[3].subtitle.fontColor = vm.awayColor;
        vm.myConfig.graphset[8].subtitle.fontColor = vm.awayColor;

        vm.myConfig.graphset[1].subtitle.text= "<div>" + vm.homeSpreadPickPct +"%</div>";
        vm.myConfig.graphset[2].title.text= "<div>" + vm.homeAbbrev +" SPREAD</div>";
        vm.myConfig.graphset[3].subtitle.text= "<div>" + vm.awaySpreadPickPct +"%</div>";
        vm.myConfig.graphset[4].title.text= "<div>" + vm.awayAbbrev +" SPREAD</div>";
        vm.myConfig.graphset[6].subtitle.text= "<div>" + vm.homeMLPickPct +"%</div>";
        vm.myConfig.graphset[7].title.text= "<div>" + vm.homeAbbrev +" ML</div>";
        vm.myConfig.graphset[8].subtitle.text= "<div>" + vm.awayMLPickPct +"%</div>";
        vm.myConfig.graphset[9].title.text= "<div>" + vm.awayAbbrev +" ML</div>";
        vm.myConfig.graphset[11].subtitle.text= "<div>" + vm.overPickPct +"%</div>";
        vm.myConfig.graphset[12].title.text= "<div>OVER TOTAL</div>";
        vm.myConfig.graphset[13].subtitle.text= "<div>" + vm.underPickPct +"%</div>";
        vm.myConfig.graphset[14].title.text= "<div>UNDER TOTAL</div>";

        for (i=0; i<vm.homeSpreadPicks.length; i++) {
          var unixTime = moment(vm.homeSpreadPicks[i].submittedAt).valueOf();
          var homeAbbrev = vm.homeSpreadPicks[i].activePick.substr(0, vm.homeSpreadPicks[i].activePick.indexOf(' '));

          var dogInd;
          if (vm.homeSpreadPicks[i].relevantLine>1) {
            dogInd = '+'
          } else {
            dogInd = ''
          };

          masterPickArray.push(vm.homeSpreadPicks[i]);
          vm.homeSpreadChartValues.push([unixTime, vm.homeSpreadPicks[i].relevantLine]);
          vm.homeSpreadJuices.push(vm.homeSpreadPicks[i].activeLine);
          vm.homeSpreadUsers.push(vm.homeSpreadPicks[i].username);
          vm.homeSpreadAbbrevs.push(homeAbbrev);
          vm.homeSpreadInd.push(dogInd);
        };

        for (i=0; i<vm.awaySpreadPicks.length; i++) {
          var unixTime = moment(vm.awaySpreadPicks[i].submittedAt).valueOf();
          var awayAbbrev = vm.awaySpreadPicks[i].activePick.substr(0, vm.awaySpreadPicks[i].activePick.indexOf(' '));

          var dogInd;
          if (vm.awaySpreadPicks[i].relevantLine>1) {
            dogInd = '+'
          } else {
            dogInd = ''
          };

          masterPickArray.push(vm.awaySpreadPicks[i]);
          vm.awaySpreadChartValues.push([unixTime, vm.awaySpreadPicks[i].relevantLine]);
          vm.awaySpreadJuices.push(vm.awaySpreadPicks[i].activeLine);
          vm.awaySpreadUsers.push(vm.awaySpreadPicks[i].username);
          vm.awaySpreadAbbrevs.push(awayAbbrev);
          vm.awaySpreadInd.push(dogInd);
        };

        for (i=0; i<vm.homeMLPicks.length; i++){
          var unixTime = moment(vm.homeMLPicks[i].submittedAt).valueOf();

          masterPickArray.push(vm.homeMLPicks[i]);
          vm.homeMLChartValues.push([unixTime, vm.homeMLPicks[i].relevantLine]);
          vm.homeMLActivePicks.push(vm.homeMLPicks[i].activePick);
          vm.homeMLUsers.push(vm.homeMLPicks[i].username);
        };

        for (i=0; i<vm.awayMLPicks.length; i++){
          var unixTime = moment(vm.awayMLPicks[i].submittedAt).valueOf();

          masterPickArray.push(vm.awayMLPicks[i]);
          vm.awayMLChartValues.push([unixTime, vm.awayMLPicks[i].relevantLine]);
          vm.awayMLActivePicks.push(vm.awayMLPicks[i].activePick);
          vm.awayMLUsers.push(vm.awayMLPicks[i].username);
        };

        for (i=0; i<vm.overPicks.length; i++){
          var unixTime = moment(vm.overPicks[i].submittedAt).valueOf();

          masterPickArray.push(vm.overPicks[i]);
          vm.overChartValues.push([unixTime, vm.overPicks[i].relevantLine]);
          vm.overActivePicks.push(vm.overPicks[i].activePick);
          vm.overJuices.push(vm.overPicks[i].activeLine);
          vm.overUsers.push(vm.overPicks[i].username);
        };

        for (i=0; i<vm.underPicks.length; i++){
          var unixTime = moment(vm.underPicks[i].submittedAt).valueOf();

          masterPickArray.push(vm.underPicks[i]);
          vm.underChartValues.push([unixTime, vm.underPicks[i].relevantLine]);
          vm.underActivePicks.push(vm.underPicks[i].activePick);
          vm.underJuices.push(vm.underPicks[i].activeLine);
          vm.underUsers.push(vm.underPicks[i].username);
        };

        return masterPickArray
      }).then(function(masterPickArray){

        for (var i=0; i<masterPickArray.length; i++) {
          capperGrades.push(masterPickArray[i].capperGrade);
        };

        var sortedCGs = capperGrades.slice().sort(function(a,b){return b-a});
        CGranks = capperGrades.slice().map(function(v){
          return sortedCGs.indexOf(v)+1
        });

        var loopLength = CGranks.length;

        for (var i=0; i<loopLength; i++){
          var min = Array.min(CGranks);
          var minIndex = CGranks.indexOf(min);

          capperRanks.push({
            "ranking": min,
            "capperGrade": capperGrades[minIndex],
            "username": masterPickArray[minIndex].username,
            "activePick": masterPickArray[minIndex].activePick,
            "activeLine": masterPickArray[minIndex].activeLine,
            "pickType": masterPickArray[minIndex].pickType
          });

          capperGrades.splice(minIndex, 1);
          CGranks.splice(minIndex, 1);
          masterPickArray.splice(minIndex, 1);
        };
      })
    }).then(function(){
      gameService.getLineMoves(vm.EventID).then(function(result){
        vm.lineMoves = result[0];

        for (var i=0; i<vm.lineMoves.TimeLogged.length; i++){
          var unixTime = moment(vm.lineMoves.TimeLogged[i]).valueOf();

          var awayDogInd;
          if (vm.lineMoves.AwaySpreads[i]>1) {
            awayDogInd = '+'
          } else {
            awayDogInd = ''
          };

          var homeDogInd;
          if (vm.lineMoves.HomeSpreads[i]>1) {
            homeDogInd = '+'
          } else {
            homeDogInd = ''
          };

          vm.homeSpreadProg.push([unixTime, vm.lineMoves.HomeSpreads[i]]);
          vm.homeSpreadProgJuices.push(vm.lineMoves.HomeSpreadJuices[i]);
          vm.homeProgAbbrevs.push(vm.lineMoves.HomeAbbrev);
          vm.homeProgInd.push(homeDogInd);

          vm.awaySpreadProg.push([unixTime, vm.lineMoves.AwaySpreads[i]]);
          vm.awaySpreadProgJuices.push(vm.lineMoves.AwaySpreadJuices[i]);
          vm.awayProgAbbrevs.push(vm.lineMoves.AwayAbbrev);
          vm.awayProgInd.push(awayDogInd);

          vm.awayMLProg.push([unixTime, vm.lineMoves.AwayMLs[i]]);

          vm.homeMLProg.push([unixTime, vm.lineMoves.HomeMLs[i]]);

          vm.totalProg.push([unixTime, vm.lineMoves.Totals[i]]);
          vm.totalProgOverJuices.push(vm.lineMoves.TotalOverJuices[i]);
          vm.totalProgUnderJuices.push(vm.lineMoves.TotalUnderJuices[i]);

        };

      })
    })
  }

  vm.myConfig = {
    "background-color":"#d6d6d6",
    "graphset":[
        {
            "type":"null",
            "x":"1%",
            "y":"2%",
            "width":"63%",
            "background-color":"#f9f9f9",
            "title":{
                "text":":: CHRONOLOGICAL SELECTION CHARTING",
                "font-size":"16px",
                "color":"#6D6D6D",
                "background-color":"#f9f9f9",
                "border-bottom":"1px solid #d6d6d6",
                "padding":"26 30 28 30"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"12.33%",
            "width":"15%",
            "height": "13%",
            "background-color":"#6D6D6D",
            "title":
            {
                "height":"40px",
                "text":"SPREAD",
                "font-size":"12px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#2D2D2D",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"40px"
            },
            "subtitle":{
                "html-mode": true,
                "offset-y":"10px",
                "background-color":"#6D6D6D",
                "font-size":"60px",
                "padding":"10 0 0 0",
                "alpha": 1
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"25.33%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#6D6D6D",
            "title":{
                "html-mode": true,
                "offset-y":"-18px",
                "background-color":"#6D6D6D",
                "font-color":"black",
                "font-size": "18px",
                "text-align":"center",
                "padding":"5 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"28.6%",
            "width":"15%",
            "height": "10%",
            "background-color":"#6D6D6D",
            "subtitle":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-45px",
                "background-color":"#6D6D6D",
                "font-size":"60px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"35.67%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#6D6D6D",
            "title":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-18px",
                "background-color":"#6D6D6D",
                "font-color":"white",
                "font-size": "18px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"mixed",
            "x":"16%",
            "y":"12.33%",
            "height":"26.67%",
            "width":"48%",
            "background-color":"#6D6D6D",
            "title":{
                "height":"40px",
                "text":"",
                "font-size":"10px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#2D2D2D",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"30px"
            },
            "plotarea":{
                "margin":"60 40 40 20"
            },
            "scale-x":{
                "values": vm.timeValues,
                "transform":{
                  "type":"date",
                  "all":"%D<br>%m/%d/%y"
                },
                "item":{
                    "font-color":"#2D2D2D"
                },
                "line-color":"#2D2D2D",
                "line-width":2,
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1,
                    "line-color": "#2D2D2D"
                },
                "tick":{
                    "visible":false
                }
            },
            "scale-y":{
                "values": vm.homeSpreadRange,
                "guide":{
                    "visible":false
                },
                "ref-line": {
                  "visible": false
                },
                "line-color":"black",
                "line-width": 2,
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"black",
                    "offset-x":"5px"
                },
                "label":{
                  "text": "Home Spread",
                  "font-color": "black",
                  "offset-x": "10px"
                }
            },
            "scale-y-2":{
                "values": vm.awaySpreadRange,
                "guide":{
                    "visible":false
                },
                "ref-line": {
                  "visible": false
                },
                "line-color": "white",
                "line-width": 2,
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"white",
                    "offset-x":"-5px"
                },
                "label":{
                  "text": "Away Spread",
                  "font-color": "white",
                  "offset-x": "-10px"
                }
            },
            "series":[
                {
                  "type": "scatter",
                  "values": vm.homeSpreadChartValues,
                  "data-username": vm.homeSpreadUsers,
                  "data-submitted": vm.homeSpreadTimes,
                  "data-juice": vm.homeSpreadJuices,
                  "data-homeAbbrev": vm.homeSpreadAbbrevs,
                  "data-dogInd": vm.homeSpreadInd,
                  "marker":{
                    "border-color":"black",
                    "border-width": 2,
                    "background-repeat":"no-repeat",
                    "shadow":false,
                    "size": 9
                  },
                  "z-index": 2,
                  "scales": "scale-x, scale-y",
                  "tooltip":{
                      "text": "%data-homeAbbrev %data-dogInd%v (%data-juice)<br>%data-username",
                      "font-size":"20px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"10px"
                  },
                },
                {
                  "values": vm.awaySpreadChartValues,
                  "type": "scatter",
                  "data-username": vm.awaySpreadUsers,
                  "data-submitted": vm.awaySpreadTimes,
                  "data-juice": vm.awaySpreadJuices,
                  "data-awayAbbrev": vm.awaySpreadAbbrevs,
                  "data-dogInd": vm.awaySpreadInd,
                  "marker":{
                    "border-color":"white",
                    "background-repeat":"no-repeat",
                    "border-width": 2,
                    "shadow":false,
                    "size": 9
                  },
                  "z-index": 2,
                  "scales": "scale-x, scale-y-2",
                  "tooltip":{
                      "text": "%data-awayAbbrev %data-dogInd%v (%data-juice)<br>%data-username",
                      "font-size":"20px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"10px"
                  },
                },
                {
                    "values": vm.homeSpreadProg,
                    "data-abbrev": vm.homeProgAbbrevs,
                    "data-dogInd": vm.homeDogInd,
                    "type": "line",
                    "line-color": "black",
                    "z-index": 1,
                    "marker": {
                      "visible": false
                    },
                    "aspect": "spline",
                    "scales": "scale-x, scale-y",
                    "tooltip":{
                        "text":"%data-abbrev %data-dogInd%v",
                        "font-color":"#6D6D6D",
                        "font-size":"14px",
                        "border-radius":"6px",
                        "background-color":"#fff",
                        "shadow":true,
                        "padding":"5px"
                    },
                },
                {
                    "values": vm.awaySpreadProg,
                    "type": "line",
                    "line-color": "white",
                    "aspect": "spline",
                    "scales": "scale-x, scale-y-2"
                }
            ]
        },
        {
            "type":"null",
            "x":"1%",
            "y":"39%",
            "width":"15%",
            "height": "13.33%",
            "background-color":"#969191",
            "title":{
                "height":"40px",
                "text":"MONEYLINE",
                "font-size":"12px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#444444",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"40px"
            },
            "subtitle":{
                "height":"145px",
                "offset-y":"15px",
                "background-color":"#969191",
                "font-color":"#f0f0f0",
                "font-size":"60px",
                "text-align":"center",
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"52.33%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#969191",
            "title":{
                "html-mode": true,
                "offset-y":"-22px",
                "background-color":"#969191",
                "font-color":"black",
                "font-size": "18px",
                "text-align":"center",
                "padding":"5 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"56.7%",
            "width":"15%",
            "height": "10%",
            "background-color":"#969191",
            "subtitle":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-55px",
                "background-color":"#969191",
                "font-size":"60px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"66.7%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#969191",
            "title":{
                "html-mode": true,
                "height":"100%",
                "offset-y":"-60px",
                "background-color":"#969191",
                "font-color":"white",
                "font-size": "18px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"mixed",
            "x":"16%",
            "y":"39%",
            "height":"26.67%",
            "width":"48%",
            "background-color":"#969191",
            "title":{
                "height":"40px",
                "font-size":"10px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#444444",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"30px"
            },
            "plotarea":{
                "margin":"60 40 40 20",
                "background-color":"#969191"
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
                "line-color":"#6D6D6D",
                "line-width": 2,
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1,
                    "line-color": "#6D6D6D"
                },
                "tick":{
                    "visible":false
                }
            },
            "scale-y":{
                "values": vm.homeMLRange,
                "guide":{
                    "visible":false
                },
                "ref-line": {
                  "visible": false
                },
                "line-color":"black",
                "line-width": 2,
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"black",
                    "offset-x":"5px"
                },
                "label":{
                  "text": "Home ML",
                  "font-color": "black",
                  "offset-x": "10px"
                }
            },
            "scale-y-2":{
                "values": vm.awayMLRange,
                "guide":{
                    "visible":false
                },
                "ref-line": {
                  "visible": false
                },
                "line-color":"white",
                "line-width": 2,
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"white",
                    "offset-x":"-5px"
                },
                "label":{
                  "text": "Away ML",
                  "font-color": "white",
                  "offset-x": "-10px"
                }
            },
            "series":[
              {
                  "values": vm.homeMLChartValues,
                  "type": "scatter",
                  "data-username": vm.homeMLUsers,
                  "data-submitted": vm.homeMLTimes,
                  "data-activePicks": vm.homeMLActivePicks,
                  "marker":{
                    "border-color":"black",
                    "background-repeat":"no-repeat",
                    "shadow":false,
                    "size": 9,
                    "border-width": 2
                  },
                  "z-index": 2,
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
                "values": vm.awayMLChartValues,
                "type": "scatter",
                "data-username": vm.awayMLUsers,
                "data-submitted": vm.awayMLTimes,
                "data-activePicks": vm.awayMLActivePicks,
                "marker":{
                  "border-color":"white",
                  "background-repeat":"no-repeat",
                  "shadow":false,
                  "size": 9,
                  "border-width": 2
                },
                "z-index": 2,
                "scales": "scale-x, scale-y-2",
                "tooltip":{
                    "text":"%data-activePicks<br>%data-username",
                    "font-size":"20px",
                    "border-radius":"6px",
                    "background-color":"#fff",
                    "shadow":true,
                    "padding":"10px"
                },
              },
              {
                "values": vm.homeMLProg,
                "data-abbrev": vm.homeProgAbbrevs,
                "data-dogInd": vm.homeProgInd,
                "type": "line",
                "line-color": "black",
                "z-index": 1,
                "marker": {
                  "visible": false
                },
                "aspect": "spline",
                "scales": "scale-x, scale-y",
                "tooltip":{
                    "text":"%data-abbrev %data-dogInd%v",
                    "font-color":"#6D6D6D",
                    "font-size":"14px",
                    "border-radius":"6px",
                    "background-color":"#fff",
                    "shadow":true,
                    "padding":"5px"
                },
              },
              {
                  "values": vm.awayMLProg,
                  "data-abbrev": vm.awayProgAbbrevs,
                  "data-dogInd": vm.awayProgInd,
                  "type": "line",
                  "line-color": "white",
                  "z-index": 1,
                  "marker": {
                    "visible": false
                  },
                  "aspect": "spline",
                  "scales": "scale-x, scale-y-2",
                  "tooltip":{
                      "text":"%data-abbrev %data-dogInd%v",
                      "font-color":"#6D6D6D",
                      "font-size":"14px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"5px"
                  },
              }
            ]
        },
        {
            "type":"null",
            "x":"1%",
            "y":"65.67%",
            "width":"15%",
            "height": "10%",
            "background-color":"#68A870",
            "title":{
                "height":"40px",
                "text":"TOTAL",
                "font-size":"12px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#2F5032",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"40px"
            },
            "subtitle":{
                "height":"145px",
                "offset-y":"15px",
                "background-color":"#68A870",
                "font-color":"#f0f0f0",
                "font-size":"60px",
                "text-align":"center"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"79%",
            "width":"15%",
            "height": "3.335%",
            "background-color":"#68A870",
            "title":{
                "html-mode": true,
                "offset-y":"-20px",
                "background-color":"#68A870",
                "font-color":"#E8E8E8",
                "font-size": "18px",
                "text-align":"center",
                "padding":"5 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"82.335%",
            "width":"15%",
            "height": "10%",
            "background-color":"#68A870",
            "subtitle":{
                "html-mode": true,
                "offset-y":"-40px",
                "background-color":"#68A870",
                "font-color":"black",
                "font-size":"60px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"null",
            "x":"1%",
            "y":"92.335%",
            "width":"15%",
            "height": "0.1%",
            "background-color":"#68A870",
            "title":{
                "html-mode": true,
                "offset-y":"-45px",
                "background-color":"#68A870",
                "font-color":"#2D2D2D",
                "font-size": "18px",
                "text-align":"center",
                "padding":"0 0 0 0"
            }
        },
        {
            "type":"mixed",
            "x":"16%",
            "y":"65.67%",
            "height":"26.67%",
            "width":"48%",
            "background-color":"#68A870",
            "title":{
                "height":"40px",
                "text":"",
                "font-size":"10px",
                "text-align":"left",
                "color":"#fff",
                "background-color":"#2F5032",
                "border-bottom":"1px solid #d6d6d6",
                "padding-left":"30px"
            },
            "plotarea":{
                "margin":"60 40 40 20",
                "background-color":"#68A870"
            },
            "plot":{
                "line-color":"#fff",
                "marker":{
                    "type":"circle",
                    "background-color":"#68A870",
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
                    "font-color":"#2F5032"
                },
                "line-width":2,
                "line-color":"#2F5032",
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1,
                    "line-color": "#2F5032"
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
                "ref-line": {
                  "visible": false
                },
                "line-color":"black",
                "line-width": 2,
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"black",
                    "offset-x":"5px"
                },
                "label":{
                  "text": "Total Under",
                  "font-color": "black",
                  "offset-x": "10px"
                }
            },
            "scale-y-2":{
                "values": vm.totalRangeRev,
                "guide":{
                    "visible":false
                },
                "ref-line": {
                  "visible": false
                },
                "line-color":"white",
                "line-width": 2,
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"white",
                    "offset-x":"-5px"
                },
                "label":{
                  "text": "Total Over",
                  "font-color": "white",
                  "offset-x": "-10px"
                }
            },
            "tooltip":{
                "text":"%v",
                "font-color":"#6D6D6D",
                "font-size":"20px",
                "border-radius":"6px",
                "background-color":"#fff",
                "shadow":true,
                "padding":"10px"
            },
            "series":[
              {
                  "values": vm.overChartValues,
                  "type": "scatter",
                  "data-username": vm.overUsers,
                  "data-submitted": vm.overTimes,
                  "data-activePicks": vm.overActivePicks,
                  "data-juice": vm.overJuices,
                  "marker":{
                    "border-color":"white",
                    "background-color": "#E8E8E8",
                    "background-repeat":"no-repeat",
                    "shadow":false,
                    "size": 9
                  },
                  "z-index": 2,
                  "scales": "scale-x, scale-y-2",
                  "tooltip":{
                      "text": "%data-activePicks (%data-juice)<br>%data-username",
                      "font-size":"20px",
                      "border-radius":"6px",
                      "background-color":"#fff",
                      "shadow":true,
                      "padding":"10px"
                  },
              },
              {
                "values": vm.underChartValues,
                "type": "scatter",
                "data-username": vm.underUsers,
                "data-submitted": vm.underTimes,
                "data-activePicks": vm.underActivePicks,
                "data-juice": vm.underJuices,
                "marker":{
                  "border-color":"black",
                  "background-color": "#2D2D2D",
                  "background-repeat":"no-repeat",
                  "shadow":false,
                  "size": 9
                },
                "z-index": 2,
                "scales": "scale-x, scale-y",
                "tooltip":{
                    "text":"%data-activePicks (%data-juice)<br>%data-username",
                    "font-size":"20px",
                    "border-radius":"6px",
                    "background-color":"#fff",
                    "shadow":true,
                    "padding":"10px"
                },
              },
              {
                  "values": vm.totalProg,
                  "type": "line",
                  "line-color": "black",
                  "marker": {
                    "border-color":"#fff",
                    "background-color": "black",
                    "border-width": 1,
                    "size": 10
                  },
                  "aspect": "spline",
                  "scales": "scale-x, scale-y"
              },
              {
                  "values": vm.totalProg,
                  "type": "line",
                  "line-color": "white",
                  "marker": {
                    "border-color":"#fff",
                    "background-color": "black",
                    "border-width": 1,
                    "size": 10
                  },
                  "aspect": "spline",
                  "scales": "scale-x, scale-y-2"
              }
            ]
        },
        {
            "type":"grid",
            "x":"65%",
            "y":"2%",
            "width":"33%",
            "title":{
                "text":":: TOP CAPPER GRADES",
                "font-size":"16px",
                "color":"#6D6D6D",
                "background-color":"#f9f9f9",
                "border-bottom":"1px solid #d6d6d6",
                "padding":"26 30 28 30"
            },
            "plotarea":{
                "margin":"70 0 0 0"
            },
            "options":{
                "header-row":false,
                "col-widths":["35%","65%"],
                "style":{
                    ".tr":{
                        "border-width":"0px",
                        "border-bottom":"0px",
                        "padding":"24 10 19 10",
                        "height":67
                    },
                    ".tr_even":{
                        "background-color":"#fcfcfc"
                    },
                    ".tr_odd":{
                        "background-color":"#f9f9f9"
                    },
                    ".td_0":{
                        "align":"right",
                        "font-color":"#969191"
                    },
                    ".td_1":{
                        "font-weight":"bold"
                    }
                }
            },
            "series":[
                {
                    "values":["NAME","John Smith"]
                },
                {
                    "values":["GENDER","Male"]
                },
                {
                    "values":["AGE","30"]
                },
                {
                    "values":["HEIGHT","6 ft."]
                },
                {
                    "values":["WEIGHT","180 lbs."]
                },
                {
                    "values":["CITY","Chicago"]
                }
            ]
        }
    ]
};

}
