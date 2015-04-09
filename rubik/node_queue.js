// NodeQueue acts as a linked list for breadth-first search.
function NodeQueue(initial) {
  this.first = initial;
  this.last = initial;
  initial.next = null;
}

// empty returns whether or not the queue is empty.
NodeQueue.prototype.empty = function() {
  return this.first === null;
};

// push adds a node to the queue.
NodeQueue.prototype.push = function(p) {
  if (this.first === null) {
    this.first = p;
    this.last = p;
    p.next = null;
    return;
  }
  this.last.next = p;
  this.last = p;
  p.next = null;
};

// shift removes the first node from the queue and returns it.
NodeQueue.prototype.shift = function() {
  var res = this.first;
  this.first = this.first.next;
  return res;
};