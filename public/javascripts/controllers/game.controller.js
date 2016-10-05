angular
  .module('battleBookies')
  .controller('GameController', ['$stateParams', 'gameService', GameController])

function GameController ($stateParams, gameService) {
  var vm = this;
  vm.EventID = $stateParams.EventID;

  vm.getPickArrays = function() {
    gameService.getPickArrays(vm.EventID).then(function(result){
      console.log(result)
    })
  }

  vm.getLineData = function(){
    gameService.getLineData(vm.EventID).then(function(result){
      console.log(result)
    })
  }

}
