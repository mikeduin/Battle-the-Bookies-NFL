angular
  .module('battleBookies')
  .controller('AuthController', ['$state', 'authService', AuthController])

function AuthController ($state, authService) {
  var vm = this;

  vm.register = function(user) {
    console.log('user.buyin is ', user.buyin);
    console.log('user.plan is ', user.plan);
    if (user.buyin === undefined || user.plan === undefined) {
      vm.error = 'Please select your buy-in and pick plan.'
    } else {
      authService.register(user).error(function(error){
        vm.error = error.message;
      }).then(function(){
        $state.go('home.makepicks');
      });
    };
  };

  vm.logIn = function(user) {
    authService.logIn(user).error(function(error){
      vm.error = error.message;
      console.log(error);
    }).then(function(){
      $state.go('home.makepicks');
    })
  }
}
