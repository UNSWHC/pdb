angular.module('hc', [
  'ngRoute',
  'hcViewPlayer',
  'hcViewPlayers',
  'hcAddPlayers'
])

.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({
    redirectTo:'/players/view'
  });
});