(function (angular) {

  angular.module('roombooking.welcome', [])
    .config(config);


  function config($stateProvider) {
    $stateProvider.state('welcome', {
      url: '/welcome',
      templateUrl: 'views/welcome.html',
    });
  }

})(angular);