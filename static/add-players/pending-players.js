var PendingPlayers = function(playersService) {
  var self = this;
  this.playersService_ = playersService;
  this.data = [];
  
  this.actions = {
    DELETE: {
      classes: ['btn', 'btn-default', 'btn-sm'],
      glyphiconClasses: ['glyphicon-trash'],
      perform: function(player) {
        var index = self.indexFromPlayer(player);
        if (index < 0) {
          return;
        }
        self.data.splice(index, 1);
      }
    },
    SAVING: {
      classes: ['text-primary'],
      glyphiconClasses: ['glyphicon-refresh', 'spin']
    },
    RETRY: {
      classes: ['btn', 'btn-danger', 'btn-sm'],
      glyphiconClasses: ['glyphicon-repeat'],
      text: 'Retry',
      perform: function(player) {
        var index = self.indexFromPlayer(player);
        if (index < 0) {
          return;
        }
        self.save(index);
      }
    },
    SUCCESS: {
      classes: ['text-success'],
      glyphiconClasses: ['glyphicon-ok']
    }
  };
};

PendingPlayers.state = {
  INITIAL: 0,
  SAVING: 1,
  FAILED: 2,
  SAVED: 3
};

PendingPlayers.prototype.any = function() {
  return this.data.length > 0;
}

PendingPlayers.prototype.indexFromPlayer = function(player) {
  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i].player == player 
        || this.data[i].player.id == player.id) {
      return i;
    }
  }
  return -1;
};

PendingPlayers.prototype.addPlayer = function(player) {
  if (this.indexFromPlayer(player) >= 0) {
    return;
  }
  this.data.push({
    player: player,
    actions: [this.actions.DELETE],
    state: PendingPlayers.state.INITIAL
  });
};

PendingPlayers.prototype.save = function(index) {
  var self = this;
  var datum = this.data[index];
  if (datum.state == PendingPlayers.state.SAVING
      || datum.state == PendingPlayers.state.SAVED) {
    return;
  }
  
  datum.state = PendingPlayers.state.SAVING;
  datum.actions = [this.actions.SAVING];
  
  var params = {
    id: datum.player.id
  };
  
  var success = function(value, responseHeaders) {
    datum.status = PendingPlayers.state.SAVED;
    datum.actions = [self.actions.DELETE, self.actions.SUCCESS];
  };
  
  var error = function(httpResponse) {
    datum.state = PendingPlayers.state.FAILED;
    datum.actions = [self.actions.DELETE, self.actions.RETRY];
  };

  this.playersService_.resource.save(params, datum.player, success, error);
}

PendingPlayers.prototype.saveAll = function() {
  for (var i = 0; i < this.data.length; i++) {
    this.save(i);
  }
}