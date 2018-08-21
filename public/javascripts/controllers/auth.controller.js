angular
  .module('battleBookies')
  .controller('AuthController', ['$state', 'authService', 'usersService', AuthController])

function AuthController ($state, authService, usersService) {
  var vm = this;

  $(document).ready(function () {
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 20});
  })

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
      var username = user.username;
      usersService.getCurrentPlayers().then(function(currentUsers){
        if (currentUsers.indexOf(username) == -1) {
          $state.go('home.userhistory', {"username": username});
        } else {
          $state.go('home.makepicks', {"season": 2018});
        };
      })
    })
  };

  // var getCurrentPlayers = function(){
  //   usersService.getCurrentPlayers().then(function(res){
  //     console.log('res from call is ', res);
  //     return res;
  //   })
  // };

  vm.openModal = function(){
    $('#modal1').modal('open');
  };

  vm.closeModal = function(){
    $('#modal1').modal('close');
  };
}
