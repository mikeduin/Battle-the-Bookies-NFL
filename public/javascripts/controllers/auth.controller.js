angular
  .module('battleBookies')
  .controller('AuthController', ['$state', 'authService', 'usersService', AuthController])

function AuthController ($state, authService, usersService) {
  var vm = this;

  $(document).ready(function () {
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 20});
  })

  vm.currentUser = authService.currentUser();
  console.log(vm.currentUser);

  vm.register = function(user) {
    authService.register(user).error(function(error){
      vm.error = error.message;
    }).then(function(){
      $state.go('home.makepicks', {"season": 2018});
    })
  };

  vm.logIn = function(user) {
    authService.logIn(user).error(function(error){
      vm.error = error.message;
      console.log(error);
    }).then(function(){
      var username = user.username;
      usersService.getSeasonPlayers(2018).then(function(currentUsers){
        if (currentUsers.indexOf(username) == -1) {
          $state.go('home.userhistory', {"username": username});
        } else {
          $state.go('home.makepicks', {"season": 2018});
        };
      })
    })
  };

  vm.openModal = function(){
    $('#modal1').modal('open');
  };

  vm.closeModal = function(){
    $('#modal1').modal('close');
  };
}
