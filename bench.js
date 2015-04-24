// This exports a function bench(name[, coefficient], function) which benchmarks
// an abstract operation. It logs the result before returning.
//
// Example:
//
//     // Benchmark an iteration of an empty while loop.
//     var bench = require('bench.js');
//     bench('loop', function(n) {
//       while (n--) {}
//     });
//
// The name argument is used to name the benchmark in the output.
//
// The function argument is called with an argument N indicating the number of
// times to perform the operation. This function may be called multiple times
// with increasingly large values of N.
//
// The optional coefficient argument specifies a factor which all N must have.
// This is useful for tests where you need to perform an operation evenly on a
// fixed number of test inputs for the benchmark to be fair.

// MIN_TIME is the minimum number of nanoseconds that a benchmark must take.
var MIN_TIME = 500000000;

// PRECISION is the number of significant figures to show.
var PRECISION = 3;

module.exports = function(name, coefficient, f) {
  if ('undefined' === typeof f) {
    f = coefficient;
    coefficient = 1;
  }

  // Run the function with a big enough argument that we can measure it.
  var power = 0;
  while (true) {
    var count = coefficient * Math.pow(2, power);
    var start = process.hrtime();
    f(count);
    var totalDuration = process.hrtime(start);
    var duration = totalDuration[0]*1000000000 + totalDuration[1];

    // If the duration was less than MIN_TIME, we increase it as needed.
    if (duration < MIN_TIME && power < 31) {
      if (duration === 0) {
        power += 1;
      } else {
        var factor = Math.ceil(Math.log(MIN_TIME/duration)/Math.log(2));
        power += factor;
      }
      continue;
    }

    // Compute the amount of time and print it out.
    var scaledDuration = duration / count;
    var unit;
    if (scaledDuration < 1000) {
      unit = 'ns';
    } else if (scaledDuration < 1000000) {
      unit = 'us';
      scaledDuration /= 1000;
    } else if (scaledDuration < 1000000000) {
      unit = 'ms';
      scaledDuration /= 1000000;
    } else {
      unit = 's';
      scaledDuration /= 1000000000;
    }
    console.log('Benchmark: ' + scaledDuration.toPrecision(PRECISION) + ' ' +
      unit + '/' + name);
    break;
  }
};
