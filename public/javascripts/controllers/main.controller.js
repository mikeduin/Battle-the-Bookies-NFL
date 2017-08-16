angular
  .module('battleBookies')
  .controller('MainController', ['$location', '$anchorScroll', MainController])


function MainController($location, $anchorScroll) {
  var vm = this;

  vm.goToId = function(id) {
    var old = $location.hash();
    $location.hash(id);
    $anchorScroll();
    $location.hash(old);
  };

}
