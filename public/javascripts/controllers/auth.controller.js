angular
  .module('battleBookies')
  .controller('AuthController', ['$state', 'authService', 'usersService', 'dateService', AuthController])

function AuthController ($state, authService, usersService, dateService) {
  var vm = this;

  $(document).ready(function () {
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 20});
  })

  vm.currentUser = authService.currentUser();
  vm.systemYear = dateService.fetchSystemYear();

  vm.register = function(user) {
    authService.register(user).error(function(error){
      vm.error = error.message;
    }).then(function(){
      $state.go('home.makepicks', {"season": vm.systemYear});
    })
  };

  vm.logIn = function(user) {
    authService.logIn(user).error(function(error){
      vm.error = error.message;
      console.log(error);
    }).then(function(){
      var username = user.username;
      usersService.getSeasonPlayers(vm.systemYear).then(function(currentUsers){
        if (currentUsers.indexOf(username) == -1) {
          $state.go('home.userhistory', {"username": username});
        } else {
          $state.go('home.makepicks', {"season": vm.systemYear});
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
