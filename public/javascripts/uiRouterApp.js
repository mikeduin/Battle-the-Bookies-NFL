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
  .run(['$rootScope', '$document', function($rootScope, $document){
    $rootScope.$on('$stateChangeSuccess', function(){
      $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0
    })
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
          controller: 'ArbController',
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
          controller: 'ArbController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.makepicks', {
      url: 'makepicks/:season',
      views: {
        'content@': {
          templateUrl: 'views/makepicks.html',
          controller: 'PickController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.results', {
      url: 'weeklyresults/:season/:weekNumb',
      views: {
        'content@': {
          templateUrl: 'views/results.html',
          controller: 'ResultController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.results.picks', {
      url: '/picks',
      views: {
        'picks@home.results': {
          templateUrl: 'views/res-picks.html'
        }
      }
    })
    .state('home.results.poolsplits', {
      url: '/poolsplits',
      views: {
        'poolsplits@home.results': {
          templateUrl: 'views/res-poolsplits.html'
        }
      }
    })
    .state('home.standings', {
      url: 'standings/:season',
      views: {
        'content@': {
          templateUrl: 'views/standings.html',
          controller: 'StandingsController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.capper-grades', {
      url: 'capper-grades/:season',
      views: {
        'content@': {
          templateUrl: 'views/capper-grades.html',
          controller: 'capperController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.prizes', {
      url: 'prizes/:season',
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
    })
    .state('home.userhistory', {
      url: 'user/:username/history',
      views: {
        'content@': {
          templateUrl: 'views/userhistory.html',
          controller: 'UserController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.game', {
      url: 'game/:EventID',
      views: {
        'content@': {
          templateUrl: 'views/game.html',
          controller: 'GameController',
          controllerAs: 'vm'
        }
      }
    });
}
