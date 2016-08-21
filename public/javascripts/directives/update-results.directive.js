angular
  .module('battleBookies')
  .directive('updateResults', ['$interval', updateResults])

function updateResults ($interval) {

  function thirtySecRefresh (scope, element, attrs, controller) {
    var refresh;

    function refreshResults () {
      controller.updateResults();
      controller.getNflLines();
    };

    scope.$watch(attrs.updateResults, function() {
      refreshResults();
    })

    refresh = $interval(function() {
      refreshResults();
    }, 30000)
  };

  return {
    controller: 'ResultController',
    controllerAs: 'vm',
    link: thirtySecRefresh

  };
}
