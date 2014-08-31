function Grid(size, previousState,emptytilepos) {
  this.size = size;
  this.sizex = 4;
  this.sizey = 4;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
  
  
}

Grid.prototype.FindEmptyCell = function(){
  var s = 0;
  
  for(var i=0;i<4;i++)
    for(var j=0;j<4;j++)
      if(this.cells[i][j] == null){
        console.log('empty cell ::: '+i+','+j);
        return {x:i,y:j};
      }
 
  
  //console.log(s)

};

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];
/*  for(var i=0;i<4;i++)
    for(var j=0;j<4;j++) {
      var tile = state[i][j];
      cells[i][j] = (tile ? new Tile(tile.position, tile.value) : null);
  }
*/

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }


  return cells;
};


Grid.prototype.GetThisCell = function (i) {
console.log('Get this Cell');
//var cell = {x:Math.floor(i/4),y:i%4};
var c = [];
c.push({x:Math.floor(i/4),y:i%4}); 
return c[0];
//return cell;

}

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

Grid.prototype.swapcells = function(src,dest){
  var tile = this.cells[src.x][src.y];
  this.cells[dest.x][dest.y] = tile;
  this.cells[src.x][src.y] = null;

}

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;

};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }
  
  /*for (var i=0;i<4;i++)
    for(var j=0; j<4;j++)
      cellstate[i][j] = this.cells[i][j].serialize();
*/
  return {
    size: this.size,
    cells: cellState
  };
};
