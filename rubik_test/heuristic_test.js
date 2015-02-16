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
  new rubik.EOMHeuristic(6).generate();
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration + ' ms/EOMHeuristic(6)');
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

function benchmarkP2CornersHeuristic() {
  var start = new Date().getTime();
  new rubik.P2CornersHeuristic().generate();
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration + ' ms/P2CornersHeuristic');
}

function benchmarkP2Heuristic() {
  var start = new Date().getTime();
  new rubik.P2Heuristic().generate();
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration + ' ms/P2Heuristic');
}

function benchmarkP2OuterEdges() {
  var start = new Date().getTime();
  new rubik.P2OuterEdgesHeuristic().generate();
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration + ' ms/P2OuterEdgesHeuristic');
}

// Run tests.
benchmarkCOHeuristic();
benchmarkEOHeuristic();
benchmarkEOMHeuristic();
benchmarkMHeuristic();
benchmarkP1Heuristic();
benchmarkP2CornersHeuristic();
benchmarkP2Heuristic();
benchmarkP2OuterEdges();
console.log('PASS');
