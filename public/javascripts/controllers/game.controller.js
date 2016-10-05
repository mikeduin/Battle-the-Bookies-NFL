angular
  .module('battleBookies')
  .controller('GameController', ['$state', 'gameService', GameController])

function GameController ($state, gameService) {
  var vm = this;

  vm.getPickArrays = function(game) {
    gameService.getPickArrays(game.EventID)
  }

}
