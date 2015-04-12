var factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800,
  39916800, 479001600, 6227020800];

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
  var res = [];
  var len = arr.length;
  for (var i = 0; i < len; ++i) {
    res[i] = arr[perm[i]];
  }
  for (var i = 0; i < len; ++i) {
    arr[i] = res[i];
  }
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
exports.encodeDestructablePerm = encodeDestructablePerm;
exports.encodePerm = encodePerm;
exports.factorial = factorial;
exports.parity = parity;
exports.paritySort = paritySort;
exports.randomPerm = randomPerm;
exports.randomPermParity = randomPermParity;
