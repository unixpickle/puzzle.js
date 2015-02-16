var rubik = require('../build/rubik.js');

function benchmarkCOHeuristic() {
  var start = new Date().getTime();
  for (var i = 0; i < 10; ++i) {
    new rubik.COHeuristic().generate();
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration/10 + ' ms/COHeuristic');
}

function benchmarkEOHeuristic() {
  var start = new Date().getTime();
  for (var i = 0; i < 10; ++i) {
    new rubik.EOHeuristic().generate();
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration/10 + ' ms/EOHeuristic');
}

function benchmarkEOMHeuristic() {
  var start = new Date().getTime();
  new rubik.EOMHeuristic(5).generate();
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration + ' ms/EOMHeuristic(5)');
}

function benchmarkMHeuristic() {
  var start = new Date().getTime();
  for (var i = 0; i < 10; ++i) {
    new rubik.MHeuristic().generate();
  }
  
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration/10 + ' ms/MHeuristic');
}

function benchmarkP1Heuristic() {
  var start = new Date().getTime();
  new rubik.P1Heuristic().generate();
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration + ' ms/P1Heuristic');
}

// Run tests.
benchmarkCOHeuristic();
benchmarkEOHeuristic();
benchmarkEOMHeuristic();
benchmarkMHeuristic();
benchmarkP1Heuristic();
console.log('PASS');
