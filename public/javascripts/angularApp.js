angular
  .module('battleBookies', [
    'ui.router',
    'ngAnimate'
  ])
  .config(['$stateProvider', '$urlRouterProvider', siteConfig])

function siteConfig ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'header': {
          templateUrl: 'views/header.html',
          controller: 'MainController'
        },
        'content': {
          templateUrl: 'views/content.html',
          controller: 'MainController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.login', {
      url: 'login',
      views: {
        'content@': {
          templateUrl: 'views/login.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.register', {
      url: 'register',
      views: {
        'content@': {
          templateUrl: 'views/register.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.makepicks', {
      url: 'makepicks',
      views: {
        'content@': {
          templateUrl: 'views/makepicks.html',
          controller: 'PickController',
          controllerAs: 'vm'
        }
      }
    })
}
