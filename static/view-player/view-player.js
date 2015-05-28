angular.module('hcViewPlayer', [
  'ngRoute',
  'hcPlayersService'
])

.config(function($locationProvider, $routeProvider) {
  $routeProvider.when('/players/view/:id', {
    templateUrl:'/_static/view-player/view-player.html',
    controller:'ViewPlayerController'
  });
})

.controller('ViewPlayerController', function($scope, $routeParams, playersService) {
  $scope.player = playersService.resource.get($routeParams);
});