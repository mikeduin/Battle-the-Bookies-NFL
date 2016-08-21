angular
  .module('battleBookies')
  .directive('sumUserWeek', [sumUserWeek])

function sumUserWeek () {

  function getDailyTotal (scope, element, attrs, controller) {

    scope.$watch('weeknumb', function(newValue, oldValue){
      controller.sumWeek(scope.user, scope.weeknumb).then(function(userDayTotal){
        console.log("scope.weeknumb is " + scope.weeknumb)
        scope.user.sumDay = userDayTotal;
      })
    })
  }

  return {
    controller: 'ResultController',
    controllerAs: 'vm',
    link: getDailyTotal,
    scope: {user: "=?", weeknumb: "=?"},
    template: "{{user.sumDay | currency:$:0}}"
  }
}
