var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkPhase2Heuristic() {
  var coords = new rubik.Phase2Coords();
  bench('Phase2Heuristic', function(count) {
    while (count--) {
      new rubik.Phase2Heuristic(coords);
    }
  });
}

function benchmarkPhase2LowerBound() {
  var coords = new rubik.Phase2Coords();
  var heuristic = new rubik.Phase2Heuristic(coords);

  // Generate a semi-scrambled cube to test with.
  var cube = new rubik.Phase2Cube();
  var cubes = [];
  for (var i = 0; i < 10; ++i) {
    cube.move(i, coords);
    var c = new rubik.Phase2Cube();
    c.set(cube);
    cubes.push(c);
  }

  // TODO: figure out why this benchmark is clearly wrong...
  bench('lowerBound', 10, function(count) {
    for (var i = 0; i < count; ++i) {
      heuristic.lowerBound(cubes[i%10], coords);
    }
  });
}

benchmarkPhase2Heuristic();
benchmarkPhase2LowerBound();
