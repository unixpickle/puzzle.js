(function() {
  
  // If this is not in the browser, we do nothing.
  if ('undefined' === typeof window || 'undefined' === typeof document) {
    return;
  }

  // Uncomment the following line and put in the webworker path if necessary.
  // var workerPath = 'puzzlejs/webscrambler_worker.js';
  var workerPath = null;

  var scrambleWorker = null;
  var workerUnavailable = false;
  var callbacks = {};
  var ticketId = 0;

  if ('undefined' !== typeof window.Worker) {
    // We may need to find the worker's path manually.
    if (workerPath === null) {
      // Use the current script's "src" attribute to figure out where the
      // scripts are.
      var scripts = document.getElementsByTagName('script');
      if (scripts.length === 0) {
        throw new Error('unable to find worker path');
      }
      workerPath = scripts[scripts.length-1].src.split('?')[0];
    }
  }

  function generateScramble(puzzle, scrambler, moves, cb) {
    if (scrambleWorker === null) {
      if ('undefined' === typeof window.Worker || workerUnavailable) {
        // No WebWorker support; generate scramble on main thread.
        setTimeout(function() {
          var genScram = window.puzzlejs.scrambler.generateScramble;
          var res = genScram(puzzle, scrambler, moves);
          cb(res);
        }, 10);
        return;
      }
      
      // Create the WebWorker.
      try {
        setupWorker();
      } catch (e) {
        workerUnavailable = true;
        generateScramble(puzzle, scrambler, moves, cb);
        return;
      }
    }

    // Send a request to the WebWorker.
    var ticket = ticketId++;
    callbacks[ticket] = cb;
    scrambleWorker.postMessage({puzzle: puzzle, scrambler: scrambler,
      moves: moves, id: ticket});
  }
  
  function setupWorker() {
    // Setup the webworker to call our callbacks.
    scrambleWorker = new window.Worker(workerPath);
    scrambleWorker.onmessage = function(e) {
      var m = e.data;
      var cb = callbacks[m.id]
      delete callbacks[m.id];
      cb(m.scramble);
    }
  }

  if (!window.puzzlejs) {
    window.puzzlejs = {webscrambler: {}};
  } else if (!window.puzzlejs.webscrambler) {
    window.puzzlejs.webscrambler = {};
  }
  window.puzzlejs.webscrambler.generateScramble = generateScramble;

})();
