var rubik = require('../../build/rubik.js');
var perms = require('../../build/perms.js');
var bench = require('../../bench.js');

function benchmarkPhase2ChooseCoord() {
  bench('Phase2ChooseCoord', function(n) {
    while (n--) {
      new rubik.Phase2ChooseCoord();
    }
  });
}

function benchmarkPhase2ChooseCoordMove() {
  // Generate a shuffled list of coordinates.
  var states = [];
  for (var i = 0; i < 70; ++i) {
    states[i] = i;
  }
  for (var i = 0; i < 70; ++i) {
    var idx = Math.floor(Math.random() * i);
    var temp = states[i];
    states[i] = states[idx];
    states[idx] = temp;
  }

  var coord = new rubik.Phase2ChooseCoord();
  bench('Phase2ChooseCoord.move', 700, function(n) {
    for (var i = 0; i < n/700; ++i) {
      for (var m = 0; m < 10; ++m) {
        for (var s = 0; s < 70; ++s) {
          coord.move(states[s], m);
        }
      }
    }
  });
}

function benchmarkPhase2SliceCoord() {
  var perm4 = perms.allPerms(4);
  bench('Phase2SliceCoord', function(n) {
    while (n--) {
      new rubik.Phase2SliceCoord(perm4);
    }
  });
}

function benchmarkPhase2SliceCoordMove() {
  // Apply all moves to a shuffled set of coordinates.
  var states = [20, 2, 1, 6, 4, 16, 10, 14, 0, 7, 5, 13, 17, 9, 22, 19, 12, 23,
    18, 8, 3, 11, 15, 21];
  var coord = new rubik.Phase2SliceCoord(perms.allPerms(4));
  bench('Phase2SliceCoord.move', 240, function(n) {
    for (var i = 0; i < n/240; ++i) {
      for (var m = 0; m < 10; ++m) {
        for (var s = 0; s < 24; ++s) {
          coord.move(states[s], m);
        }
      }
    }
  });
}

benchmarkPhase2ChooseCoord();
benchmarkPhase2ChooseCoordMove();
benchmarkPhase2SliceCoord();
benchmarkPhase2SliceCoordMove();
