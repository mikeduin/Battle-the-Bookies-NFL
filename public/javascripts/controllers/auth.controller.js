angular
  .module('battleBookies')
  .controller('AuthController', ['$state', 'authService', AuthController])

function AuthController ($state, authService) {
  var vm = this;

  vm.register = function(user) {
    authService.register(user).error(function(error){
      vm.error = error.message;
    }).then(function(){
      $state.go('home.makepicks');
    })
  };

  vm.logIn = function(user) {
    authService.logIn(user).error(function(error){
      vm.error = error.message;
      console.log(error)
    }).then(function(){
      $state.go('home.makepicks');
    })
  }
}
