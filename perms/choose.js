var pascalsTriangle = [
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 3, 3, 1],
  [1, 4, 6, 4, 1],
  [1, 5, 10, 10, 5, 1],
  [1, 6, 15, 20, 15, 6, 1],
  [1, 7, 21, 35, 35, 21, 7, 1],
  [1, 8, 28, 56, 70, 56, 28, 8, 1],
  [1, 9, 36, 84, 126, 126, 84, 36, 9, 1],
  [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1],
  [1, 11, 55, 165, 330, 462, 462, 330, 165, 55, 11, 1],
  [1, 12, 66, 220, 495, 792, 924, 792, 495, 220, 66, 12, 1]
];

/**
 * Supply two numbers, a and b, to get (a choose b)
 */
function choose(a, b) {
  if (a < 13) {
    return pascalsTriangle[a][b];
  }
  
  var res = 1;
  for (var i = 0; i < b; ++i) {
    res *= a;
    a -= 1;
  }
  return res/factorial(b);
}

/**
 * This takes an array of booleans and returns how many are true.
 */
function countTrue(list) {
  var res = 0;
  for (var i = 0, len = list.length; i < len; ++i) {
    if (list[i] === true) {
      ++res;
    }
  }
  return res;
}

/**
 * The [choice] array stores a set of true and false boolean values. It
 * represents the "choice" to be encoded.
 */
function encodeChoose(choice) {
  return encodeExplicitChoose(0, choice, countTrue(choice));
}

/**
 * This serves as a perfect-mapping hash function for an unordered choose
 * operation.
 *
 * The [start] argument specifies the index in the [choice] array to start at.
 * Usually, this should be 0.
 *
 * The [choice] array stores a set of true and false boolean values. It
 * represents the "choice" to be encoded.
 *
 * The [numTrue] argument specifies how many true values are in [choose]. You
 * can compute this using the [countTrue] function.
 */
function encodeExplicitChoose(start, choice, numTrue) {
  if (choice.length-start <= 1 || numTrue === 0) {
    return 0;
  } else if (numTrue === 1) {
    for (var i = start, len = choice.length; i < len; ++i) {
      if (choice[i] === true) {
        return i-start;
      }
    }
  }
  
  var numMissed = 0;
  for (var i = start, len = choice.length; i < len; ++i) {
    if (choice[i] === true) {
      var subChoose = encodeExplicitChoose(i+1, choice, numTrue-1);
      return subChoose + numMissed;
    } else {
      numMissed += choose(choice.length-(i+1), numTrue-1);
    }
  }
  return -1;
}

exports.choose = choose;
exports.encodeChoose = encodeChoose;
