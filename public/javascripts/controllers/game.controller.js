angular
  .module('battleBookies')
  .controller('GameController', ['$stateParams', 'gameService', GameController])

function GameController ($stateParams, gameService) {
  var vm = this;
  vm.EventID = $stateParams.EventID;

  vm.getPickArrays = function() {
    gameService.getPickArrays(vm.EventID).then(function(result){
      vm.dogMLPicks = result.DogMLPickArray;
      vm.dogSpreadPicks = result.DogSpreadPickArray;
      vm.favMLPicks = result.FavMLPickArray;
      vm.favSpreadPicks = result.FavSpreadPickArray;
      vm.overPicks = result.OverPickArray;
      vm.underPicks = result.UnderPickArray;
      vm.noPicks = result.NoPickArray;
    })
  }

  vm.getLineData = function(){
    gameService.getLineData(vm.EventID).then(function(result){
      vm.game = result[0];
      console.log(vm.game);
      vm.pickDistribution.scaleX.labels.push(vm.game.AwayAbbrev + '/' + vm.game.HomeAbbrev + ' Under', vm.game.AwayAbbrev + '/' + vm.game.HomeAbbrev + ' Over', vm.game.HomeAbbrev + ' ML', vm.game.AwayAbbrev + ' ML', vm.game.HomeAbbrev + ' Spread', vm.game.AwayAbbrev + ' Spread');

      vm.pickDistribution.series[0].values.push(vm.game.UnderPicks, vm.game.OverPicks, vm.game.MLHomePicks, vm.game.MLAwayPicks, vm.game.SpreadHomePicks, vm.game.SpreadAwayPicks);

      vm.pickDistribution.series[0].rules.push(
        {
            "rule":"%i==0",
            "background-color": "#838383"
        },
        {
            "rule":"%i==1",
            "background-color": "#2D2D2D"
        },
        {
            "rule":"%i==2",
            "background-color": vm.game.HomeColor
        },
        {
            "rule":"%i==3",
            "background-color": vm.game.AwayColor
        },
        {
            "rule":"%i==4",
            "background-color": vm.game.HomeColor
        },
        {
            "rule":"%i==5",
            "background-color": vm.game.AwayColor
        }
      )
    })
  }

  vm.pickDistribution = {
    "globals": {
      "font-family" : "Raleway"
    },
    "type": "hbar",
    "plotarea": {
      "adjust-layout":true
    },
    "scaleX": {
      "label":{ /* Scale Title */
      },
      "labels":[] /* Scale Labels */
    },
    "scaleY": {
      "label":{ /* Scale Title */
        "text":"Total Pool Selections",
      },
      "values": "0:40:5",
      "labels":[] /* Scale Labels */
    },
    "tooltip": {
      "text": "<b>%kl</b><br>%v Picks",
      "shadow": false,
      "font-color": "#e5ebeb",
      "border-color": "#ffffff",
      "border-width": "2px",
      "border-radius": "10px",
      "padding": "8px 15px"
    },
    "series": [
      {"values": [],
      "value-box": {
                "placement":"top-out",
                "text":"%v Picks",
                "decimals":0,
                "font-color":"#5E5E5E",
                "font-size":"14px",
                "alpha":0.6
            },
        "animation": {
            "delay": 100,
            "effect": "ANIMATION_EXPAND_BOTTOM",
            "speed": "1600",
            "method": "0",
            "sequence": "1"
        },
        "rules":[ ]
      }
      ]
  }

}
