window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  //this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameStateLloyd";
  //this.bestMovesKey     ="bestMoves";
  this.bestKey          ="best";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};



LocalStorageManager.prototype.getBestScore = function () {
  var scoreJSON = this.storage.getItem(this.bestKey);
  return scoreJSON ? JSON.parse(scoreJSON) : null;
};

LocalStorageManager.prototype.setBestScore = function (bestscore) {
  this.storage.setItem(this.bestKey, JSON.stringify(bestscore));
};

LocalStorageManager.prototype.clearBestScores = function () {
  this.storage.removeItem(this.bestKey);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};
