angular.module('hcSearcher', ['hcPlayersService'])

.directive('hcSearcher', function(playersService) {
  var link = function(scope, element, attrs) {
    element.typeahead({
      items: 10,
      source: function(query, process) {
        playersService.resource.query({q: query}).$promise.then(function(result) {
          process(result);
          return result;
        });
      },
      displayText: function(player) {
        return player.firstName + ' ' + player.lastName;
      },
      afterSelect: function(player) {
        scope.$apply(function() {
          scope.choosePlayer({player: player});
        });
      }
    });
  };

  return {
    restrict: 'A',
    scope: {choosePlayer: '&hcChoosePlayer'},
    link: link
  };
});