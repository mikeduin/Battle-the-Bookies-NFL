angular
  .module('battleBookies')
  .controller('PrizesController', ['usersService', PrizesController])

function PrizesController (usersService) {
  var vm = this;
  vm.users = [];
  vm.baseTierTotal = 0;
  vm.silverBuyins = 0;
  vm.goldBuyins = 0;
  vm.bronzePool = 0;
  vm.silverPool = 0;
  vm.goldPool = 0;
  vm.bronzeFirst = 0;
  vm.bronzeSecond = 0;
  vm.bronzeThird = 0;
  vm.bronzeFourth = 0;
  vm.bronzeFifth = 0;
  vm.silverFirst = 0;
  vm.silverSecond = 0;
  vm.silverThird = 0;
  vm.silverFourth = 0;
  vm.silverFifth = 0;
  vm.goldFirst = 0;
  vm.goldSecond = 0;
  vm.goldThird = 0;
  vm.goldFourth = 0;

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result;
    })
  }

  vm.calculatePrizes = function(){
    usersService.getAllUsers().then(function(result){
      var users = result;
      vm.bronzePool = -320;
      vm.silverPool = 0;
      vm.goldPool = 0;
      for (i=0; i<users.length; i++) {
        if (users[i].buyin === '50') {
          vm.bronzePool += 50;
          if (users[i].plan !== 'noPlan') {
            vm.bronzePool += 20;
          };
        } else if (users[i].buyin === '100') {
          vm.bronzePool += 50;
          vm.silverPool += 50;
          if (users[i].plan !== 'noPlan') {
            vm.bronzePool += 10;
            vm.silverPool += 10;
          }
        } else if (users[i].buyin === '200') {
            vm.bronzePool += 50;
            vm.silverPool += 50;
            vm.goldPool += 100;
            if (users[i].plan !== 'noPlan') {
              vm.bronzePool += 5;
              vm.silverPool += 5;
              vm.goldPool += 10;
            }
        }
      };

      vm.bronzeFirst = (vm.bronzePool * 0.5);
      vm.bronzeSecond = (vm.bronzePool * 0.225);
      vm.bronzeThird = (vm.bronzePool * 0.15);
      vm.bronzeFourth = (vm.bronzePool * 0.1);
      vm.bronzeFifth = (vm.bronzePool * 0.025);

      vm.silverFirst = (vm.silverPool * 0.5);
      vm.silverSecond = (vm.silverPool * 0.275);
      vm.silverThird = (vm.silverPool * 0.15);
      vm.silverFourth = (vm.silverPool * 0.075);

      vm.goldFirst = (vm.goldPool * 0.5);
      vm.goldSecond = (vm.goldPool * 0.275);
      vm.goldThird = (vm.goldPool * 0.15);
      vm.goldFourth = (vm.goldPool * 0.075);
    })
  }
}
