// A CompactTable represents an array of 4 bit numbers.
function CompactTable(count) {
  this._data = new Uint8Array(count >>> 1);
}

// fillWith sets every cell in the table to a given 4-bit number.
CompactTable.prototype.fillWith = function(number) {
  var cell = number | (number << 4);
  for (var i = 0, len = this._data.length; i < len; ++i) {
    this._data[i] = cell;
  }
};

// get returns the 4-bit number at a given cell index.
CompactTable.prototype.get = function(idx) {
  // If idx is even, get the lower 4 bits at idx/2, otherwise get the higher 4
  // bits at idx/2.
  return (this._data[idx >>> 1] >>> ((idx & 1) << 2)) & 0xf;
};

// set sets the 4-bit number at a given cell index.
CompactTable.prototype.set = function(idx, value) {
  var rawIdx = idx >>> 1;
  var shift = (idx & 1) << 2;
  
  // Zero out the 4-bit field.
  this._data[rawIdx] &= 0xff ^ (0xf << shift);
  
  // Set the 4-bit field.
  this._data[rawIdx] |= (value << shift);
};