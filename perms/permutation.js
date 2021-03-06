var factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800,
  39916800, 479001600, 6227020800];
var applyPermCache = [];

// allPerms generates all the permutations of a given length.
function allPerms(size) {
  if (size === 0) {
    return [[]];
  } else if (size === 1) {
    return [[0]];
  }

  // Recursively generate permutations
  var result = [];
  var subPermutations = allPerms(size-1);
  for (var start = 0; start < size; ++start) {
    for (var i = 0, len = subPermutations.length; i < len; ++i) {
      var aPerm = [start].concat(subPermutations[i]);
      // Increment values which are >= start in the sub-permutation.
      for (var j = 1, l = aPerm.length; j < l; ++j) {
        if (aPerm[j] >= start) {
          ++aPerm[j];
        }
      }
      result.push(aPerm);
    }
  }
  return result;
}

// applyPerm applies a permutation to an array. The first argument is the array,
// the second is the permutation. The result is stored in the first argument.
function applyPerm(arr, perm) {
  if (arr.length !== perm.length) {
    throw new Error('incorrect permutation length');
  }
  var len = arr.length;
  for (var i = 0; i < len; ++i) {
    applyPermCache[i] = arr[perm[i]];
  }
  for (var i = 0; i < len; ++i) {
    arr[i] = applyPermCache[i];
  }
}

// comparePerms "compares" the permutations a and b and returns -1 if a<b, 1 if
// a>b, or 0 if a=b. This is like comparing encodePerm(a) with encodePerm(b).
function comparePerms(a, b) {
  if (a.length !== b.length) {
    throw new Error('permutations must be the same length');
  }
  for (var i = 0, len = a.length; i < len; ++i) {
    if (a[i] > b[i]) {
      return 1;
    } else if (a[i] < b[i]) {
      return -1;
    }
  }
  return 0;
}

// decodePerm generates a permutation array from a permutation's perfect hash.
function decodePerm(hash, size) {
  var permutation = [];

  // Pre-allocate the array (i.e. avoid using a sparse array)
  for (var i = 0; i < size; ++i) {
    permutation[i] = 0;
  }

  // Read the "digits" of the permutation.
  for (var i = 0, len = size-1; i < len; ++i) {
    var coefficient = factorial(len - i);
    var digit = Math.floor(hash / coefficient);
    permutation[i] = digit;
    hash -= digit * coefficient;
  }

  // Convert the digits into a real permutation.
  for (var i = size-2; i >= 0; --i) {
    var theDigit = permutation[i];
    for (var j = i+1; j < size; ++j) {
      if (permutation[j] >= theDigit) {
        ++permutation[j];
      }
    }
  }

  return permutation;
}

// encodeDestructablePerm optimally encodes an array of permuted integers. In
// the process, it modifies the array. This avoids an extra memory allocation
// which encodePerm() cannot avoid at the expense of the original array.
function encodeDestructablePerm(permutation) {
  if (permutation.length <= 1) {
    return 0;
  }

  var result = 0;
  for (var i = 0, len = permutation.length-1; i < len; ++i) {
    var current = permutation[i];

    // If the first item of the sub-permutation does not belong at the
    // beginning, we need to offset our result.
    if (current !== 0) {
      result += factorial(len-i)*current;
    }

    // Get rid of any trace of "current" from the sub-permutation .
    for (var j = i+1; j < len; ++j) {
      if (permutation[j] > current) {
        --permutation[j];
      }
    }
  }

  return result;
}

// encodePerm encodes a permutation optimally without modifying it.
function encodePerm(permutation) {
  return encodeDestructablePerm(permutation.slice());
}

// encodeDestructablePermIgnoringParity optimally encodes an array of permuted integers, ignoring
// the last two elements. In the process, it modifies the array. This avoids an extra memory
// allocation which encodePermIgnoringParity() cannot avoid at the expense of the original array.
function encodeDestructablePermIgnoringParity(permutation) {
  if (permutation.length <= 2) {
    return 0;
  }

  var result = 0;
  for (var i = 0, len = permutation.length-1; i < len-1; ++i) {
    var current = permutation[i];

    // If the first item of the sub-permutation does not belong at the
    // beginning, we need to offset our result.
    if (current !== 0) {
      result += factorial(len-i)*current;
    }

    // Get rid of any trace of "current" from the sub-permutation .
    for (var j = i+1; j < len; ++j) {
      if (permutation[j] > current) {
        --permutation[j];
      }
    }
  }

  return result / 2;
}

// encodePermIgnoringParity encodes a permutation optimally without modifying it, ignoring the
// parity of the permutation.
function encodePermIgnoringParity(permutation) {
  return encodeDestructablePermIgnoringParity(permutation.slice());
}

// factorial returns the product of the numbers up to and including n. For
// instance, factorial(4) is 4*3*2*1. A special case is that factorial(0) = 1.
function factorial(n) {
  if (n >= factorials.length) {
    return n * factorial(n-1);
  }
  return factorials[n];
}

// parity computes the parity of a permutation. This returns true for even
// parity and false for odd parity.
function parity(permutation) {
  return paritySort(permutation.slice());
}

// paritySort computes the parity of a permutation, sorting the given
// permutation in the process. Therefore, this can avoid an extra allocation
// which the parity() routine cannot.
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

// randomPerm generates a random permutation of a given length.
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

// randomPermParity generates a random permutation of a given length.
// The second argument specifies the parity of the permutation. If it is false,
// the permutation will have odd parity.
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

exports.allPerms = allPerms;
exports.applyPerm = applyPerm;
exports.comparePerms = comparePerms;
exports.decodePerm = decodePerm;
exports.encodeDestructablePerm = encodeDestructablePerm;
exports.encodePerm = encodePerm;
exports.encodeDestructablePermIgnoringParity = encodeDestructablePermIgnoringParity;
exports.encodePermIgnoringParity = encodePermIgnoringParity;
exports.factorial = factorial;
exports.parity = parity;
exports.paritySort = paritySort;
exports.randomPerm = randomPerm;
exports.randomPermParity = randomPermParity;
