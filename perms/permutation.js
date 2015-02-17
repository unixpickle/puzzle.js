/**
 * Compute the factorial of [number], which must satisfy 0 <= number <= 13.
 */
function factorial(number) {
  var table = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800,
    39916800, 479001600, 6227020800];
  return table[number];
}

/**
 * Compute the parity of a permutation on the list [0, 1, 2, 3, ...]
 *
 * This returns true for even parity and false for add parity.
 */
function parity(permutation) {
  return paritySort(permutation.slice());
}

/**
 * Compute the parity of a permutation on the list [0, 1, 2, 3, ...].
 *
 * The [list] will be sorted while this function executes.
 *
 * This returns true for even parity and false for add parity.
 */
function paritySort(list) {
  var parity = true;
  for (var i = 0, len = list.length-1; i < len; ++i) {
    // If the element is where it belongs, continue.
    if (list[i] === i) {
      continue;
    }
    
    parity = !parity;
    
    // Find the other value (which we know is after i)
    for (var j = i+1; j < len+1; ++j) {
      if (list[j] === i) {
        list[j] = list[i];
        list[i] = i;
      }
    }
  }
  return parity;
}

exports.factorial = factorial;
exports.parity = parity;
exports.paritySort = paritySort;
