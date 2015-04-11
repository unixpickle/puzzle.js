// pascalsTriangle stores pre-computed values of the choose operator. This makes
// choose() a lot faster.
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

// choose takes two numbers, a and b, and returns (a choose b).
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

// countTrue takes an array and returns the number of elements which are true.
function countTrue(list) {
  var res = 0;
  for (var i = 0, len = list.length; i < len; ++i) {
    if (list[i] === true) {
      ++res;
    }
  }
  return res;
}

// encodeChoose encodes an array which represents a given "choice"--that is, an
// array of boolean values. This acts as a perfect-mapping hash function for
// the unordered choose operation.
function encodeChoose(choice) {
  return encodeExplicitChoose(0, choice, countTrue(choice));
}

// encodeExplicitChoose implements the backbone of encodeChoose().
// The start argument specifies the index in the [choice] array to start at.
// The choice array stores a set of true and false boolean values.
// The numTrue argument specifies how many true values are in [choose]. You
// can compute this using the countTrue() routine.
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
