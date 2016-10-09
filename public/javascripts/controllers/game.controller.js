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
  vm.spreadRange = [];
  vm.dogMLRange = [];
  vm.favMLRange = [];
  vm.totalRange = [];
  vm.timeValues = [];
  vm.dateRangeLow;
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

  vm.getPickArrays = function() {
    gameService.getPickArrays(vm.EventID).then(function(result){
      vm.dogMLPicks = result[0].DogMLPickArray;
      vm.dogSpreadPicks = result[0].DogSpreadPickArray;
      vm.favMLPicks = result[0].FavMLPickArray;
      vm.favSpreadPicks = result[0].FavSpreadPickArray;
      vm.overPicks = result[0].OverPickArray;
      vm.underPicks = result[0].UnderPickArray;
      vm.noPicks = result[0].NoPickArray;

      console.log(vm.favSpreadPicks)
    })
  }

  vm.getLineData = function(){
    gameService.getLineData(vm.EventID).then(function(result){
      vm.game = result[0];
      console.log(vm.game);

      vm.dateRangeLow = moment(vm.game.MatchTime).day(0).hour(9).valueOf();
      vm.dateRangeHigh = moment(vm.game.MatchTime).valueOf();

      var spreadRangeMin = (vm.game.SpreadLow)-0.5;
      var spreadRangeLoopMax = (vm.game.SpreadHigh)+1;
      var spreadRange = [];

      for (i=spreadRangeMin; i<spreadRangeLoopMax; i+=0.5){
        vm.spreadRange.push(i)
      };

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
        vm.totalRange.push(i)
      };




      // vm.pickDistribution.scaleX.labels.push(vm.game.AwayAbbrev + '/' + vm.game.HomeAbbrev + ' Under', vm.game.AwayAbbrev + '/' + vm.game.HomeAbbrev + ' Over', vm.game.HomeAbbrev + ' ML', vm.game.AwayAbbrev + ' ML', vm.game.HomeAbbrev + ' Spread', vm.game.AwayAbbrev + ' Spread');
      //
      // vm.pickDistribution.series[0].values.push(vm.game.UnderPicks, vm.game.OverPicks, vm.game.MLHomePicks, vm.game.MLAwayPicks, vm.game.SpreadHomePicks, vm.game.SpreadAwayPicks);
      //
      // vm.pickDistribution.series[0].rules.push(
      //   {
      //       "rule":"%i==0",
      //       "background-color": "#838383"
      //   },
      //   {
      //       "rule":"%i==1",
      //       "background-color": "#2D2D2D"
      //   },
      //   {
      //       "rule":"%i==2",
      //       "background-color": vm.game.HomeColor
      //   },
      //   {
      //       "rule":"%i==3",
      //       "background-color": vm.game.AwayColor
      //   },
      //   {
      //       "rule":"%i==4",
      //       "background-color": vm.game.HomeColor
      //   },
      //   {
      //       "rule":"%i==5",
      //       "background-color": vm.game.AwayColor
      //   }
      // )
    })
  }

  // vm.pickDistribution = {
  //   "globals": {
  //     "font-family" : "Raleway"
  //   },
  //   "type": "hbar",
  //   "plotarea": {
  //     "adjust-layout":true
  //   },
  //   "scaleX": {
  //     "label":{ /* Scale Title */
  //     },
  //     "labels":[] /* Scale Labels */
  //   },
  //   "scaleY": {
  //     "label":{ /* Scale Title */
  //       "text":"Total Pool Selections",
  //     },
  //     "values": "0:40:5",
  //     "labels":[] /* Scale Labels */
  //   },
  //   "tooltip": {
  //     "text": "<b>%kl</b><br>%v Picks",
  //     "shadow": false,
  //     "font-color": "#e5ebeb",
  //     "border-color": "#ffffff",
  //     "border-width": "2px",
  //     "border-radius": "10px",
  //     "padding": "8px 15px"
  //   },
  //   "series": [
  //     {"values": [],
  //     "value-box": {
  //               "placement":"top-out",
  //               "text":"%v Picks",
  //               "decimals":0,
  //               "font-color":"#5E5E5E",
  //               "font-size":"14px",
  //               "alpha":0.6
  //           },
  //       "animation": {
  //           "delay": 100,
  //           "effect": "ANIMATION_EXPAND_BOTTOM",
  //           "speed": "1600",
  //           "method": "0",
  //           "sequence": "1"
  //       },
  //       "rules":[ ]
  //     }
  //     ]
  // }

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
            "height": "26.67%",
            "background-color":"#d44434",
            "images":[
                {
                    "src":"http://www.zingchart.com/resources/heart.png",
                    "x":"10px",
                    "y":"12px"
                }
            ],
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
                "height":"160px",
                "offset-y":"10px",
                "background-color":"#f75b48",
                "font-color":"#f0f0f0",
                "font-size":"60px",
                "text-align":"center",
                "text":"76"
            }
        },
        {
            "type":"line",
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
                    "background-color":"#ffffff"
                },
                "hover-state":{
                    "visible":false
                }
            },
            "utc" : true,
            "timezone" : vm.utcAdjust,
            "scale-x":{
                "transform": {
                  "type": "date",
                  "all": "%D<br>%m/%d/%y"
                },
                "min-value": vm.dateRangeLow,
                "max-value": vm.dateRangeHigh,
                "step": "day",
                "item":{
                    "font-color":"#fff"
                },
                "line-width":1,
                "line-color":"#d44434",
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1
                },
                "tick":{
                    "visible":false
                }
            },
            "scale-y":{
                "values": vm.spreadRange,
                "guide":{
                    "visible":false
                },
                "line-color":"none",
                "tick":{
                    "line-color":"none"
                },
                "item":{
                    "font-color":"#75251d",
                    "offset-x":"-10px"
                }
            },
            // "scale-y-2":{
            //     "values":"40:80:10",
            //     "guide":{
            //         "visible":false
            //     },
            //     "line-color":"none",
            //     "tick":{
            //         "line-color":"none"
            //     },
            //     "item":{
            //         "font-color":"#75251d",
            //         "offset-x":"10px"
            //     }
            // },
            "tooltip":{
                "text":"%v",
                "font-color":"#d44434",
                "font-size":"20px",
                "border-radius":"6px",
                "background-color":"#fff",
                "shadow":true,
                "padding":"10px"
            },
            "series":[
                {
                    "values": vm.myArray
                }
            ]
        },
        {
            "type":"null",
            "x":"2%",
            "y":"40%",
            "width":"15%",
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
            "images":[
                {
                    "src":"http://www.zingchart.com/resources/thermo.png",
                    "x":"10px",
                    "y":"12px"
                }
            ],
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
            "type":"line",
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
                "margin":"60 40 40 50",
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
                    "background-color":"#fff"
                },
                "hover-state":{
                    "visible":false
                }
            },
            "scale-x":{
                "values":["4:00","6:00"],
                "item":{
                    "font-color":"#fff"
                },
                "line-width":1,
                "line-color":"#969191",
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1
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
                    "font-color":"#4d4645",
                    "offset-x":"-20px"
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
                    "font-color":"#4d4645",
                    "offset-x":"10px"
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
                    "values":[98.9,99.5]
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
            "images":[
                {
                    "src":"http://www.zingchart.com/resources/thermo.png",
                    "x":"10px",
                    "y":"12px"
                }
            ],
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
            "type":"line",
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
                "margin":"60 40 40 50",
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
                    "background-color":"#fff"
                },
                "hover-state":{
                    "visible":false
                }
            },
            "scale-x":{
                "values":["4:00","6:00"],
                "item":{
                    "font-color":"#fff"
                },
                "line-width":1,
                "line-color":"#969191",
                "guide":{
                    "visible":true,
                    "line-style":"solid",
                    "line-width":1
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
                    "font-color":"#4d4645",
                    "offset-x":"-20px"
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
                    "values":[98.9,99.5]
                }
            ]
        },
        {
            "type":"grid",
            "x":"67%",
            "y":"3%",
            "width":"48%",
            "title":{
                "text":":: DEMOGRAPHICS",
                "font-size":"12px",
                "color":"#605958",
                "background-color":"#f9f9f9",
                "border-bottom":"1px solid #d6d6d6",
                "padding":"26 30 28 30"
            },
            // "shapes":[
            //     {
            //         "type":"square",
            //         "x":"94%",
            //         "y":"10px",
            //         "gradient-colors":"#f9f9f9 #f9f9f9 #d44434 #d44434",
            //         "gradient-stops":"0 0.5 0.5 1",
            //         "fill-angle":45,
            //         "size":7,
            //         "angle":-90
            //     }
            // ],
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

// zingchart.render({
// 	id : 'myChart',
// 	data : myConfig,
// 	height: 750,
// 	width: '75%'
// });

}
