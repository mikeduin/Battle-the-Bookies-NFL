angular
  .module('battleBookies')
  .factory('authService', ['$http', '$window', authService])

function authService ($http, $window) {

    var auth = {};

    // Method saves JWT Token to local storage; btb-token functions as the unique key that we will read and write from. Note that if we ever change this key, everyone logged in will get logged out. Don't change unless you're intentionally changing to log everyone out.
    auth.saveToken = function(token) {
      $window.localStorage['btb-token'] = token;
    }

    // Method gets JWT Token from local storage
    auth.getToken = function() {
      return $window.localStorage['btb-token']
    }

    auth.isLoggedIn = function() {
      var token = auth.getToken();

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp = Date.now() / 1000;
      } else {
        return false;
      }
    }

    auth.currentUser = function() {
      if (auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        // This gets us the username of the currently logged in user from the payload
        return payload.username;
      }
    }

    auth.register = function(user) {
      return $http.post('/users/register', user)
      .success(function(data){
        auth.saveToken(data.token);
      })
    }

    auth.logIn = function(user) {
      return $http.post('/users/login', user)
      .success(function(data){
        auth.saveToken(data.token);
      }).error(function(response){
        return(response)
      })
    }

    auth.logOut = function() {
      $window.localStorage.removeItem('btb-token');
    }

    return auth;
}
