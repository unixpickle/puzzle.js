var pyraminx = require('../../build/pyraminx.js');
var assert = require('assert');

function scrambleOfLength(len) {
  var scramble = [];
  while (len--) {
    scramble.push(new pyraminx.Move(Math.floor(Math.random()*4), Math.random()>=0.5));
  }
  return scramble;
}

function testSolve() {
  var heuristic = new pyraminx.EdgesHeuristic(7);
  // Solve a bunch of scrambles.
  for (var i = 0; i < 20; ++i) {
    var scramble = scrambleOfLength(100);
    var p = new pyraminx.Pyraminx();
    for (var j = 0; j < scramble.length; ++j) {
      p.move(scramble[j]);
    }
    var solution = pyraminx.solve(p, heuristic);
    assert.notEqual(solution, null);
    for (var j = 0; j < solution.length; ++j) {
      assert(!p.solved());
      p.move(solution[j]);
    }
    assert(p.solved());
  }
}

testSolve();
console.log('PASS');
