function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  //helper object
  this.helper = new Helper;

  this.startTiles     = 15;


  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  //this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  console.log('sdfojsdf')
  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  
  this.actuator.continueGame(); // Clear the game won/lost message
  //this.setup();
  this.startnewgame();
};

GameManager.prototype.startnewgame = function (){
  console.log('Newgame')
    this.grid        = new Grid(this.size);
    this.score       = {
  'moves': 0, 'value': 0,
  
};
    this.movecount = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
     // Update the actuator
    this.actuate();
  
}
// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  var v = this.over || (this.won && !this.keepPlaying);
  console.log(v);
  return v;
};

// Set up the game
GameManager.prototype.setup = function () {
  //this.storageManager.clearGameState();
  //with the page number as a parameter dataType: "html", //expect html to be returned success: function(msg){

  var previousState = this.storageManager.getGameState();
  

  var json = this.storageManager.getBestScore();
  this.bestscore = json ? json:{moves:0,value:0};
  this.movecount = 0;
  console.log('this.bestscore :: '+this.bestscore.moves)


  // Reload the game from a previous game if present
  if (previousState) {
    console.log('From previous state')
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    console.log("LolF")

    this.grid        = new Grid(this.size);
    this.score       = {'value':0,'moves':0};
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }

  this.score.moves -=1;
  this.updatescore();

  // Update the actuator
  this.actuate();
};


// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
console.log("add start tiles ")



var newlist = new Array(15);
newlist  = this.helper.generateQuestion(newlist);
   this.addtilelist(newlist);
 
};

GameManager.prototype.addtilelist = function(list) {
for (var i=0;i<list.length;i++) {
     if(list[i] != -1) {
      console.log(Math.floor(i/4)+','+i%4+' '+list[i])
      this.grid.insertTile(new Tile({x:Math.floor(i/4),y:i%4}, list[i]+1));
      }
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 1 : 3;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
    console.log('clear gamestate')
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.bestscore,
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      //tile.mergedFrom = null;
      tile.swappedFrom = null
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;
  if (this.isGameTerminated()) return; // Don't do anything if the game's over
  console.log("moving")


  var cell, tile;

  var vector     = this.getVector(direction);
//  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove swap information
  this.prepareTiles();

   

    console.log("Getting to tile")
    var cell = this.grid.FindEmptyCell();
    console.log('cell :: '+cell.x+','+cell.y)

    var nextpos = this.findNextPosition(cell, vector);
    console.log('next pos ::: '+nextpos.next.x+','+nextpos.next.y)
    console.log('cell pos ::: '+cell.x+','+cell.y)

    if (nextpos.next.x == cell.x && nextpos.next.y == cell.y ) {
        console.log('Cant move')
        return;
    }
    
    var tile = self.grid.cellContent(nextpos.next);
    var value = tile.value;
    console.log('value' + value)
    this.grid.swapcells(nextpos.next,cell)
    this.grid.removeTile(tile)
    this.grid.insertTile(new Tile({x:cell.x,y:cell.y},value));


    this.updatescore();
    

    if(this.goalreached() == true) {
      console.log('goalreached')
        this.won = true;
        
    }
   

    this.actuate();
    console.log('-------------DONE --------------------------')
  
};
GameManager.prototype.updatescore = function(){
  //Number of correct guys 
  //Number of moves 
  this.score.value = 0;
  this.score.moves +=1;
  console.log('Updating score')
  

  for(var i=0;i<4;i++)
    for(var j=0;j<4;j++)
      if(this.grid.cells[i][j] == null) {
        continue;
      } else {
        if(this.grid.cells[i][j].value == (4*i+j+1)){
          this.score.value += 1;
          console.log('score ::: '+this.score.moves+','+this.score.value)
          }
        
      }

      this.bestscore.moves = this.bestscore.value>this.score.value ?this.bestscore.moves:this.score.moves;
      this.bestscore.value = this.bestscore.value>this.score.value ?this.bestscore.value:this.score.value;
      console.log("Best :: "+this.bestscore.moves)
      console.log("Best :: "+this.bestscore.value)


};

GameManager.prototype.goalreached = function (){
  if (this.score.value == 15)
    return true;
  return false;


};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};



// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};
GameManager.prototype.findNextPosition = function (cell, vector) {
  var previousemptycell,newemptycell;
  //find the nearest nieighbour
  previousemptycell = cell;
  newemptycell = {x:0,y:0};
  console.log('previousemptycell :: '+previousemptycell.x+', '+previousemptycell.y);
  
  
  if(((previousemptycell.x-vector.x)<4) && (previousemptycell.y-vector.y)<4 && (previousemptycell.x-vector.x)>=0 && (previousemptycell.y-vector.y)>=0){
    newemptycell.x = previousemptycell.x-vector.x;
    newemptycell.y = previousemptycell.y-vector.y;

    return {next:newemptycell};
  }
  return {next:previousemptycell};

};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
