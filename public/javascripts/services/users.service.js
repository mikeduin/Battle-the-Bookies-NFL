angular
  .module('battleBookies')
  .factory('usersService', ['$http', 'picksService', usersService])

function usersService ($http, picksService) {
  return {
    getAllUsers: function () {
      return $http.get('/users').then(function(users){
        return users.data
      })
    },
    getUser: function(username) {
      return $http.get('/users/' + username).then(function(user){
        return user.data
      })
    }
  }

}
