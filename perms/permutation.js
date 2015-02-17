var factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800,
  39916800, 479001600, 6227020800];

/**
 * Compute the factorial of [n].
 */
function factorial(n) {
  if (n >= factorials.length) {
    return n * factorial(n-1);
  }
  return factorials[n];
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

/**
 * Generates a random permutation of length [len].
 */
function randomPerm(len) {
  // Generate a list of symbols.
  var symbols = [];
  for (var i = 0; i < len; ++i) {
    symbols[i] = i;
  }
  
  // Picking random symbols from the list and add them to the result.
  var result = [];
  while (symbols.length > 0) {
    var idx = Math.floor(Math.random() * symbols.length);
    var value = symbols[idx];
    symbols.splice(idx, 1);
    result.push(value);
  }
  
  return result;
}

/**
 * Generates a random permutation of length [len] with parity [p].
 */
function randomPermParity(len, p) {
  if (len <= 1 && p === false) {
    throw new Error('cannot generate odd permutation on ' + len + ' symbols');
  }
  
  var res = randomPerm(len);
  
  // Do a swap if the parity is wrong.
  if (parity(res) !== p) {
    var first = res[0];
    res[0] = res[1];
    res[1] = first;
  }
  
  return res;
}

exports.factorial = factorial;
exports.parity = parity;
exports.paritySort = paritySort;
exports.randomPerm = randomPerm;
exports.randomPermParity = randomPermParity;
