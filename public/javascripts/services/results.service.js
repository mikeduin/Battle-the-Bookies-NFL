angular
  .module('battleBookies')
  .factory('resultsService', ['$http', resultsService])

function resultsService ($http){
  return {
    updateResults: function() {
      return $http.get('/updateResults').then(function(){
        console.log("results updated")
      })
    },
    getNflResults: function() {
      return $http.get('/results').then(function(results){
        console.log(results.data);
        return results.data
      })
    }
  }
}
