angular
  .module('battleBookies')
  .controller('ArbController', ['$location', '$anchorScroll', ArbController])


function ArbController($location, $anchorScroll) {
  var vm = this;

  vm.goToId = function(id) {
    var old = $location.hash();
    $location.hash(id);
    $anchorScroll();
    $location.hash(old);
  };

}
