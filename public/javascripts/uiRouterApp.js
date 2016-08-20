angular
  .module('battleBookies', [
    'ui.router',
    'ngAnimate',
    'zingchart-angularjs',
    'ui.validate',
    'angular-spinkit'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', siteConfig])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }])

function siteConfig ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'header': {
          templateUrl: 'views/header.html',
          controller: 'NavController',
          controllerAs: 'vm'
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
    .state('home.forgotpw', {
      url: 'forgot',
      views: {
        'content@': {
          templateUrl: 'views/forgotpw.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.resetpw', {
      url: 'reset',
      views: {
        'content@': {
          templateUrl: 'views/resetpw.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.tutorial', {
      url: 'tutorial',
      views: {
        'content@': {
          templateUrl: 'views/tutorial.html',
          controller: 'MainController',
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
    .state('home.results', {
      url: 'weeklyresults',
      views: {
        'content@': {
          templateUrl: 'views/results.html',
          controller: 'ResultController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.standings', {
      url: 'standings',
      views: {
        'content@': {
          templateUrl: 'views/standings.html',
          controller: 'StandingsController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.prizes', {
      url: 'prizes',
      views: {
        'content@': {
          templateUrl: 'views/prizes.html',
          controller: 'PrizesController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.user', {
      url: 'user/:username',
      views: {
        'content@': {
          templateUrl: 'views/user.html',
          controller: 'UserController',
          controllerAs: 'vm'
        }
      }
    });
    //
    // $locationProvider.html5Mode(true);
}
