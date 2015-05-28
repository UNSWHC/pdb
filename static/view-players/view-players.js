angular.module('hcViewPlayers', [
  'ngRoute',
  'hcPlayersGrid',
  'hcPlayersService'
])

.config(function($locationProvider, $routeProvider) {
  $routeProvider.when('/players/view', {
    templateUrl:'/_static/view-players/view-players.html',
    controller:'ViewPlayersController'
  });
})

.controller('ViewPlayersController', function($scope, playersService) {
  $scope.players = playersService.resource.query();
});