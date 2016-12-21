(function (angular) {

  angular.module('roombooking.rooms', [])
    .config(config);


  function config($stateProvider) {
    $stateProvider.state('rooms', {
      url: '/rooms',
      templateUrl: 'views/rooms.html',
      controller: 'roomsController',
      controllerAs: 'roomsCtrl'
    });
  }

})(angular);