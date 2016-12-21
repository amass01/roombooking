(function (angular) {
  angular
    .module('roombooking.rooms')
    .controller('roomsController', roomsController);

  function roomsController(){
    var roomsCtrl = this;

    roomsCtrl.name = 'Amir';
  }
}(angular));