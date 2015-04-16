var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testPhase2Heuristic() {
  var coords = new rubik.Phase2Coords();
  var heuristic = new rubik.Phase2Heuristic(coords);
  
  // Do random move sequences and ensure that the lower bound is never too high.
  for (var len = 0; len <= 18; ++len) {
    var count = 50;
    while (count--) {
      var cube = new rubik.Phase2Cube();
      var scramble = [];
      for (var i = 0; i < len; ++i) {
        var move = Math.floor(Math.random() * 10);
        cube.move(move, coords);
        scramble.push(move)
      };
      assert(heuristic.lowerBound(cube, coords) <= len, 'Invalid lower bound ' +
        heuristic.lowerBound(cube, coords) + ' for moves: ' + scramble);
    }
  }
}

testPhase2Heuristic();
console.log('PASS');
