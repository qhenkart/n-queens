/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = [];
  for(var i = 0; i < n; i++){
    var row = [];
    for(var j = 0; j < n; j++){
      if(j === i){
        row.push(1);
      }else{
        row.push(0);
      }
    }
    solution.push(row);
  }


  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 1;

  for (var i = 1; i <= n; i++) {
    solutionCount *= i;
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n, countN) {

  var solution = makeEmptyBoard(n);
  var solutionCount = 0;
  var board = makeEmptyBoard(n);
  var takenColumns = arrayMaker(0, n);
  var takenMinor = arrayMaker(0, n + n - 1);
  //make offset to account for different counting pattern.. n-1  or -3 -- +3 offset to equal 0 - 7
  //col - row + n-1
  var takenMajor = arrayMaker(0, n + n - 1);

  var queenMaker = function(queenCount){
    if (queenCount === 0){
      solution = copyMachine(board);
      solutionCount++;
      return;
    }
    var row = n - queenCount;

    for (var i = 0; i < n; i++){
      var placeable = true;
      var majorD = i - row + n -1;   //formula for major diagonal
      var minorD = i + row;    // i = column   row = row   n = length
      if(takenColumns[i]){
        placeable = false;
      }
      if(takenMajor[majorD]){
        placeable = false;
      }
      if(takenMinor[minorD]){
        placeable = false;
      }
      if(placeable){
        board[row][i] = 1;
        takenColumns[i] = 1;
        takenMajor[majorD] = 1;
        takenMinor[minorD] = 1;
        queenMaker(queenCount - 1);
        board[row][i] = 0;
        takenColumns[i] = 0;
        takenMajor[majorD] = 0;
        takenMinor[minorD] = 0;
      }
    }

  };
  queenMaker(n);


  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  if (countN){
    return solutionCount;
  }
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {

  return bitSolver(n);

};


var arrayMaker = function(value, length){
  var result = [];
  for (var i = 0; i < length; i++){
    result.push(value);
  }
  return result;
};


var makeEmptyBoard = function(n){
  var board = [];

  for (var i = 0; i < n; i++){
    var row = [];
    for (var j = 0; j < n; j++){
      row.push(0);
    }
    board.push(row);
  }
  return board;
};

var copyMachine = function(array){
  var copied = makeEmptyBoard(array.length);

  for(var i = 0; i < array.length; i++){
    for( var j=0; j < array.length; j++){
      copied[i][j] = array[i][j];
    }
  }
  return copied;
};

var bitSolver = function(n){

  var solutionCount = 0;

  var takenColumns = ~0;
  var takenMinor = ~0;
  var takenMajor = ~0;


  var queenMaker = function(queenCount){
    if (!queenCount){
      solutionCount++;
      return;
    }



    for (var pointerMarker = 1 << 14; pointerMarker < 1 << 14 + n; pointerMarker = pointerMarker << 1){

      if(takenColumns & takenMinor & takenMajor & pointerMarker){


        takenColumns = takenColumns & (~pointerMarker);
        takenMajor = takenMajor & (~pointerMarker);
        takenMinor = takenMinor & (~pointerMarker);

        takenMajor = takenMajor >> 1;
        takenMinor = takenMinor << 1;


        queenMaker(queenCount - 1);

        takenMajor = takenMajor << 1;
        takenMinor = takenMinor >> 1;

        takenColumns = takenColumns | pointerMarker;
        takenMajor = takenMajor | pointerMarker;
        takenMinor = takenMinor | pointerMarker;

      }


    }

  };
  queenMaker(n);


  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solutionCount));

  return solutionCount;
};


