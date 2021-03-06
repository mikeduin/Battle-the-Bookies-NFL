angular
  .module('battleBookies')
  .directive('updateLines', ['$interval', updateLines])

function updateLines ($interval) {

  function oneMinuteRefresh (scope, element, attrs, controller) {
    var refresh;

    function refreshLines () {
      controller.updateOdds();
      controller.getNflLines(scope.season);
    };

    scope.$watch(attrs.updateLines, function() {
      refreshLines();
    })

    refresh = $interval(function() {
      refreshLines();
    }, 120000);
  };

  return {
    scope: {
      season: '='
    },
    controller: 'PickController',
    controllerAs: 'vm',
    link: oneMinuteRefresh
  };
}
