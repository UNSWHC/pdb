angular.module('hcPlayerBuilder', [
  'hcSearcher',
  'hcPlayersService'
])

.directive('hcPlayerBuilder', function() {
  var link = function(scope, element, attr) {
    scope.reset = function(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      scope.playerBuilder = {recordedYears: [scope.year]};
    };
    
    scope.reset();
    
    scope.onBuildPlayer = function(form, playerBuilder) {
      if (form.$invalid) {
        form.$setSubmitted();
        return;
      }
      scope.newPlayer({player: angular.copy(playerBuilder)});
      scope.reset(form);
    };

    scope.onFindPlayer = function(player) {
      var playerCopy = angular.copy(player);
      playerCopy.recordedYears.push(scope.year);
      scope.existingPlayer({player: playerCopy});
      scope.reset();
    };
  };

  return {
    templateUrl: '/_static/directives/player-builder/player-builder.html',
    restrict: 'E',
    scope: {
      year: '=hcYear',
      newPlayer: '&hcNewPlayer',
      existingPlayer: '&hcExistingPlayer'
    },
    link: link
  };
});