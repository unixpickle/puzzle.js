# puzzle.js

This is going to be a useful library for manipulating various puzzles.

# Usage

The built source code can be found in [build/](build/). If you do not plan on modifying the library, you can use the pre-built sources without concern.

Puzzle.js can run in the browser, in Node.js, or in a WebWorker. If you want to use this library in HTML, I recommend copying the **build/** directory and renaming it to "puzzlejs". Then, you can include everything using `<script>` tags:

    <script src="puzzlejs/rubik.js"></script>
    <script src="puzzlejs/skewb.js"></script>
    <script src="puzzlejs/scrambler.js"></script>
    <script src="puzzlejs/webscrambler.js"></script>

Note that the order of the files matters, since the scrambler depends on the "rubik" and "skewb" APIs and the "webscrambler" API depends on the "scrambler" API.

# Building

The puzzle.js source code is stored in a way that makes it simple to modify, search, and maintain. However, this code structure is not ideal for production. Thus, there are a few build scripts which turn the source code into usable code.

The [build.pragmash](build.pragmash) script is written in a language called pragmash. You can install pragmash by following the instructions in the [pragmash](https://github.com/unixpickle/pragmash) repository. Once you have pragmash, you can re-build the library as follows:

    $ pragmash build.pragmash

The build scripts are used to concatenate files and to provide a simple import/export mechanism.

# TODO

 * Implement more intelligent random state generator for Skewb
 * Generate 2x2x2 random state scrambles
 * Generate 3x3x3 random state scrambles

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
