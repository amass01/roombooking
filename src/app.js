(function (angular) {

  angular.module('roombooking', [
    'ui.router',
    'roomsbooking.templates',
    'roombooking.welcome',
    'roombooking.rooms',
    'ui.bootstrap',
  ])
    .config(config);


  function config($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/welcome');
  }

})(angular);