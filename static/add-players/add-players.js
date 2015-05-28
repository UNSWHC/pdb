angular.module('hcAddPlayers', [
  'ngRoute',
  'hcPlayersGrid',
  'hcPlayersService',
  'hcPlayerBuilder'
])

.config(function($locationProvider, $routeProvider) {
  $routeProvider.when('/players/add', {
    templateUrl:'/_static/add-players/add-players.html',
    controller:'AddPlayersController',
    controllerAs:'addPlayersCtrl'
  });
})

.controller('AddPlayersController', function($scope, $location, playersService) {
  $scope.year = (new Date()).getFullYear();
  $scope.new = new PendingPlayers(playersService);
  $scope.existing = new PendingPlayers(playersService);
  
  this.addNewPlayer = function(player) {
    $scope.new.addPlayer(player);
  }
  
  this.addExistingPlayer = function(player) {
    $scope.existing.addPlayer(player);
  }
  
  this.saveAll = function() {
    $scope.new.saveAll();
    $scope.existing.saveAll();
  }
});