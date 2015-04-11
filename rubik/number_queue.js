// NumberQueue acts as an allocation-free queue for storing numbers.
function NumberQueue(capacity) {
  this._buffer = new Uint32Array(capacity);
  this._capacity = capacity;
  this._start = 0;
  this._end = 0;
  this._count = 0;
}

// empty returns true if and only if the queue contains no numbers.
NumberQueue.prototype.empty = function() {
  return this._count === 0;
};

// push adds a 32-bit number to the queue.
NumberQueue.prototype.push = function(p) {
  if (this._count === this._capacity) {
    throw new Error('NumberQueue overflow');
  }
  ++this._count;
  this._buffer[this._end] = p;
  ++this._end;
  if (this._end === this._capacity) {
    this._end = 0;
  }
}

// shift removes a 32-bit number from the queue and returns it.
NumberQueue.prototype.shift = function() {
  if (this._count === 0) {
    throw new Error('NumberQueue underflow');
  }
  --this._count;
  var res = this._buffer[this._start];
  ++this._start;
  if (this._start === this._capacity) {
    this._start = 0;
  }
  return res;
};
