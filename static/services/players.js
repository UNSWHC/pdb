angular.module('hcPlayersService', ['ngResource'])

.service('playersService', function($resource) {
  this.resource = $resource('/_api/players/:id', {id: '@id'})
});