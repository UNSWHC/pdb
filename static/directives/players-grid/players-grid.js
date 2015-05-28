angular.module('hcPlayersGrid', [])

.directive('hcPlayersGrid', function($location) {  
  var controller = function($scope) {
    this.clickable = function() {
      return !!$scope.link;
    }
  }

  return {
    templateUrl: '/_static/directives/players-grid/players-grid.html',
    scope: {
      playersWithExtras: '=?hcPlayersWithExtras',
      players: '=?hcPlayers',
      link: '=?hcLink'
    },
    controller: controller
  };
})

.directive('hcPlayersGridRow', function($location) {
  var link = function(scope, element, attrs, gridController) {
    scope.latestYear = function(player) {
      return Math.max.apply(null, player.recordedYears);
    };

    scope.totalYears = function(player) {
      return player.recordedYears.length + player.unrecordedYears;
    };
    
    scope.clickable = function() {
      return gridController.clickable();
    };

    scope.rowClick = function() {
      if (!gridController.clickable()) {
        return;
      }
      $location.url('/players/view/' + scope.player.id);
    };
  };

  return {
    require: '^hcPlayersGrid',
    restrict: 'A',
    templateUrl: '/_static/directives/players-grid/players-grid-row.html',
    scope: {
      player: '=hcPlayer',
      actions: '=hcActions',
    },
    link: link,
    replace: true,
  };
});