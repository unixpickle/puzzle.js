# puzzle.js

This is going to be a useful library for manipulating various puzzles.

# Building

The puzzle.js source code is stored in a way that makes it simple to write, modify, search, and maintain. However, this code structure is not ideal for production. A Makefile is used to turn the source code into usable code.

In order to build puzzle.js, you must have `make` and `bash` installed. You can then build like this:

    $ make clean && make

This command will generate a directory called "build" which contains built source files.

# Usage

Once you build the source code, you're ready to use the library.

Puzzle.js can run in the browser, in Node.js, or in a WebWorker. If you want to use this library in a webpage, you can copy the **build/puzzle.web.0.6.0.js** file to your project. Then, you can include it using a `<script>` tag:
    
    <script src="puzzlejs/puzzle.web.0.6.0.js"></script>

Note that you should replace "0.6.0" with the actual version number. Note also that you should not use an async `<script>` tag; the "webscrambler" API locates its WebWorker script in a way which depends on a synchronous import.

# Testing

There are unit tests for most of the APIs provided by puzzle.js. In order to run these tests, you must have Node.js installed. Running these tests can be done from the command-line:

    make clean && make test

This will run each test. If all goes well, you should see something like this:

    *** perms/test/choose_test.js ***
    PASS
    *** perms/test/permutation_test.js ***
    PASS
    *** pocketcube/test/cubie_test.js ***
    PASS
    ...

If a test fails, it will throw an exception and you will see the backtrace in the output.

Tests are located in designated test directories. Every JavaScript file within every module's **test** directory is run when you do `make test`. It is the convention that these files have names ending in "_test", but that is not particularly significant to the testing mechanism.

Test programs themselves are nothing more than Node.js applications. Writing a test is as simple as creating a script which asserts various things and then prints "PASS" to the console.

# Benchmarks

Performance is taken into consideration throughout puzzle.js. As a result, there are a lot of performance benchmarks. To run these performance benchmarks, you can do this in the command-line:

    make clean && make bench

*(Note that you need Node.js in order to run the benchmarks.)*

The benchmarks are located in each module's **bench** directory. Every benchmark's filename ends in "_bench" by convention.

Benchmarks are less free-form than tests. It is highly recommended that you use the [bench.js](bench.js) module for your benchmarks. This makes the output standard between benchmarks and makes benchmarks easier to write. For example, this is how you would benchmark a function called `scrambleCube`:

    var bench = require('../../bench.js');
    bench('scrambleCube', function(count) {
      while (count--) {
        scrambleCube();
      }
    });

This would output something like: "Benchmark: 30.0 ms/scrambleCube". Note that the function you provide to `bench` takes a single argument. This argument specifies the number of operations to perform. This way the benchmarking API can increase the number of operations until it knows it can get an accurate result.

Occasionally you may find that your benchmark can only work if the number of operations is divisible by some non-negative integer which is greater than 1. For example, if your benchmark needs to time the average move on a 3x3 cube, it ought to perform each of the 18 moves the same number of times. In this scenario, you can pass another argument to the benchmark function:

    bench('move', 18, function(count) {
      // count % 18 is always 0.
      for (var i = 0; i < count; ++i) {
        var move = (i % 18);
        ...
      }
    });

If three arguments are provided to the benchmark function, the second argument will always divide `count`.

# TODO

 * Figure out an intelligent way to generate random states on the Skewb.
 * Allow move cancellation between phases in the two phase solver.
   * I got this for a last layer scramble: B U2 R B2 R R2 U2 R2 B2 U2 B L2 F D2 F' L2
 * Improve initialization time &amp; speed of...
   * the 3x3 solver
   * the 2x2 solver
   * the Skewb solver
 * Implement move-based scrambles for all big cubes.
 * Implement Square-1 API+scrambles.
 * Implement Rubik's Clock API+scrambles.

# License

**puzzle.js** is licensed under the BSD 2-clause license. See [LICENSE](LICENSE).

```
Copyright (c) 2015, Alex Nichol.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```
