(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.browserify = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":3,"ieee754":4,"isarray":5}],3:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],6:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":7}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":66,"./_root":94}],9:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @returns {Object} Returns the new hash object.
 */
function Hash() {}

// Avoid inheriting from `Object.prototype` when possible.
Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;

module.exports = Hash;

},{"./_nativeCreate":93}],10:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":66,"./_root":94}],11:[function(require,module,exports){
var mapClear = require('./_mapClear'),
    mapDelete = require('./_mapDelete'),
    mapGet = require('./_mapGet'),
    mapHas = require('./_mapHas'),
    mapSet = require('./_mapSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function MapCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.clear();
  while (++index < length) {
    var entry = values[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapClear;
MapCache.prototype['delete'] = mapDelete;
MapCache.prototype.get = mapGet;
MapCache.prototype.has = mapHas;
MapCache.prototype.set = mapSet;

module.exports = MapCache;

},{"./_mapClear":86,"./_mapDelete":87,"./_mapGet":88,"./_mapHas":89,"./_mapSet":90}],12:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":66,"./_root":94}],13:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Reflect = root.Reflect;

module.exports = Reflect;

},{"./_root":94}],14:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":66,"./_root":94}],15:[function(require,module,exports){
var stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function Stack(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.clear();
  while (++index < length) {
    var entry = values[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_stackClear":96,"./_stackDelete":97,"./_stackGet":98,"./_stackHas":99,"./_stackSet":100}],16:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":94}],17:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":94}],18:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":66,"./_root":94}],19:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `Map#set` because it doesn't return the map instance in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],20:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],21:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],22:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],23:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],24:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],25:[function(require,module,exports){
var eq = require('./eq');

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (typeof key == 'number' && value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignMergeValue;

},{"./eq":107}],26:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignValue;

},{"./eq":107}],27:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the associative array.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function assocDelete(array, key) {
  var index = assocIndexOf(array, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = array.length - 1;
  if (index == lastIndex) {
    array.pop();
  } else {
    splice.call(array, index, 1);
  }
  return true;
}

module.exports = assocDelete;

},{"./_assocIndexOf":30}],28:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the associative array value for `key`.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function assocGet(array, key) {
  var index = assocIndexOf(array, key);
  return index < 0 ? undefined : array[index][1];
}

module.exports = assocGet;

},{"./_assocIndexOf":30}],29:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if an associative array value for `key` exists.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function assocHas(array, key) {
  return assocIndexOf(array, key) > -1;
}

module.exports = assocHas;

},{"./_assocIndexOf":30}],30:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":107}],31:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the associative array `key` to `value`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 */
function assocSet(array, key, value) {
  var index = assocIndexOf(array, key);
  if (index < 0) {
    array.push([key, value]);
  } else {
    array[index][1] = value;
  }
}

module.exports = assocSet;

},{"./_assocIndexOf":30}],32:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":61,"./keys":123}],33:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  // Recursively populate clone (susceptible to call stack limits).
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":15,"./_arrayEach":22,"./_assignValue":26,"./_baseAssign":32,"./_cloneBuffer":53,"./_copyArray":60,"./_copySymbols":62,"./_getAllKeys":64,"./_getTag":69,"./_initCloneArray":76,"./_initCloneByTag":77,"./_initCloneObject":78,"./_isHostObject":79,"./isArray":110,"./isBuffer":113,"./isObject":117,"./keys":123}],34:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

module.exports = baseCreate;

},{"./isObject":117}],35:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":48,"./_isKey":82,"./_toKey":103}],36:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object)
    ? result
    : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":23,"./isArray":110}],37:[function(require,module,exports){
var getPrototype = require('./_getPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return hasOwnProperty.call(object, key) ||
    (typeof object == 'object' && key in object && getPrototype(object) === null);
}

module.exports = baseHas;

},{"./_getPrototype":67}],38:[function(require,module,exports){
var indexOfNaN = require('./_indexOfNaN');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./_indexOfNaN":75}],39:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * The base implementation of `_.keys` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  return nativeKeys(Object(object));
}

module.exports = baseKeys;

},{}],40:[function(require,module,exports){
var Reflect = require('./_Reflect'),
    iteratorToArray = require('./_iteratorToArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var enumerate = Reflect ? Reflect.enumerate : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.keysIn` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  object = object == null ? object : Object(object);

  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}

// Fallback for IE < 9 with es6-shim.
if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

module.exports = baseKeysIn;

},{"./_Reflect":13,"./_iteratorToArray":85}],41:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignMergeValue = require('./_assignMergeValue'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isArray = require('./isArray'),
    isObject = require('./isObject'),
    isTypedArray = require('./isTypedArray'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  if (!(isArray(source) || isTypedArray(source))) {
    var props = keysIn(source);
  }
  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  });
}

module.exports = baseMerge;

},{"./_Stack":15,"./_arrayEach":22,"./_assignMergeValue":25,"./_baseMergeDeep":42,"./isArray":110,"./isObject":117,"./isTypedArray":122,"./keysIn":124}],42:[function(require,module,exports){
var assignMergeValue = require('./_assignMergeValue'),
    baseClone = require('./_baseClone'),
    copyArray = require('./_copyArray'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    toPlainObject = require('./toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    newValue = srcValue;
    if (isArray(srcValue) || isTypedArray(srcValue)) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
      else {
        newValue = objValue;
      }
    }
    else {
      isCommon = false;
    }
  }
  stack.set(srcValue, newValue);

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
  }
  stack['delete'](srcValue);
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;

},{"./_assignMergeValue":25,"./_baseClone":33,"./_copyArray":60,"./isArguments":109,"./isArray":110,"./isArrayLikeObject":112,"./isFunction":114,"./isObject":117,"./isPlainObject":119,"./isTypedArray":122,"./toPlainObject":131}],43:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],44:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]);
    if (isObject(nested)) {
      var newValue = value;
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = objValue == null
            ? (isIndex(path[index + 1]) ? [] : {})
            : objValue;
        }
      }
      assignValue(nested, key, newValue);
    }
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;

},{"./_assignValue":26,"./_castPath":48,"./_isIndex":80,"./_isKey":82,"./_toKey":103,"./isObject":117}],45:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],46:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],47:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":16,"./isSymbol":121}],48:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

module.exports = castPath;

},{"./_stringToPath":102,"./isArray":110}],49:[function(require,module,exports){
var baseSlice = require('./_baseSlice');

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;

},{"./_baseSlice":45}],50:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

module.exports = charsEndIndex;

},{"./_baseIndexOf":38}],51:[function(require,module,exports){
/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = checkGlobal;

},{}],52:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":17}],53:[function(require,module,exports){
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{}],54:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":52}],55:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":19,"./_arrayReduce":24,"./_mapToArray":91}],56:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],57:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":20,"./_arrayReduce":24,"./_setToArray":95}],58:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":16}],59:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":52}],60:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],61:[function(require,module,exports){
var assignValue = require('./_assignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":26}],62:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":61,"./_getSymbols":68}],63:[function(require,module,exports){
var isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = typeof customizer == 'function'
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_isIterateeCall":81,"./rest":127}],64:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":36,"./_getSymbols":68,"./keys":123}],65:[function(require,module,exports){
var baseProperty = require('./_baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./_baseProperty":43}],66:[function(require,module,exports){
var isNative = require('./isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./isNative":116}],67:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

module.exports = getPrototype;

},{}],68:[function(require,module,exports){
/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
function getSymbols(object) {
  // Coerce `object` to an object to avoid non-object errors in V8.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=3443 for more details.
  return getOwnPropertySymbols(Object(object));
}

// Fallback for IE < 11.
if (!getOwnPropertySymbols) {
  getSymbols = function() {
    return [];
  };
}

module.exports = getSymbols;

},{}],69:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
  return objectToString.call(value);
}

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":8,"./_Map":10,"./_Promise":12,"./_Set":14,"./_WeakMap":18,"./_toSource":104}],70:[function(require,module,exports){
var hashHas = require('./_hashHas');

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(hash, key) {
  return hashHas(hash, key) && delete hash[key];
}

module.exports = hashDelete;

},{"./_hashHas":72}],71:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @param {Object} hash The hash to query.
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(hash, key) {
  if (nativeCreate) {
    var result = hash[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":93}],72:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @param {Object} hash The hash to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(hash, key) {
  return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
}

module.exports = hashHas;

},{"./_nativeCreate":93}],73:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 */
function hashSet(hash, key, value) {
  hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
}

module.exports = hashSet;

},{"./_nativeCreate":93}],74:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) &&
      (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

module.exports = indexKeys;

},{"./_baseTimes":46,"./isArguments":109,"./isArray":110,"./isLength":115,"./isString":120}],75:[function(require,module,exports){
/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = indexOfNaN;

},{}],76:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],77:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":52,"./_cloneDataView":54,"./_cloneMap":55,"./_cloneRegExp":56,"./_cloneSet":57,"./_cloneSymbol":58,"./_cloneTypedArray":59}],78:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":34,"./_getPrototype":67,"./_isPrototype":84}],79:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],80:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],81:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":80,"./eq":107,"./isArrayLike":111,"./isObject":117}],82:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":110,"./isSymbol":121}],83:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],84:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],85:[function(require,module,exports){
/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

},{}],86:[function(require,module,exports){
var Hash = require('./_Hash'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': Map ? new Map : [],
    'string': new Hash
  };
}

module.exports = mapClear;

},{"./_Hash":9,"./_Map":10}],87:[function(require,module,exports){
var Map = require('./_Map'),
    assocDelete = require('./_assocDelete'),
    hashDelete = require('./_hashDelete'),
    isKeyable = require('./_isKeyable');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapDelete(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map['delete'](key) : assocDelete(data.map, key);
}

module.exports = mapDelete;

},{"./_Map":10,"./_assocDelete":27,"./_hashDelete":70,"./_isKeyable":83}],88:[function(require,module,exports){
var Map = require('./_Map'),
    assocGet = require('./_assocGet'),
    hashGet = require('./_hashGet'),
    isKeyable = require('./_isKeyable');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapGet(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashGet(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map.get(key) : assocGet(data.map, key);
}

module.exports = mapGet;

},{"./_Map":10,"./_assocGet":28,"./_hashGet":71,"./_isKeyable":83}],89:[function(require,module,exports){
var Map = require('./_Map'),
    assocHas = require('./_assocHas'),
    hashHas = require('./_hashHas'),
    isKeyable = require('./_isKeyable');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapHas(key) {
  var data = this.__data__;
  if (isKeyable(key)) {
    return hashHas(typeof key == 'string' ? data.string : data.hash, key);
  }
  return Map ? data.map.has(key) : assocHas(data.map, key);
}

module.exports = mapHas;

},{"./_Map":10,"./_assocHas":29,"./_hashHas":72,"./_isKeyable":83}],90:[function(require,module,exports){
var Map = require('./_Map'),
    assocSet = require('./_assocSet'),
    hashSet = require('./_hashSet'),
    isKeyable = require('./_isKeyable');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapSet(key, value) {
  var data = this.__data__;
  if (isKeyable(key)) {
    hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
  } else if (Map) {
    data.map.set(key, value);
  } else {
    assocSet(data.map, key, value);
  }
  return this;
}

module.exports = mapSet;

},{"./_Map":10,"./_assocSet":31,"./_hashSet":73,"./_isKeyable":83}],91:[function(require,module,exports){
/**
 * Converts `map` to an array.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the converted array.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],92:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    isObject = require('./isObject');

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function mergeDefaults(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    baseMerge(objValue, srcValue, undefined, mergeDefaults, stack.set(srcValue, objValue));
  }
  return objValue;
}

module.exports = mergeDefaults;

},{"./_baseMerge":41,"./isObject":117}],93:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":66}],94:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./_checkGlobal":51}],95:[function(require,module,exports){
/**
 * Converts `set` to an array.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the converted array.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],96:[function(require,module,exports){
/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = { 'array': [], 'map': null };
}

module.exports = stackClear;

},{}],97:[function(require,module,exports){
var assocDelete = require('./_assocDelete');

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      array = data.array;

  return array ? assocDelete(array, key) : data.map['delete'](key);
}

module.exports = stackDelete;

},{"./_assocDelete":27}],98:[function(require,module,exports){
var assocGet = require('./_assocGet');

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  var data = this.__data__,
      array = data.array;

  return array ? assocGet(array, key) : data.map.get(key);
}

module.exports = stackGet;

},{"./_assocGet":28}],99:[function(require,module,exports){
var assocHas = require('./_assocHas');

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  var data = this.__data__,
      array = data.array;

  return array ? assocHas(array, key) : data.map.has(key);
}

module.exports = stackHas;

},{"./_assocHas":29}],100:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    assocSet = require('./_assocSet');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__,
      array = data.array;

  if (array) {
    if (array.length < (LARGE_ARRAY_SIZE - 1)) {
      assocSet(array, key, value);
    } else {
      data.array = null;
      data.map = new MapCache(array);
    }
  }
  var map = data.map;
  if (map) {
    map.set(key, value);
  }
  return this;
}

module.exports = stackSet;

},{"./_MapCache":11,"./_assocSet":31}],101:[function(require,module,exports){
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return string.match(reComplexSymbol);
}

module.exports = stringToArray;

},{}],102:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  var result = [];
  toString(string).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./memoize":125,"./toString":132}],103:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":121}],104:[function(require,module,exports){
/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],105:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],106:[function(require,module,exports){
var apply = require('./_apply'),
    mergeDefaults = require('./_mergeDefaults'),
    mergeWith = require('./mergeWith'),
    rest = require('./rest');

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
 * // => { 'user': { 'name': 'barney', 'age': 36 } }
 *
 */
var defaultsDeep = rest(function(args) {
  args.push(undefined, mergeDefaults);
  return apply(mergeWith, undefined, args);
});

module.exports = defaultsDeep;

},{"./_apply":21,"./_mergeDefaults":92,"./mergeWith":126,"./rest":127}],107:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],108:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is used in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":35}],109:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":112}],110:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @type {Function}
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],111:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./_getLength":65,"./isFunction":114,"./isLength":115}],112:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":111,"./isObjectLike":118}],113:[function(require,module,exports){
var constant = require('./constant'),
    root = require('./_root');

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = (freeModule && freeModule.exports === freeExports)
  ? freeExports
  : undefined;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = !Buffer ? constant(false) : function(value) {
  return value instanceof Buffer;
};

module.exports = isBuffer;

},{"./_root":94,"./constant":105}],114:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":117}],115:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],116:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (!isObject(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = isNative;

},{"./_isHostObject":79,"./_toSource":104,"./isFunction":114,"./isObject":117}],117:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],118:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],119:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object,
 *  else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":67,"./_isHostObject":79,"./isObjectLike":118}],120:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{"./isArray":110,"./isObjectLike":118}],121:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":118}],122:[function(require,module,exports){
var isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = isTypedArray;

},{"./isLength":115,"./isObjectLike":118}],123:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"./_baseHas":37,"./_baseKeys":39,"./_indexKeys":74,"./_isIndex":80,"./_isPrototype":84,"./isArrayLike":111}],124:[function(require,module,exports){
var baseKeysIn = require('./_baseKeysIn'),
    indexKeys = require('./_indexKeys'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  var index = -1,
      isProto = isPrototype(object),
      props = baseKeysIn(object),
      propsLength = props.length,
      indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  while (++index < propsLength) {
    var key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"./_baseKeysIn":40,"./_indexKeys":74,"./_isIndex":80,"./_isPrototype":84}],125:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoizing function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":11}],126:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with seven arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var other = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

module.exports = mergeWith;

},{"./_baseMerge":41,"./_createAssigner":63}],127:[function(require,module,exports){
var apply = require('./_apply'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as
 * an array.
 *
 * **Note:** This method is based on the
 * [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = rest;

},{"./_apply":21,"./toInteger":129}],128:[function(require,module,exports){
var baseSet = require('./_baseSet');

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;

},{"./_baseSet":44}],129:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

module.exports = toInteger;

},{"./toNumber":130}],130:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isFunction":114,"./isObject":117,"./isSymbol":121}],131:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;

},{"./_copyObject":61,"./keysIn":124}],132:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":47}],133:[function(require,module,exports){
var baseToString = require('./_baseToString'),
    castSlice = require('./_castSlice'),
    charsEndIndex = require('./_charsEndIndex'),
    stringToArray = require('./_stringToArray'),
    toString = require('./toString');

/** Used to match leading and trailing whitespace. */
var reTrimEnd = /\s+$/;

/**
 * Removes trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trimEnd('  abc  ');
 * // => '  abc'
 *
 * _.trimEnd('-_-abc-_-', '_-');
 * // => '-_-abc'
 */
function trimEnd(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimEnd, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

  return castSlice(strSymbols, 0, end).join('');
}

module.exports = trimEnd;

},{"./_baseToString":47,"./_castSlice":49,"./_charsEndIndex":50,"./_stringToArray":101,"./toString":132}],134:[function(require,module,exports){
var should = require('./lib/should');

var defaultProto = Object.prototype;
var defaultProperty = 'should';

//Expose api via `Object#should`.
try {
  var prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;
} catch(e) {
  //ignore errors
}

module.exports = should;

},{"./lib/should":151}],135:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('./util');

/**
 * should AssertionError
 * @param {Object} options
 * @constructor
 * @memberOf should
 * @static
 */
var AssertionError = function AssertionError(options) {
  util.merge(this, options);

  if (!options.message) {
    Object.defineProperty(this, 'message', {
        get: function() {
          if (!this._message) {
            this._message = this.generateMessage();
            this.generatedMessage = true;
          }
          return this._message;
        },
        configurable: true,
        enumerable: false
      }
    );
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      if (this.stackStartFunction) {
        // try to strip useless frames
        var fn_name = util.functionName(this.stackStartFunction);
        var idx = out.indexOf('\n' + fn_name);
        if (idx >= 0) {
          // once we have located the function frame
          // we need to strip out everything before it (and its line)
          var next_line = out.indexOf('\n', idx + 1);
          out = out.substring(next_line + 1);
        }
      }

      this.stack = out;
    }
  }
};


var indent = '    ';
function prependIndent(line) {
  return indent + line;
}

function indentLines(text) {
  return text.split('\n').map(prependIndent).join('\n');
}


// assert.AssertionError instanceof Error
AssertionError.prototype = Object.create(Error.prototype, {
  name: {
    value: 'AssertionError'
  },

  generateMessage: {
    value: function() {
      if (!this.operator && this.previous) {
        return this.previous.message;
      }
      var actual = util.format(this.actual);
      var expected = 'expected' in this ? ' ' + util.format(this.expected) : '';
      var details = 'details' in this && this.details ? ' (' + this.details + ')' : '';

      var previous = this.previous ? '\n' + indentLines(this.previous.message) : '';

      return 'expected ' + actual + (this.negate ? ' not ' : ' ') + this.operator + expected + details + previous;
    }
  }
});

module.exports = AssertionError;

},{"./util":152}],136:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var AssertionError = require('./assertion-error');

/**
 * should Assertion
 * @param {*} obj Given object for assertion
 * @constructor
 * @memberOf should
 * @static
 */
function Assertion(obj) {
  this.obj = obj;

  this.anyOne = false;
  this.negate = false;

  this.params = {actual: obj};
}

Assertion.prototype = {
  constructor: Assertion,

  /**
   * Base method for assertions.
   *
   * Before calling this method need to fill Assertion#params object. This method usually called from other assertion methods.
   * `Assertion#params` can contain such properties:
   * * `operator` - required string containing description of this assertion
   * * `obj` - optional replacement for this.obj, it usefull if you prepare more clear object then given
   * * `message` - if this property filled with string any others will be ignored and this one used as assertion message
   * * `expected` - any object used when you need to assert relation between given object and expected. Like given == expected (== is a relation)
   * * `details` - additional string with details to generated message
   *
   * @memberOf Assertion
   * @category assertion
   * @param {*} expr Any expression that will be used as a condition for asserting.
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.assert(false);
   * //throws AssertionError: expected 42 to be magic number
   */
  assert: function(expr) {
    if (expr) {
      return this;
    }

    var params = this.params;

    if ('obj' in params && !('actual' in params)) {
      params.actual = params.obj;
    } else if (!('obj' in params) && !('actual' in params)) {
      params.actual = this.obj;
    }

    params.stackStartFunction = params.stackStartFunction || this.assert;
    params.negate = this.negate;

    params.assertion = this;

    throw new AssertionError(params);
  },

  /**
   * Shortcut for `Assertion#assert(false)`.
   *
   * @memberOf Assertion
   * @category assertion
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.fail();
   * //throws AssertionError: expected 42 to be magic number
   */
  fail: function() {
    return this.assert(false);
  }
};



/**
 * Assertion used to delegate calls of Assertion methods inside of Promise.
 * It has almost all methods of Assertion.prototype
 *
 * @param {Promise} obj
 */
function PromisedAssertion(/* obj */) {
  Assertion.apply(this, arguments);
}

/**
 * Make PromisedAssertion to look like promise. Delegate resolve and reject to given promise.
 *
 * @private
 * @returns {Promise}
 */
PromisedAssertion.prototype.then = function(resolve, reject) {
  return this.obj.then(resolve, reject);
};

/**
 * Way to extend Assertion function. It uses some logic
 * to define only positive assertions and itself rule with negative assertion.
 *
 * All actions happen in subcontext and this method take care about negation.
 * Potentially we can add some more modifiers that does not depends from state of assertion.
 *
 * @memberOf Assertion
 * @static
 * @param {String} name Name of assertion. It will be used for defining method or getter on Assertion.prototype
 * @param {Function} func Function that will be called on executing assertion
 * @example
 *
 * Assertion.add('asset', function() {
 *      this.params = { operator: 'to be asset' }
 *
 *      this.obj.should.have.property('id').which.is.a.Number()
 *      this.obj.should.have.property('path')
 * })
 */
Assertion.add = function(name, func) {
  Object.defineProperty(Assertion.prototype, name, {
    enumerable: true,
    configurable: true,
    value: function() {
      var context = new Assertion(this.obj, this, name);
      context.anyOne = this.anyOne;

      try {
        func.apply(context, arguments);
      } catch (e) {
        // check for fail
        if (e instanceof AssertionError) {
          // negative fail
          if (this.negate) {
            this.obj = context.obj;
            this.negate = false;
            return this;
          }

          if (context !== e.assertion) {
            context.params.previous = e;
          }

          // positive fail
          context.negate = false;
          context.fail();
        }
        // throw if it is another exception
        throw e;
      }

      // negative pass
      if (this.negate) {
        context.negate = true; // because .fail will set negate
        context.params.details = 'false negative fail';
        context.fail();
      }

      // positive pass
      if (!this.params.operator) {
        this.params = context.params; // shortcut
      }
      this.obj = context.obj;
      this.negate = false;
      return this;
    }
  });

  Object.defineProperty(PromisedAssertion.prototype, name, {
    enumerable: true,
    configurable: true,
    value: function() {
      var args = arguments;
      this.obj = this.obj.then(function(a) {
        return a[name].apply(a, args);
      });

      return this;
    }
  });
};

/**
 * Add chaining getter to Assertion like .a, .which etc
 *
 * @memberOf Assertion
 * @static
 * @param  {string} name   name of getter
 * @param  {function} [onCall] optional function to call
 */
Assertion.addChain = function(name, onCall) {
  onCall = onCall || function() {};
  Object.defineProperty(Assertion.prototype, name, {
    get: function() {
      onCall.call(this);
      return this;
    },
    enumerable: true
  });

  Object.defineProperty(PromisedAssertion.prototype, name, {
    enumerable: true,
    configurable: true,
    get: function() {
      this.obj = this.obj.then(function(a) {
        return a[name];
      });

      return this;
    }
  });
};

/**
 * Create alias for some `Assertion` property
 *
 * @memberOf Assertion
 * @static
 * @param {String} from Name of to map
 * @param {String} to Name of alias
 * @example
 *
 * Assertion.alias('true', 'True')
 */
Assertion.alias = function(from, to) {
  var desc = Object.getOwnPropertyDescriptor(Assertion.prototype, from);
  if (!desc) throw new Error('Alias ' + from + ' -> ' + to + ' could not be created as ' + from + ' not defined');
  Object.defineProperty(Assertion.prototype, to, desc);

  var desc2 = Object.getOwnPropertyDescriptor(PromisedAssertion.prototype, from);
  if (desc2) {
    Object.defineProperty(PromisedAssertion.prototype, to, desc2);
  }
};
/**
 * Negation modifier. Current assertion chain become negated. Each call invert negation on current assertion.
 *
 * @name not
 * @property
 * @memberOf Assertion
 * @category assertion
 */
Assertion.addChain('not', function() {
  this.negate = !this.negate;
});

/**
 * Any modifier - it affect on execution of sequenced assertion to do not `check all`, but `check any of`.
 *
 * @name any
 * @property
 * @memberOf Assertion
 * @category assertion
 */
Assertion.addChain('any', function() {
  this.anyOne = true;
});

module.exports = Assertion;
module.exports.PromisedAssertion = PromisedAssertion;

},{"./assertion-error":135}],137:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var Formatter = require('should-format').Formatter;

var config = {
  checkProtoEql: false,

  getFormatter: function(opts) {
    return new Formatter(opts || config);
  }
};

module.exports = config;

},{"should-format":155}],138:[function(require,module,exports){
// implement assert interface using already written peaces of should.js

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var Assertion = require('./../assertion');

var _deepEqual = require('should-equal');

var pSlice = Array.prototype.slice;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.
/**
 * Node.js standard [`assert.fail`](http://nodejs.org/api/assert.html#assert_assert_fail_actual_expected_message_operator).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual Actual object
 * @param {*} expected Expected object
 * @param {string} message Message for assertion
 * @param {string} operator Operator text
 */
function fail(actual, expected, message, operator, stackStartFunction) {
  var a = new Assertion(actual);
  a.params = {
    operator: operator,
    expected: expected,
    message: message,
    stackStartFunction: stackStartFunction || fail
  };

  a.fail();
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.
/**
 * Node.js standard [`assert.ok`](http://nodejs.org/api/assert.html#assert_assert_value_message_assert_ok_value_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} value
 * @param {string} [message]
 */
function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

/**
 * Node.js standard [`assert.equal`](http://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notEqual`](http://nodejs.org/api/assert.html#assert_assert_notequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.deepEqual`](http://nodejs.org/api/assert.html#assert_assert_deepequal_actual_expected_message).
 * But uses should.js .eql implementation instead of Node.js own deepEqual.
 *
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected).result) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};


// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notDeepEqual`](http://nodejs.org/api/assert.html#assert_assert_notdeepequal_actual_expected_message).
 * But uses should.js .eql implementation instead of Node.js own deepEqual.
 *
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected).result) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.strictEqual`](http://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
/**
 * Node.js standard [`assert.notStrictEqual`](http://nodejs.org/api/assert.html#assert_assert_notstrictequal_actual_expected_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected == 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ')' : '.') +
  (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected && !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);
/**
 * Node.js standard [`assert.throws`](http://nodejs.org/api/assert.html#assert_assert_throws_block_error_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [message]
 */
assert.throws = function(/*block, error, message*/) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
/**
 * Node.js standard [`assert.doesNotThrow`](http://nodejs.org/api/assert.html#assert_assert_doesnotthrow_block_message).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Function} block
 * @param {String} [message]
 */
assert.doesNotThrow = function(/*block, message*/) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

/**
 * Node.js standard [`assert.ifError`](http://nodejs.org/api/assert.html#assert_assert_iferror_value).
 * @static
 * @memberOf should
 * @category assertion assert
 * @param {Error} err
 */
assert.ifError = function(err) {
  if (err) {
    throw err;
  }
};

},{"./../assertion":136,"should-equal":154}],139:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var assert = require('./_assert');
var AssertionError = require('../assertion-error');

module.exports = function(should) {
  var i = should.format;

  /*
   * Expose assert to should
   *
   * This allows you to do things like below
   * without require()ing the assert module.
   *
   *    should.equal(foo.bar, undefined);
   *
   */
  util.merge(should, assert);

  /**
   * Assert _obj_ exists, with optional message.
   *
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.exist(1);
   * should.exist(new Date());
   */
  should.exist = should.exists = function(obj, msg) {
    if (null == obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to exist'), stackStartFunction: should.exist
      });
    }
  };

  should.not = {};
  /**
   * Asserts _obj_ does not exist, with optional message.
   *
   * @name not.exist
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.not.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.not.exist(null);
   * should.not.exist(void 0);
   */
  should.not.exist = should.not.exists = function(obj, msg) {
    if (null != obj) {
      throw new AssertionError({
        message: msg || ('expected ' + i(obj) + ' to not exist'), stackStartFunction: should.not.exist
      });
    }
  };
};

},{"../assertion-error":135,"../util":152,"./_assert":138}],140:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Assert given object is exactly `true`.
   *
   * @name true
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#True
   * @param {string} [message] Optional message
   * @example
   *
   * (true).should.be.true();
   * false.should.not.be.true();
   *
   * ({ a: 10}).should.not.be.true();
   */
  Assertion.add('true', function(message) {
    this.is.exactly(true, message);
  });

  Assertion.alias('true', 'True');

  /**
   * Assert given object is exactly `false`.
   *
   * @name false
   * @memberOf Assertion
   * @category assertion bool
   * @alias Assertion#False
   * @param {string} [message] Optional message
   * @example
   *
   * (true).should.not.be.false();
   * false.should.be.false();
   */
  Assertion.add('false', function(message) {
    this.is.exactly(false, message);
  });

  Assertion.alias('false', 'False');

  /**
   * Assert given object is thuthy according javascript type conversions.
   *
   * @name ok
   * @memberOf Assertion
   * @category assertion bool
   * @example
   *
   * (true).should.be.ok();
   * ''.should.not.be.ok();
   * should(null).not.be.ok();
   * should(void 0).not.be.ok();
   *
   * (10).should.be.ok();
   * (0).should.not.be.ok();
   */
  Assertion.add('ok', function() {
    this.params = { operator: 'to be truthy' };

    this.assert(this.obj);
  });
};

},{}],141:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Simple chaining. It actually do nothing.
   *
   * @memberOf Assertion
   * @name be
   * @property {should.Assertion} be
   * @alias Assertion#an
   * @alias Assertion#of
   * @alias Assertion#a
   * @alias Assertion#and
   * @alias Assertion#have
   * @alias Assertion#has
   * @alias Assertion#with
   * @alias Assertion#is
   * @alias Assertion#which
   * @alias Assertion#the
   * @alias Assertion#it
   * @category assertion chaining
   */
  ['an', 'of', 'a', 'and', 'be', 'has', 'have', 'with', 'is', 'which', 'the', 'it'].forEach(function(name) {
    Assertion.addChain(name);
  });
};

},{}],142:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Assert that given object contain something that equal to `other`. It uses `should-equal` for equality checks.
   * If given object is array it search that one of elements was equal to `other`.
   * If given object is string it checks if `other` is a substring - expected that `other` is a string.
   * If given object is Object it checks that `other` is a subobject - expected that `other` is a object.
   *
   * @name containEql
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [1, 2, 3].should.containEql(1);
   * [{ a: 1 }, 'a', 10].should.containEql({ a: 1 });
   *
   * 'abc'.should.containEql('b');
   * 'ab1c'.should.containEql(1);
   *
   * ({ a: 10, c: { d: 10 }}).should.containEql({ a: 10 });
   * ({ a: 10, c: { d: 10 }}).should.containEql({ c: { d: 10 }});
   * ({ a: 10, c: { d: 10 }}).should.containEql({ b: 10 });
   * // throws AssertionError: expected { a: 10, c: { d: 10 } } to contain { b: 10 }
   * //            expected { a: 10, c: { d: 10 } } to have property b
   */
  Assertion.add('containEql', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    this.is.not.null().and.not.undefined();

    var obj = this.obj;

    if (typeof obj == 'string') {
      this.assert(obj.indexOf(String(other)) >= 0);
    } else if (util.isIndexable(obj)) {
      this.assert(util.some(obj, function(v) {
        return eql(v, other).result;
      }));
    } else {
      this.have.properties(other);
    }
  });

  /**
   * Assert that given object is contain equally structured object on the same depth level.
   * If given object is an array and `other` is an array it checks that the eql elements is going in the same sequence in given array (recursive)
   * If given object is an object it checks that the same keys contain deep equal values (recursive)
   * On other cases it try to check with `.eql`
   *
   * @name containDeepOrdered
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeepOrdered([1, 2]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeepOrdered([ 1, [ 2, 3 ]]);
   *
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({a: 10});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {c: 10}});
   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {d: [1, 3]}});
   */
  Assertion.add('containDeepOrdered', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    var obj = this.obj;
    if (typeof obj == 'string') {// expect other to be string
      this.is.equal(String(other));
    } else if (util.isIndexable(obj) && util.isIndexable(other)) {
      for (var objIdx = 0, otherIdx = 0, objLength = util.length(obj), otherLength = util.length(other); objIdx < objLength && otherIdx < otherLength; objIdx++) {
        try {
          should(obj[objIdx]).containDeepOrdered(other[otherIdx]);
          otherIdx++;
        } catch (e) {
          if (e instanceof should.AssertionError) {
            continue;
          }
          throw e;
        }
      }

      this.assert(otherIdx === otherLength);
    } else if (obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
      util.forEach(other, function(value, key) {
        should(obj[key]).containDeepOrdered(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if (util.isEmptyObject(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

  /**
   * The same like `Assertion#containDeepOrdered` but all checks on arrays without order.
   *
   * @name containDeep
   * @memberOf Assertion
   * @category assertion contain
   * @param {*} other Nested object
   * @example
   *
   * [ 1, 2, 3].should.containDeep([2, 1]);
   * [ 1, 2, [ 1, 2, 3 ]].should.containDeep([ 1, [ 3, 1 ]]);
   */
  Assertion.add('containDeep', function(other) {
    this.params = {operator: 'to contain ' + i(other)};

    var obj = this.obj;
    if (typeof obj == 'string') {// expect other to be string
      this.is.equal(String(other));
    } else if (util.isIndexable(obj) && util.isIndexable(other)) {
      var usedKeys = {};
      util.forEach(other, function(otherItem) {
        this.assert(util.some(obj, function(item, index) {
          if (index in usedKeys) return false;

          try {
            should(item).containDeep(otherItem);
            usedKeys[index] = true;
            return true;
          } catch (e) {
            if (e instanceof should.AssertionError) {
              return false;
            }
            throw e;
          }
        }));
      }, this);
    } else if (obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
      util.forEach(other, function(value, key) {
        should(obj[key]).containDeep(value);
      });

      // if both objects is empty means we finish traversing - and we need to compare for hidden values
      if (util.isEmptyObject(other)) {
        this.eql(other);
      }
    } else {
      this.eql(other);
    }
  });

};

},{"../util":152,"should-equal":154}],143:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var eql = require('should-equal');
var type = require('should-type');
var util = require('../util');

function formatEqlResult(r, a, b) {
  return ((r.path.length > 0 ? 'at ' + r.path.map(util.formatProp).join(' -> ') : '') +
  (r.a === a ? '' : ', A has ' + util.format(r.a)) +
  (r.b === b ? '' : ' and B has ' + util.format(r.b)) +
  (r.showReason ? ' because ' + r.reason : '')).trim();
}

module.exports = function(should, Assertion) {

  /**
   * Deep object equality comparison. For full spec see [`should-equal tests`](https://github.com/shouldjs/equal/blob/master/test.js).
   *
   * @name eql
   * @memberOf Assertion
   * @category assertion equality
   * @alias Assertion#deepEqual
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.eql(10);
   * ('10').should.not.be.eql(10);
   * (-0).should.not.be.eql(+0);
   *
   * NaN.should.be.eql(NaN);
   *
   * ({ a: 10}).should.be.eql({ a: 10 });
   * [ 'a' ].should.not.be.eql({ '0': 'a' });
   */
  Assertion.add('eql', function(val, description) {
    this.params = {operator: 'to equal', expected: val, message: description};

    var result = eql(this.obj, val, should.config);
    this.params.details = result.result ? '' : formatEqlResult(result, this.obj, val);

    this.params.showDiff = eql(type(this.obj), type(val)).result;

    this.assert(result.result);
  });

  /**
   * Exact comparison using ===.
   *
   * @name equal
   * @memberOf Assertion
   * @category assertion equality
   * @alias Assertion#exactly
   * @param {*} val Expected value
   * @param {string} [description] Optional message
   * @example
   *
   * 10.should.be.equal(10);
   * 'a'.should.be.exactly('a');
   *
   * should(null).be.exactly(null);
   */
  Assertion.add('equal', function(val, description) {
    this.params = {operator: 'to be', expected: val, message: description};

    this.params.showDiff = eql(type(this.obj), type(val)).result;

    this.assert(val === this.obj);
  });

  Assertion.alias('equal', 'exactly');
  Assertion.alias('eql', 'deepEqual');

  function addOneOf(name, message, method) {
    Assertion.add(name, function(vals) {
      if (arguments.length !== 1) {
        vals = Array.prototype.slice.call(arguments);
      } else {
        should(vals).be.Array();
      }

      this.params = {operator: message, expected: vals};

      var obj = this.obj;
      var found = false;

      util.forEach(vals, function(val) {
        try {
          should(val)[method](obj);
          found = true;
          return false;
        } catch (e) {
          if (e instanceof should.AssertionError) {
            return;//do nothing
          }
          throw e;
        }
      });

      this.assert(found);
    });
  }

  /**
   * Exact comparison using === to be one of supplied objects.
   *
   * @name equalOneOf
   * @memberOf Assertion
   * @category assertion equality
   * @param {Array|*} vals Expected values
   * @example
   *
   * 'ab'.should.be.equalOneOf('a', 10, 'ab');
   * 'ab'.should.be.equalOneOf(['a', 10, 'ab']);
   */
  addOneOf('equalOneOf', 'to be equals one of', 'equal');

  /**
   * Exact comparison using .eql to be one of supplied objects.
   *
   * @name oneOf
   * @memberOf Assertion
   * @category assertion equality
   * @param {Array|*} vals Expected values
   * @example
   *
   * ({a: 10}).should.be.oneOf('a', 10, 'ab', {a: 10});
   * ({a: 10}).should.be.oneOf(['a', 10, 'ab', {a: 10}]);
   */
  addOneOf('oneOf', 'to be one of', 'eql');

};

},{"../util":152,"should-equal":154,"should-type":157}],144:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */
var util = require('../util');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Assert given function throws error with such message.
   *
   * @name throw
   * @memberOf Assertion
   * @category assertion errors
   * @alias Assertion#throwError
   * @param {string|RegExp|Function|Object|GeneratorFunction|GeneratorObject} [message] Message to match or properties
   * @param {Object} [properties] Optional properties that will be matched to thrown error
   * @example
   *
   * (function(){ throw new Error('fail') }).should.throw();
   * (function(){ throw new Error('fail') }).should.throw('fail');
   * (function(){ throw new Error('fail') }).should.throw(/fail/);
   *
   * (function(){ throw new Error('fail') }).should.throw(Error);
   * var error = new Error();
   * error.a = 10;
   * (function(){ throw error; }).should.throw(Error, { a: 10 });
   * (function(){ throw error; }).should.throw({ a: 10 });
   * (function*() {
   *   yield throwError();
   * }).should.throw();
   */
  Assertion.add('throw', function(message, properties) {
    var fn = this.obj;
    var err = {};
    var errorInfo = '';
    var thrown = false;

    if (util.isGeneratorFunction(fn)) {
      return should(fn()).throw(message, properties);
    } else if (util.isGeneratorObject(fn)) {
      return should(fn.next.bind(fn)).throw(message, properties);
    }

    this.is.a.Function();

    var errorMatched = true;

    try {
      fn();
    } catch (e) {
      thrown = true;
      err = e;
    }

    if (thrown) {
      if (message) {
        if ('string' == typeof message) {
          errorMatched = message == err.message;
        } else if (message instanceof RegExp) {
          errorMatched = message.test(err.message);
        } else if ('function' == typeof message) {
          errorMatched = err instanceof message;
        } else if (null != message) {
          try {
            should(err).match(message);
          } catch (e) {
            if (e instanceof should.AssertionError) {
              errorInfo = ": " + e.message;
              errorMatched = false;
            } else {
              throw e;
            }
          }
        }

        if (!errorMatched) {
          if ('string' == typeof message || message instanceof RegExp) {
            errorInfo = " with a message matching " + i(message) + ", but got '" + err.message + "'";
          } else if ('function' == typeof message) {
            errorInfo = " of type " + util.functionName(message) + ", but got " + util.functionName(err.constructor);
          }
        } else if ('function' == typeof message && properties) {
          try {
            should(err).match(properties);
          } catch (e) {
            if (e instanceof should.AssertionError) {
              errorInfo = ": " + e.message;
              errorMatched = false;
            } else {
              throw e;
            }
          }
        }
      } else {
        errorInfo = " (got " + i(err) + ")";
      }
    }

    this.params = { operator: 'to throw exception' + errorInfo };

    this.assert(thrown);
    this.assert(errorMatched);
  });

  Assertion.alias('throw', 'throwError');
};

},{"../util":152}],145:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

module.exports = function(should, Assertion) {
  var i = should.format;

  /**
   * Asserts if given object match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp and given object is a string check on matching with regexp
   * If `other` is a regexp and given object is an array check if all elements matched regexp
   * If `other` is a regexp and given object is an object check values on matching regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * If `other` is an object check if the same keys matched with above rules
   * All other cases failed.
   *
   * Usually it is right idea to add pre type assertions, like `.String()` or `.Object()` to be sure assertions will do what you are expecting.
   * Object iteration happen by keys (properties with enumerable: true), thus some objects can cause small pain. Typical example is js
   * Error - it by default has 2 properties `name` and `message`, but they both non-enumerable. In this case make sure you specify checking props (see examples).
   *
   * @name match
   * @memberOf Assertion
   * @category assertion matching
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * 'foobar'.should.match(/^foo/);
   * 'foobar'.should.not.match(/^bar/);
   *
   * ({ a: 'foo', c: 'barfoo' }).should.match(/foo$/);
   *
   * ['a', 'b', 'c'].should.match(/[a-z]/);
   *
   * (5).should.not.match(function(n) {
   *   return n < 0;
   * });
   * (5).should.not.match(function(it) {
   *    it.should.be.an.Array();
   * });
   * ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
   * .match({ a: 10, b: /c$/, c: function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   *
   * [10, 'abc', { d: 10 }, 0].should
   * .match({ '0': 10, '1': /c$/, '2': function(it) {
   *    return it.should.have.property('d', 10);
   * }});
   *
   * var myString = 'abc';
   *
   * myString.should.be.a.String().and.match(/abc/);
   *
   * myString = {};
   *
   * myString.should.match(/abc/); //yes this will pass
   * //better to do
   * myString.should.be.an.Object().and.not.empty().and.match(/abc/);//fixed
   *
   * (new Error('boom')).should.match(/abc/);//passed because no keys
   * (new Error('boom')).should.not.match({ message: /abc/ });//check specified property
   */
  Assertion.add('match', function(other, description) {
    this.params = {operator: 'to match ' + i(other), message: description};

    if (!eql(this.obj, other).result) {
      if (other instanceof RegExp) { // something - regex

        if (typeof this.obj == 'string') {

          this.assert(other.exec(this.obj));
        } else if (util.isIndexable(this.obj)) {
          util.forEach(this.obj, function(item) {
            this.assert(other.exec(item));// should we try to convert to String and exec?
          }, this);
        } else if (null != this.obj && typeof this.obj == 'object') {

          var notMatchedProps = [], matchedProps = [];
          util.forEach(this.obj, function(value, name) {
            if (other.exec(value)) matchedProps.push(util.formatProp(name));
            else notMatchedProps.push(util.formatProp(name) + ' (' + i(value) + ')');
          }, this);

          if (notMatchedProps.length)
            this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
          if (matchedProps.length)
            this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

          this.assert(notMatchedProps.length === 0);
        } // should we try to convert to String and exec?
      } else if (typeof other == 'function') {
        var res;

        res = other(this.obj);

        //if(res instanceof Assertion) {
        //  this.params.operator += '\n    ' + res.getMessage();
        //}

        //if we throw exception ok - it is used .should inside
        if (typeof res == 'boolean') {
          this.assert(res); // if it is just boolean function assert on it
        }
      } else if (other != null && this.obj != null && typeof other == 'object' && typeof this.obj == 'object') { // try to match properties (for Object and Array)
        notMatchedProps = [];
        matchedProps = [];

        util.forEach(other, function(value, key) {
          try {
            should(this.obj).have.property(key).which.match(value);
            matchedProps.push(util.formatProp(key));
          } catch (e) {
            if (e instanceof should.AssertionError) {
              notMatchedProps.push(util.formatProp(key) + ' (' + i(this.obj[key]) + ')');
            } else {
              throw e;
            }
          }
        }, this);

        if (notMatchedProps.length)
          this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
        if (matchedProps.length)
          this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

        this.assert(notMatchedProps.length === 0);
      } else {
        this.assert(false);
      }
    }
  });

  /**
   * Asserts if given object values or array elements all match `other` object, using some assumptions:
   * First object matched if they are equal,
   * If `other` is a regexp - matching with regexp
   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
   * All other cases check if this `other` equal to each element
   *
   * @name matchEach
   * @memberOf Assertion
   * @category assertion matching
   * @alias Assertion#matchEvery
   * @param {*} other Object to match
   * @param {string} [description] Optional message
   * @example
   * [ 'a', 'b', 'c'].should.matchEach(/\w+/);
   * [ 'a', 'a', 'a'].should.matchEach('a');
   *
   * [ 'a', 'a', 'a'].should.matchEach(function(value) { value.should.be.eql('a') });
   *
   * { a: 'a', b: 'a', c: 'a' }.should.matchEach(function(value) { value.should.be.eql('a') });
   */
  Assertion.add('matchEach', function(other, description) {
    this.params = {operator: 'to match each ' + i(other), message: description};

    util.forEach(this.obj, function(value) {
      should(value).match(other);
    }, this);
  });

  /**
  * Asserts if any of given object values or array elements match `other` object, using some assumptions:
  * First object matched if they are equal,
  * If `other` is a regexp - matching with regexp
  * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
  * All other cases check if this `other` equal to each element
  *
  * @name matchAny
  * @memberOf Assertion
  * @category assertion matching
  * @param {*} other Object to match
  * @alias Assertion#matchSome
  * @param {string} [description] Optional message
  * @example
  * [ 'a', 'b', 'c'].should.matchAny(/\w+/);
  * [ 'a', 'b', 'c'].should.matchAny('a');
  *
  * [ 'a', 'b', 'c'].should.matchAny(function(value) { value.should.be.eql('a') });
  *
  * { a: 'a', b: 'b', c: 'c' }.should.matchAny(function(value) { value.should.be.eql('a') });
  */
  Assertion.add('matchAny', function(other, description) {
    this.params = {operator: 'to match any ' + i(other), message: description};

    this.assert(util.some(this.obj, function(value) {
      try {
        should(value).match(other);
        return true;
      } catch (e) {
        if (e instanceof should.AssertionError) {
          // Caught an AssertionError, return false to the iterator
          return false;
        }
        throw e;
      }
    }));
  });

  Assertion.alias('matchAny', 'matchSome');
  Assertion.alias('matchEach', 'matchEvery');
};

},{"../util":152,"should-equal":154}],146:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {

  /**
   * Assert given object is NaN
   * @name NaN
   * @memberOf Assertion
   * @category assertion numbers
   * @example
   *
   * (10).should.not.be.NaN();
   * NaN.should.be.NaN();
   */
  Assertion.add('NaN', function() {
    this.params = { operator: 'to be NaN' };

    this.assert(this.obj !== this.obj);
  });

  /**
   * Assert given object is not finite (positive or negative)
   *
   * @name Infinity
   * @memberOf Assertion
   * @category assertion numbers
   * @example
   *
   * (10).should.not.be.Infinity();
   * NaN.should.not.be.Infinity();
   */
  Assertion.add('Infinity', function() {
    this.params = { operator: 'to be Infinity' };

    this.is.a.Number()
      .and.not.a.NaN()
      .and.assert(!isFinite(this.obj));
  });

  /**
   * Assert given number between `start` and `finish` or equal one of them.
   *
   * @name within
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} start Start number
   * @param {number} finish Finish number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.within(0, 20);
   */
  Assertion.add('within', function(start, finish, description) {
    this.params = { operator: 'to be within ' + start + '..' + finish, message: description };

    this.assert(this.obj >= start && this.obj <= finish);
  });

  /**
   * Assert given number near some other `value` within `delta`
   *
   * @name approximately
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} value Center number
   * @param {number} delta Radius
   * @param {string} [description] Optional message
   * @example
   *
   * (9.99).should.be.approximately(10, 0.1);
   */
  Assertion.add('approximately', function(value, delta, description) {
    this.params = { operator: 'to be approximately ' + value + ' ±' + delta, message: description };

    this.assert(Math.abs(this.obj - value) <= delta);
  });

  /**
   * Assert given number above `n`.
   *
   * @name above
   * @alias Assertion#greaterThan
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.above(0);
   */
  Assertion.add('above', function(n, description) {
    this.params = { operator: 'to be above ' + n, message: description };

    this.assert(this.obj > n);
  });

  /**
   * Assert given number below `n`.
   *
   * @name below
   * @alias Assertion#lessThan
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (0).should.be.below(10);
   */
  Assertion.add('below', function(n, description) {
    this.params = { operator: 'to be below ' + n, message: description };

    this.assert(this.obj < n);
  });

  Assertion.alias('above', 'greaterThan');
  Assertion.alias('below', 'lessThan');

  /**
   * Assert given number above `n`.
   *
   * @name aboveOrEqual
   * @alias Assertion#greaterThanOrEqual
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (10).should.be.aboveOrEqual(0);
   * (10).should.be.aboveOrEqual(10);
   */
  Assertion.add('aboveOrEqual', function(n, description) {
    this.params = { operator: 'to be above or equal' + n, message: description };

    this.assert(this.obj >= n);
  });

  /**
   * Assert given number below `n`.
   *
   * @name belowOrEqual
   * @alias Assertion#lessThanOrEqual
   * @memberOf Assertion
   * @category assertion numbers
   * @param {number} n Margin number
   * @param {string} [description] Optional message
   * @example
   *
   * (0).should.be.belowOrEqual(10);
   * (0).should.be.belowOrEqual(0);
   */
  Assertion.add('belowOrEqual', function(n, description) {
    this.params = { operator: 'to be below or equal' + n, message: description };

    this.assert(this.obj <= n);
  });

  Assertion.alias('aboveOrEqual', 'greaterThanOrEqual');
  Assertion.alias('belowOrEqual', 'lessThanOrEqual');

};

},{}],147:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var PromisedAssertion = require('../assertion').PromisedAssertion;
var Assertion = require('../assertion');

module.exports = function(should) {
  /**
   * Assert given object is a Promise
   *
   * @name Promise
   * @memberOf Assertion
   * @category assertion promises
   * @example
   *
   * promise.should.be.Promise()
   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.a.Promise()
   * (10).should.not.be.a.Promise()
   */
  Assertion.add('Promise', function() {
    this.params = {operator: 'to be promise'};

    var obj = this.obj;

    should(obj).have.property('then')
      .which.is.a.Function();
  });

  /**
   * Assert given promise will be fulfilled. Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name fulfilled
   * @memberOf Assertion
   * @returns {Promise}
   * @category assertion promises
   * @example
   *
   * // don't forget to handle async nature
   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.fulfilled();
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise(resolve => resolve(10))
   *      .should.be.fulfilled();
   * });
   */
  Assertion.prototype.fulfilled = function Assertion$fulfilled() {
    this.params = {operator: 'to be fulfilled'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function next$onResolve(value) {
      if (that.negate) {
        that.fail();
      }
      return value;
    }, function next$onReject(err) {
      if (!that.negate) {
        that.params.operator += ', but it was rejected with ' + should.format(err);
        that.fail();
      }
      return err;
    });
  };

  /**
   * Assert given promise will be rejected. Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name rejected
   * @memberOf Assertion
   * @category assertion promises
   * @returns {Promise}
   * @example
   *
   * // don't forget to handle async nature
   * (new Promise(function(resolve, reject) { resolve(10); }))
   *    .should.not.be.rejected();
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise((resolve, reject) => reject(new Error('boom')))
   *      .should.be.rejected();
   * });
   */
  Assertion.prototype.rejected = function() {
    this.params = {operator: 'to be rejected'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function(value) {
      if (!that.negate) {
        that.params.operator += ', but it was fulfilled';
        if (arguments.length != 0) {
          that.params.operator += ' with ' + should.format(value);
        }
        that.fail();
      }
      return value;
    }, function next$onError(err) {
      if (that.negate) {
        that.fail();
      }
      return err;
    });
  };

  /**
   * Assert given promise will be fulfilled with some expected value (value compared using .eql).
   * Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name fulfilledWith
   * @memberOf Assertion
   * @category assertion promises
   * @returns {Promise}
   * @example
   *
   * // don't forget to handle async nature
   * (new Promise(function(resolve, reject) { resolve(10); }))
   *    .should.be.fulfilledWith(10);
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise((resolve, reject) => resolve(10))
   *       .should.be.fulfilledWith(10);
   * });
   */
  Assertion.prototype.fulfilledWith = function(expectedValue) {
    this.params = {operator: 'to be fulfilled with ' + should.format(expectedValue)};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function(value) {
      if (that.negate) {
        that.fail();
      }
      should(value).eql(expectedValue);
      return value;
    }, function next$onError(err) {
      if (!that.negate) {
        that.params.operator += ', but it was rejected with ' + should.format(err);
        that.fail();
      }
      return err;
    });
  };

  /**
   * Assert given promise will be rejected with some sort of error. Arguments is the same for Assertion#throw.
   * Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name rejectedWith
   * @memberOf Assertion
   * @category assertion promises
   * @returns {Promise}
   * @example
   *
   * function failedPromise() {
   *   return new Promise(function(resolve, reject) {
   *     reject(new Error('boom'))
   *   })
   * }
   * failedPromise().should.be.rejectedWith(Error);
   * failedPromise().should.be.rejectedWith('boom');
   * failedPromise().should.be.rejectedWith(/boom/);
   * failedPromise().should.be.rejectedWith(Error, { message: 'boom' });
   * failedPromise().should.be.rejectedWith({ message: 'boom' });
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return failedPromise().should.be.rejectedWith({ message: 'boom' });
   * });
   */
  Assertion.prototype.rejectedWith = function(message, properties) {
    this.params = {operator: 'to be rejected'};

    should(this.obj).be.a.Promise();

    var that = this;
    return this.obj.then(function(value) {
      if (!that.negate) {
        that.fail();
      }
      return value;
    }, function next$onError(err) {
      if (that.negate) {
        that.fail();
      }

      var errorMatched = true;
      var errorInfo = '';

      if ('string' === typeof message) {
        errorMatched = message === err.message;
      } else if (message instanceof RegExp) {
        errorMatched = message.test(err.message);
      } else if ('function' === typeof message) {
        errorMatched = err instanceof message;
      } else if (message !== null && typeof message === 'object') {
        try {
          should(err).match(message);
        } catch (e) {
          if (e instanceof should.AssertionError) {
            errorInfo = ': ' + e.message;
            errorMatched = false;
          } else {
            throw e;
          }
        }
      }

      if (!errorMatched) {
        if ( typeof message === 'string' || message instanceof RegExp) {
          errorInfo = ' with a message matching ' + should.format(message) + ", but got '" + err.message + "'";
        } else if ('function' === typeof message) {
          errorInfo = ' of type ' + util.functionName(message) + ', but got ' + util.functionName(err.constructor);
        }
      } else if ('function' === typeof message && properties) {
        try {
          should(err).match(properties);
        } catch (e) {
          if (e instanceof should.AssertionError) {
            errorInfo = ': ' + e.message;
            errorMatched = false;
          } else {
            throw e;
          }
        }
      }

      that.params.operator += errorInfo;

      that.assert(errorMatched);

      return err;
    });
  };

  /**
   * Assert given object is promise and wrap it in PromisedAssertion, which has all properties of Assertion.
   * That means you can chain as with usual Assertion.
   * Result of assertion is still .thenable and should be handled accordingly.
   *
   * @name finally
   * @memberOf Assertion
   * @alias Assertion#eventually
   * @category assertion promises
   * @returns {PromisedAssertion} Like Assertion, but .then this.obj in Assertion
   * @example
   *
   * (new Promise(function(resolve, reject) { resolve(10); }))
   *    .should.be.eventually.equal(10);
   *
   * // test example with mocha it is possible to return promise
   * it('is async', () => {
   *    return new Promise(resolve => resolve(10))
   *      .should.be.finally.equal(10);
   * });
   */
  Object.defineProperty(Assertion.prototype, 'finally', {
    get: function() {
      should(this.obj).be.a.Promise();

      var that = this;

      return new PromisedAssertion(this.obj.then(function(obj) {
        var a = should(obj);

        a.negate = that.negate;
        a.anyOne = that.anyOne;

        return a;
      }));
    }
  });

  Assertion.alias('finally', 'eventually');
};

},{"../assertion":136,"../util":152}],148:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

var aSlice = Array.prototype.slice;

module.exports = function(should, Assertion) {
  var i = should.format;
  /**
   * Asserts given object has some descriptor. **On success it change given object to be value of property**.
   *
   * @name propertyWithDescriptor
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {Object} desc Descriptor like used in Object.defineProperty (not required to add all properties)
   * @example
   *
   * ({ a: 10 }).should.have.propertyWithDescriptor('a', { enumerable: true });
   */
  Assertion.add('propertyWithDescriptor', function(name, desc) {
    this.params = {actual: this.obj, operator: 'to have own property with descriptor ' + i(desc)};
    var obj = this.obj;
    this.have.ownProperty(name);
    should(Object.getOwnPropertyDescriptor(Object(obj), name)).have.properties(desc);
  });

  function processPropsArgs() {
    var args = {};
    if (arguments.length > 1) {
      args.names = aSlice.call(arguments);
    } else {
      var arg = arguments[0];
      if (typeof arg === 'string') {
        args.names = [arg];
      } else if (util.isIndexable(arg)) {
        args.names = arg;
      } else {
        args.names = Object.keys(arg);
        args.values = arg;
      }
    }
    return args;
  }


  /**
   * Asserts given object has enumerable property with optionally value. **On success it change given object to be value of property**.
   *
   * @name enumerable
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {*} [val] Optional property value to check
   * @example
   *
   * ({ a: 10 }).should.have.enumerable('a');
   */
  Assertion.add('enumerable', function(name, val) {
    name = util.convertPropertyName(name);

    this.params = {
      operator: "to have enumerable property " + util.formatProp(name) + (arguments.length > 1 ? " equal to " + i(val): "")
    };

    var desc = { enumerable: true };
    if (arguments.length > 1) desc.value = val;
    this.have.propertyWithDescriptor(name, desc);
  });

  /**
   * Asserts given object has enumerable properties
   *
   * @name enumerables
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string|Object} names Names of property
   * @example
   *
   * ({ a: 10, b: 10 }).should.have.enumerables('a');
   */
  Assertion.add('enumerables', function(/*names*/) {
    var args = processPropsArgs.apply(null, arguments);

    this.params = {
      operator: "to have enumerables " + args.names.map(util.formatProp)
    };

    var obj = this.obj;
    args.names.forEach(function(name) {
      should(obj).have.enumerable(name);
    });
  });

  /**
   * Asserts given object has property with optionally value. **On success it change given object to be value of property**.
   *
   * @name property
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {*} [val] Optional property value to check
   * @example
   *
   * ({ a: 10 }).should.have.property('a');
   */
  Assertion.add('property', function(name, val) {
    name = util.convertPropertyName(name);
    if (arguments.length > 1) {
      var p = {};
      p[name] = val;
      this.have.properties(p);
    } else {
      this.have.properties(name);
    }
    this.obj = this.obj[name];
  });

  /**
   * Asserts given object has properties. On this method affect .any modifier, which allow to check not all properties.
   *
   * @name properties
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string|Object} names Names of property
   * @example
   *
   * ({ a: 10 }).should.have.properties('a');
   * ({ a: 10, b: 20 }).should.have.properties([ 'a' ]);
   * ({ a: 10, b: 20 }).should.have.properties({ b: 20 });
   */
  Assertion.add('properties', function(names) {
    var values = {};
    if (arguments.length > 1) {
      names = aSlice.call(arguments);
    } else if (!Array.isArray(names)) {
      if (typeof names == 'string' || typeof names == 'symbol') {
        names = [names];
      } else {
        values = names;
        names = Object.keys(names);
      }
    }

    var obj = Object(this.obj), missingProperties = [];

    //just enumerate properties and check if they all present
    names.forEach(function(name) {
      if (!(name in obj)) missingProperties.push(util.formatProp(name));
    });

    var props = missingProperties;
    if (props.length === 0) {
      props = names.map(util.formatProp);
    } else if (this.anyOne) {
      props = names.filter(function(name) {
        return missingProperties.indexOf(util.formatProp(name)) < 0;
      }).map(util.formatProp);
    }

    var operator = (props.length === 1 ?
        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

    this.params = {obj: this.obj, operator: operator};

    //check that all properties presented
    //or if we request one of them that at least one them presented
    this.assert(missingProperties.length === 0 || (this.anyOne && missingProperties.length != names.length));

    // check if values in object matched expected
    var valueCheckNames = Object.keys(values);
    if (valueCheckNames.length) {
      var wrongValues = [];
      props = [];

      // now check values, as there we have all properties
      valueCheckNames.forEach(function(name) {
        var value = values[name];
        if (!eql(obj[name], value).result) {
          wrongValues.push(util.formatProp(name) + ' of ' + i(value) + ' (got ' + i(obj[name]) + ')');
        } else {
          props.push(util.formatProp(name) + ' of ' + i(value));
        }
      });

      if ((wrongValues.length !== 0 && !this.anyOne) || (this.anyOne && props.length === 0)) {
        props = wrongValues;
      }

      operator = (props.length === 1 ?
        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

      this.params = {obj: this.obj, operator: operator};

      //if there is no not matched values
      //or there is at least one matched
      this.assert(wrongValues.length === 0 || (this.anyOne && wrongValues.length != valueCheckNames.length));
    }
  });

  /**
   * Asserts given object has property `length` with given value `n`
   *
   * @name length
   * @alias Assertion#lengthOf
   * @memberOf Assertion
   * @category assertion property
   * @param {number} n Expected length
   * @param {string} [description] Optional message
   * @example
   *
   * [1, 2].should.have.length(2);
   */
  Assertion.add('length', function(n, description) {
    this.have.property('length', n, description);
  });

  Assertion.alias('length', 'lengthOf');

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * Asserts given object has own property. **On success it change given object to be value of property**.
   *
   * @name ownProperty
   * @alias Assertion#hasOwnProperty
   * @memberOf Assertion
   * @category assertion property
   * @param {string} name Name of property
   * @param {string} [description] Optional message
   * @example
   *
   * ({ a: 10 }).should.have.ownProperty('a');
   */
  Assertion.add('ownProperty', function(name, description) {
    name = util.convertPropertyName(name);
    this.params = {
      actual: this.obj,
      operator: 'to have own property ' + util.formatProp(name),
      message: description
    };

    this.assert(hasOwnProperty.call(this.obj, name));

    this.obj = this.obj[name];
  });

  Assertion.alias('ownProperty', 'hasOwnProperty');

  /**
   * Asserts given object is empty. For strings, arrays and arguments it checks .length property, for objects it checks keys.
   *
   * @name empty
   * @memberOf Assertion
   * @category assertion property
   * @example
   *
   * ''.should.be.empty();
   * [].should.be.empty();
   * ({}).should.be.empty();
   */
  Assertion.add('empty', function() {
    this.params = {operator: 'to be empty'};

    if (util.length(this.obj) !== void 0) {
      should(this.obj).have.property('length', 0);
    } else {
      var obj = Object(this.obj); // wrap to reference for booleans and numbers
      for (var prop in obj) {
        should(this.obj).not.have.ownProperty(prop);
      }
    }
  }, true);

  /**
   * Asserts given object has exact keys. Compared to `properties`, `keys` does not accept Object as a argument.
   *
   * @name keys
   * @alias Assertion#key
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string} [keys] Keys to check
   * @example
   *
   * ({ a: 10 }).should.have.keys('a');
   * ({ a: 10, b: 20 }).should.have.keys('a', 'b');
   * ({ a: 10, b: 20 }).should.have.keys([ 'a', 'b' ]);
   * ({}).should.have.keys();
   */
  Assertion.add('keys', function(keys) {
    if (arguments.length > 1) keys = aSlice.call(arguments);
    else if (arguments.length === 1 && typeof keys === 'string') keys = [keys];
    else if (arguments.length === 0) keys = [];

    keys = keys.map(String);

    var obj = Object(this.obj);

    // first check if some keys are missing
    var missingKeys = [];
    keys.forEach(function(key) {
      if (!hasOwnProperty.call(this.obj, key))
        missingKeys.push(util.formatProp(key));
    }, this);

    // second check for extra keys
    var extraKeys = [];
    Object.keys(obj).forEach(function(key) {
      if (keys.indexOf(key) < 0) {
        extraKeys.push(util.formatProp(key));
      }
    });

    var verb = keys.length === 0 ? 'to be empty' :
    'to have ' + (keys.length === 1 ? 'key ' : 'keys ');

    this.params = {operator: verb + keys.map(util.formatProp).join(', ')};

    if (missingKeys.length > 0)
      this.params.operator += '\n\tmissing keys: ' + missingKeys.join(', ');

    if (extraKeys.length > 0)
      this.params.operator += '\n\textra keys: ' + extraKeys.join(', ');

    this.assert(missingKeys.length === 0 && extraKeys.length === 0);
  });

  Assertion.alias("keys", "key");

  /**
   * Asserts given object has nested property in depth by path. **On success it change given object to be value of final property**.
   *
   * @name propertyByPath
   * @memberOf Assertion
   * @category assertion property
   * @param {Array|...string} properties Properties path to search
   * @example
   *
   * ({ a: {b: 10}}).should.have.propertyByPath('a', 'b').eql(10);
   */
  Assertion.add('propertyByPath', function(properties) {
    if (arguments.length > 1) properties = aSlice.call(arguments);
    else if (arguments.length === 1 && typeof properties == 'string') properties = [properties];
    else if (arguments.length === 0) properties = [];

    var allProps = properties.map(util.formatProp);

    properties = properties.map(String);

    var obj = should(Object(this.obj));

    var foundProperties = [];

    var currentProperty;
    while (properties.length) {
      currentProperty = properties.shift();
      this.params = {operator: 'to have property by path ' + allProps.join(', ') + ' - failed on ' + util.formatProp(currentProperty)};
      obj = obj.have.property(currentProperty);
      foundProperties.push(currentProperty);
    }

    this.params = {obj: this.obj, operator: 'to have property by path ' + allProps.join(', ')};

    this.obj = obj.obj;
  });
};

},{"../util":152,"should-equal":154}],149:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

module.exports = function(should, Assertion) {
  /**
   * Assert given string starts with prefix
   * @name startWith
   * @memberOf Assertion
   * @category assertion strings
   * @param {string} str Prefix
   * @param {string} [description] Optional message
   * @example
   *
   * 'abc'.should.startWith('a');
   */
  Assertion.add('startWith', function(str, description) {
    this.params = { operator: 'to start with ' + should.format(str), message: description };

    this.assert(0 === this.obj.indexOf(str));
  });

  /**
   * Assert given string ends with prefix
   * @name endWith
   * @memberOf Assertion
   * @category assertion strings
   * @param {string} str Prefix
   * @param {string} [description] Optional message
   * @example
   *
   * 'abca'.should.endWith('a');
   */
  Assertion.add('endWith', function(str, description) {
    this.params = { operator: 'to end with ' + should.format(str), message: description };

    this.assert(this.obj.indexOf(str, this.obj.length - str.length) >= 0);
  });
};

},{}],150:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');

module.exports = function(should, Assertion) {
  /**
   * Assert given object is number
   * @name Number
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Number', function() {
    this.params = {operator: 'to be a number'};

    this.have.type('number');
  });

  /**
   * Assert given object is arguments
   * @name arguments
   * @alias Assertion#Arguments
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('arguments', function() {
    this.params = {operator: 'to be arguments'};

    this.have.class('Arguments');
  });

  Assertion.alias('arguments', 'Arguments');

  /**
   * Assert given object has some type using `typeof`
   * @name type
   * @memberOf Assertion
   * @param {string} type Type name
   * @param {string} [description] Optional message
   * @category assertion types
   */
  Assertion.add('type', function(type, description) {
    this.params = {operator: 'to have type ' + type, message: description};

    should(typeof this.obj).be.exactly(type);
  });

  /**
   * Assert given object is instance of `constructor`
   * @name instanceof
   * @alias Assertion#instanceOf
   * @memberOf Assertion
   * @param {Function} constructor Constructor function
   * @param {string} [description] Optional message
   * @category assertion types
   */
  Assertion.add('instanceof', function(constructor, description) {
    this.params = {operator: 'to be an instance of ' + util.functionName(constructor), message: description};

    this.assert(Object(this.obj) instanceof constructor);
  });

  Assertion.alias('instanceof', 'instanceOf');

  /**
   * Assert given object is function
   * @name Function
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Function', function() {
    this.params = {operator: 'to be a function'};

    this.have.type('function');
  });

  /**
   * Assert given object is object
   * @name Object
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Object', function() {
    this.params = {operator: 'to be an object'};

    this.is.not.null().and.have.type('object');
  });

  /**
   * Assert given object is string
   * @name String
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('String', function() {
    this.params = {operator: 'to be a string'};

    this.have.type('string');
  });

  /**
   * Assert given object is array
   * @name Array
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Array', function() {
    this.params = {operator: 'to be an array'};

    this.have.class('Array');
  });

  /**
   * Assert given object is boolean
   * @name Boolean
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Boolean', function() {
    this.params = {operator: 'to be a boolean'};

    this.have.type('boolean');
  });

  /**
   * Assert given object is error
   * @name Error
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Error', function() {
    this.params = {operator: 'to be an error'};

    this.have.instanceOf(Error);
  });

  /**
   * Assert given object is a date
   * @name Date
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('Date', function() {
    this.params = {operator: 'to be a date'};

    this.have.instanceOf(Date);
  });

  /**
   * Assert given object is null
   * @name null
   * @alias Assertion#Null
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('null', function() {
    this.params = {operator: 'to be null'};

    this.assert(this.obj === null);
  });

  Assertion.alias('null', 'Null');

  /**
   * Assert given object has some internal [[Class]], via Object.prototype.toString call
   * @name class
   * @alias Assertion#Class
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('class', function(cls) {
    this.params = {operator: 'to have [[Class]] ' + cls};

    this.assert(Object.prototype.toString.call(this.obj) === '[object ' + cls + ']');
  });

  Assertion.alias('class', 'Class');

  /**
   * Assert given object is undefined
   * @name undefined
   * @alias Assertion#Undefined
   * @memberOf Assertion
   * @category assertion types
   */
  Assertion.add('undefined', function() {
    this.params = {operator: 'to be undefined'};

    this.assert(this.obj === void 0);
  });

  Assertion.alias('undefined', 'Undefined');

  /**
   * Assert given object supports es6 iterable protocol (just check
   * that object has property Symbol.iterator, which is a function)
   * @name iterable
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('iterable', function() {
    this.params = {operator: 'to be iterable'};

    should(this.obj).have.property(Symbol.iterator).which.is.a.Function();
  });

  /**
   * Assert given object supports es6 iterator protocol (just check
   * that object has property next, which is a function)
   * @name iterator
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('iterator', function() {
    this.params = {operator: 'to be iterator'};

    should(this.obj).have.property('next').which.is.a.Function();
  });

  /**
   * Assert given object is a generator object
   * @name generator
   * @memberOf Assertion
   * @category assertion es6
   */
  Assertion.add('generator', function() {
    this.params = {operator: 'to be generator'};

    should(this.obj).be.iterable
      .and.iterator
      .and.it.is.equal(this.obj[Symbol.iterator]());
  });
};

},{"../util":152}],151:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */


var util = require('./util');

/**
 * Our function should
 *
 * @param {*} obj Object to assert
 * @returns {should.Assertion} Returns new Assertion for beginning assertion chain
 * @example
 *
 * var should = require('should');
 * should('abc').be.a.String();
 */
function should(obj) {
  return (new should.Assertion(obj));
}

should.AssertionError = require('./assertion-error');
should.Assertion = require('./assertion');

should.format = util.format;
should.type = require('should-type');
should.util = util;

/**
 * Object with configuration.
 * It contains such properties:
 * * `checkProtoEql` boolean - Affect if `.eql` will check objects prototypes
 * * `plusZeroAndMinusZeroEqual` boolean - Affect if `.eql` will treat +0 and -0 as equal
 * Also it can contain options for should-format.
 *
 * @type {Object}
 * @memberOf should
 * @static
 * @example
 *
 * var a = { a: 10 }, b = Object.create(null);
 * b.a = 10;
 *
 * a.should.be.eql(b);
 * //not throws
 *
 * should.config.checkProtoEql = true;
 * a.should.be.eql(b);
 * //throws AssertionError: expected { a: 10 } to equal { a: 10 } (because A and B have different prototypes)
 */
should.config = require('./config');

// Expose should to external world.
exports = module.exports = should;

/**
 * Allow to extend given prototype with should property using given name. This getter will **unwrap** all standard wrappers like `Number`, `Boolean`, `String`.
 * Using `should(obj)` is the equivalent of using `obj.should` with known issues (like nulls and method calls etc).
 *
 * To add new assertions, need to use Assertion.add method.
 *
 * @param {string} [propertyName] Name of property to add. Default is `'should'`.
 * @param {Object} [proto] Prototype to extend with. Default is `Object.prototype`.
 * @memberOf should
 * @returns {{ name: string, descriptor: Object, proto: Object }} Descriptor enough to return all back
 * @static
 * @example
 *
 * var prev = should.extend('must', Object.prototype);
 *
 * 'abc'.must.startWith('a');
 *
 * var should = should.noConflict(prev);
 * should.not.exist(Object.prototype.must);
 */
should.extend = function(propertyName, proto) {
  propertyName = propertyName || 'should';
  proto = proto || Object.prototype;

  var prevDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);

  Object.defineProperty(proto, propertyName, {
    set: function() {
    },
    get: function() {
      return should(util.isWrapperType(this) ? this.valueOf() : this);
    },
    configurable: true
  });

  return { name: propertyName, descriptor: prevDescriptor, proto: proto };
};

/**
 * Delete previous extension. If `desc` missing it will remove default extension.
 *
 * @param {{ name: string, descriptor: Object, proto: Object }} [desc] Returned from `should.extend` object
 * @memberOf should
 * @returns {Function} Returns should function
 * @static
 * @example
 *
 * var should = require('should').noConflict();
 *
 * should(Object.prototype).not.have.property('should');
 *
 * var prev = should.extend('must', Object.prototype);
 * 'abc'.must.startWith('a');
 * should.noConflict(prev);
 *
 * should(Object.prototype).not.have.property('must');
 */
should.noConflict = function(desc) {
  desc = desc || should._prevShould;

  if (desc) {
    delete desc.proto[desc.name];

    if (desc.descriptor) {
      Object.defineProperty(desc.proto, desc.name, desc.descriptor);
    }
  }
  return should;
};

/**
 * Simple utility function for a bit more easier should assertion extension
 * @param {Function} f So called plugin function. It should accept 2 arguments: `should` function and `Assertion` constructor
 * @memberOf should
 * @returns {Function} Returns `should` function
 * @static
 * @example
 *
 * should.use(function(should, Assertion) {
 *   Assertion.add('asset', function() {
 *      this.params = { operator: 'to be asset' };
 *
 *      this.obj.should.have.property('id').which.is.a.Number();
 *      this.obj.should.have.property('path');
 *  })
 * })
 */
should.use = function(f) {
  f(should, should.Assertion);
  return this;
};

should
  .use(require('./ext/assert'))
  .use(require('./ext/chain'))
  .use(require('./ext/bool'))
  .use(require('./ext/number'))
  .use(require('./ext/eql'))
  .use(require('./ext/type'))
  .use(require('./ext/string'))
  .use(require('./ext/property'))
  .use(require('./ext/error'))
  .use(require('./ext/match'))
  .use(require('./ext/contain'))
  .use(require('./ext/promise'));

},{"./assertion":136,"./assertion-error":135,"./config":137,"./ext/assert":139,"./ext/bool":140,"./ext/chain":141,"./ext/contain":142,"./ext/eql":143,"./ext/error":144,"./ext/match":145,"./ext/number":146,"./ext/promise":147,"./ext/property":148,"./ext/string":149,"./ext/type":150,"./util":152,"should-type":157}],152:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var type = require('should-type');
var config = require('./config');

/**
 * Check if given obj just a primitive type wrapper
 * @param {Object} obj
 * @returns {boolean}
 * @private
 */
exports.isWrapperType = function(obj) {
  return obj instanceof Number || obj instanceof String || obj instanceof Boolean;
};

exports.merge = function(a, b) {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.forEach = function forEach(obj, f, context) {
  if (exports.isGeneratorFunction(obj)) {
    return forEach(obj(), f, context);
  } else if (exports.isGeneratorObject(obj)) {
    var value = obj.next();
    while (!value.done) {
      if (f.call(context, value.value, 'value', obj) === false)
        return;
      value = obj.next();
    }
  } else {
    for (var prop in obj) {
      if (hasOwnProperty.call(obj, prop)) {
        if (f.call(context, obj[prop], prop, obj) === false)
          return;
      }
    }
  }
};

exports.some = function(obj, f, context) {
  var res = false;
  exports.forEach(obj, function(value, key) {
    if (f.call(context, value, key, obj)) {
      res = true;
      return false;
    }
  }, context);
  return res;
};

exports.isEmptyObject = function(obj) {
  for (var prop in obj) {
    if (hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

exports.isIndexable = function(obj) {
  var t = type(obj);
  return (t.type === type.OBJECT && t.cls === type.ARRAY) ||
   (t.type === type.OBJECT && t.cls === type.BUFFER) ||
   (t.type === type.OBJECT && t.cls === type.ARGUMENTS) ||
   (t.type === type.OBJECT && t.cls === type.ARRAY_BUFFER) ||
   (t.type === type.OBJECT && t.cls === type.TYPED_ARRAY) ||
   (t.type === type.OBJECT && t.cls === type.DATA_VIEW) ||
   (t.type === type.OBJECT && t.cls === type.STRING) ||
   (t.type === type.STRING);
};

exports.length = function(obj) {
  var t = type(obj);
  switch (t.type) {
    case type.STRING:
      return obj.length;
    case type.OBJECT:
      switch (t.cls) {
        case type.ARRAY_BUFFER:
        case type.TYPED_ARRAY:
        case type.DATA_VIEW:
          return obj.byteLength;

        case type.ARRAY:
        case type.BUFFER:
        case type.ARGUMENTS:
        case type.FUNCTION:
          return obj.length;
      }
  }
};

exports.convertPropertyName = function(name) {
  if (typeof name == 'symbol') {
    return name;
  } else {
    return String(name);
  }
};

exports.isGeneratorObject = function(obj) {
  if (!obj) return false;

  return typeof obj.next == 'function' &&
          typeof obj[Symbol.iterator] == 'function' &&
          obj[Symbol.iterator]() === obj;
};

//TODO find better way
exports.isGeneratorFunction = function(f) {
  if (typeof f != 'function') return false;

  return /^function\s*\*\s*/.test(f.toString());
};

exports.format = function(value, opts) {
  return config.getFormatter(opts).format(value);
};

exports.functionName = require('should-format').Formatter.functionName;

exports.formatProp = function(value) {
  return config.getFormatter().formatPropertyName(String(value));
};

},{"./config":137,"should-format":155,"should-type":157}],153:[function(require,module,exports){
module.exports = function format(msg) {
  var args = arguments;
  for(var i = 1, l = args.length; i < l; i++) {
    msg = msg.replace(/%s/, args[i]);
  }
  return msg;
}

},{}],154:[function(require,module,exports){
var getType = require('should-type');
var format = require('./format');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function makeResult(r, path, reason, a, b) {
  var o = {result: r};
  if(!r) {
    o.path = path;
    o.reason = reason;
    o.a = a;
    o.b = b;
  }
  return o;
}

var EQUALS = makeResult(true);

function typeToString(t) {
  return t.type + (t.cls ? '(' + t.cls + (t.sub ? ' ' + t.sub : '') + ')' : '');
}



var REASON = {
  PLUS_0_AND_MINUS_0: '+0 is not equal to -0',
  DIFFERENT_TYPES: 'A has type %s and B has type %s',
  NAN_NUMBER: 'NaN is not equal to any number',
  EQUALITY: 'A is not equal to B',
  EQUALITY_PROTOTYPE: 'A and B have different prototypes',
  WRAPPED_VALUE: 'A wrapped value is not equal to B wrapped value',
  FUNCTION_SOURCES: 'function A is not equal to B by source code value (via .toString call)',
  MISSING_KEY: '%s has no key %s',
  CIRCULAR_VALUES: 'A has circular reference that was visited not in the same time as B',
  SET_MAP_MISSING_KEY: 'Set/Map missing key',
  MAP_VALUE_EQUALITY: 'Values of the same key in A and B is not equal'
};


function eqInternal(a, b, opts, stackA, stackB, path, fails) {
  var r = EQUALS;

  function result(comparison, reason) {
    if(arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2);
      reason = format.apply(null, [reason].concat(args));
    }
    var res = makeResult(comparison, path, reason, a, b);
    if(!comparison && opts.collectAllFails) {
      fails.push(res);
    }
    return res;
  }

  function checkPropertyEquality(property) {
    return eqInternal(a[property], b[property], opts, stackA, stackB, path.concat([property]), fails);
  }

  function checkAlso(a1, b1) {
    return eqInternal(a1, b1, opts, stackA, stackB, path, fails);
  }

  // equal a and b exit early
  if(a === b) {
    // check for +0 !== -0;
    return result(a !== 0 || (1 / a == 1 / b) || opts.plusZeroAndMinusZeroEqual, REASON.PLUS_0_AND_MINUS_0);
  }

  var l, p;

  var typeA = getType(a),
    typeB = getType(b);

  var key;

  // if objects has different types they are not equal
  var typeDifferent = typeA.type !== typeB.type || typeA.cls !== typeB.cls;

  if(typeDifferent || ((opts.checkSubType && typeA.sub !== typeB.sub) || !opts.checkSubType)) {
    return result(false, REASON.DIFFERENT_TYPES, typeToString(typeA), typeToString(typeB));
  }

  //early checks for types
  switch(typeA.type) {
    case 'number':
      // NaN !== NaN
      return (a !== a) ? result(b !== b, REASON.NAN_NUMBER)
        : result(a === b, REASON.EQUALITY);

    case 'boolean':
    case 'string':
      return result(a === b, REASON.EQUALITY);

    case 'function':
      // functions are compared by their source code
      r = checkAlso(a.toString(), b.toString());
      if(!r.result) {
        r.reason = REASON.FUNCTION_SOURCES;
        if(!opts.collectAllFails) return r;
      }

      break;//check user properties

    case 'object':
      // additional checks for object instances
      switch(typeA.cls) {
        // check regexp flags
        // TODO add es6 flags
        case 'regexp':
          p = ['source', 'global', 'multiline', 'lastIndex', 'ignoreCase'];
          while(p.length) {
            r = checkPropertyEquality(p.shift());
            if(!r.result && !opts.collectAllFails) return r;
          }
          break;//check user properties

        //check by timestamp only (using .valueOf)
        case 'date':
          if(+a !== +b) {
            r = result(false, REASON.EQUALITY);
            if(!r.result && !opts.collectAllFails) return r;
          }
          break;//check user properties

        //primitive type wrappers
        case 'number':
        case 'boolean':
        case 'string':
          //check their internal value
          r = checkAlso(a.valueOf(), b.valueOf());
          if(!r.result) {
            r.reason = REASON.WRAPPED_VALUE;
            if(!opts.collectAllFails) return r;
          }
          break;//check user properties

        //node buffer
        case 'buffer':
          //if length different it is obviously different
          r = checkPropertyEquality('length');
          if(!r.result && !opts.collectAllFails) return r;

          l = a.length;
          while(l--) {
            r = checkPropertyEquality(l);
            if(!r.result && !opts.collectAllFails) return r;
          }

          //we do not check for user properties because
          //node Buffer have some strange hidden properties
          return EQUALS;

        case 'error':
          //check defined properties
          p = ['name', 'message'];
          while(p.length) {
            r = checkPropertyEquality(p.shift());
            if(!r.result && !opts.collectAllFails) return r;
          }

          break;//check user properties

        case 'array':
        case 'arguments':
        case 'typed-array':
          r = checkPropertyEquality('length');
          if(!r.result && !opts.collectAllFails) return r;

          break;//check user properties

        case 'array-buffer':
          r = checkPropertyEquality('byteLength');
          if(!r.result && !opts.collectAllFails) return r;

          break;//check user properties

        case 'map':
        case 'set':
          r = checkPropertyEquality('size');
          if(!r.result && !opts.collectAllFails) return r;

          stackA.push(a);
          stackB.push(b);

          var itA = a.entries();
          var nextA = itA.next();

          while(!nextA.done) {
            key = nextA.value[0];
            //first check for primitive key if we can do light check
            //using .has and .get
            if(getType(key).type != 'object') {
              if(b.has(key)) {
                if(typeA.cls == 'map') {
                  //for map we also check its value to be equal
                  var value = b.get(key);
                  r = checkAlso(nextA.value[1], value);
                  if(!r.result) {
                    r.a = nextA.value;
                    r.b = value;
                    r.reason = REASON.MAP_VALUE_EQUALITY;

                    if(!opts.collectAllFails) break;
                  }
                }

              } else {
                r = result(false, REASON.SET_MAP_MISSING_KEY);
                r.a = key;
                r.b = key;

                if(!opts.collectAllFails) break;
              }
            } else {
              //heavy check
              //we search by iterator for key equality using equal
              var itB = b.entries();
              var nextB = itB.next();

              while(!nextB.done) {
                //first check for keys
                r = checkAlso(nextA.value[0], nextB.value[0]);

                if(!r.result) {
                  r.reason = REASON.SET_MAP_MISSING_KEY;
                  r.a = key;
                  r.b = key;
                } else {
                  if(typeA.cls == 'map') {
                    r = checkAlso(nextA.value[1], nextB.value[1]);

                    if(!r.result) {
                      r.a = nextA.value;
                      r.b = nextB.value;
                      r.reason = REASON.MAP_VALUE_EQUALITY;
                    }
                  }

                  if(!opts.collectAllFails) break;
                }

                nextB = itB.next();
              }
            }

            if(!r.result && !opts.collectAllFails) break;

            nextA = itA.next();
          }

          stackA.pop();
          stackB.pop();

          if(!r.result) {
            r.reason = REASON.SET_MAP_MISSING_ENTRY;
            if(!opts.collectAllFails) return r;
          }

          break; //check user properties
      }
  }

  // compare deep objects and arrays
  // stacks contain references only
  //

  l = stackA.length;
  while(l--) {
    if(stackA[l] == a) {
      return result(stackB[l] == b, REASON.CIRCULAR_VALUES);
    }
  }

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  for(key in b) {
    if(hasOwnProperty.call(b, key)) {
      r = result(hasOwnProperty.call(a, key), REASON.MISSING_KEY, 'A', key);
      if(!r.result && !opts.collectAllFails) break;

      if(r.result) {
        r = checkPropertyEquality(key);
        if(!r.result && !opts.collectAllFails) break;
      }
    }
  }

  if(r.result || opts.collectAllFails) {
    // ensure both objects have the same number of properties
    for(key in a) {
      if(hasOwnProperty.call(a, key)) {
        r = result(hasOwnProperty.call(b, key), REASON.MISSING_KEY, 'B', key);
        if(!r.result && !opts.collectAllFails) return r;
      }
    }
  }

  stackA.pop();
  stackB.pop();

  if(!r.result && !opts.collectAllFails) return r;

  var prototypesEquals = false, canComparePrototypes = false;

  if(opts.checkProtoEql) {
    if(Object.getPrototypeOf) {//TODO should i check prototypes for === or use eq?
      prototypesEquals = Object.getPrototypeOf(a) === Object.getPrototypeOf(b);
      canComparePrototypes = true;
    }

    if(canComparePrototypes && !prototypesEquals) {
      r = result(prototypesEquals, REASON.EQUALITY_PROTOTYPE);
      r.showReason = true;
      if(!r.result && !opts.collectAllFails) {
        return r;
      }
    }
  }

  return EQUALS;
}

var defaultOptions = {
  checkProtoEql: true,
  checkSubType: true,
  plusZeroAndMinusZeroEqual: false
};

function eq(a, b, opts) {
  opts = opts || {};
  if(typeof opts.checkProtoEql !== 'boolean') {
    opts.checkProtoEql = defaultOptions.checkProtoEql;
  }
  if(typeof opts.checkSubType !== 'boolean') {
    opts.checkSubType = defaultOptions.checkSubType;
  }
  if(typeof opts.plusZeroAndMinusZeroEqual !== 'boolean') {
    opts.plusZeroAndMinusZeroEqual = defaultOptions.plusZeroAndMinusZeroEqual;
  }

  var fails = [];
  var r = eqInternal(a, b, opts, [], [], [], fails);
  return opts.collectAllFails ? fails : r;
}

module.exports = eq;

eq.r = REASON;

},{"./format":153,"should-type":157}],155:[function(require,module,exports){
var getType = require('should-type');
var util = require('./util');

function genKeysFunc(f) {
  return function(value) {
    var k = f(value);
    k.sort();
    return k;
  };
}


function Formatter(opts) {
  opts = opts || {};

  this.seen = [];
  this.keys = genKeysFunc(opts.keys === false ? Object.getOwnPropertyNames : Object.keys);

  this.maxLineLength = typeof opts.maxLineLength === 'number' ? opts.maxLineLength : 60;
  this.propSep = opts.propSep || ',';

  this.isUTCdate = !!opts.isUTCdate;
}

Formatter.prototype = {
  constructor: Formatter,

  format: function(value) {
    var t = getType(value);
    var name1 = t.type, name2 = t.type;
    if(t.cls) {
      name1 += '_' + t.cls;
      name2 += '_' + t.cls;
    }
    if(t.sub) {
      name2 += '_' + t.sub;
    }
    var f = this['_format_' + name2] || this['_format_' + name1] || this['_format_' + t.type] || this.defaultFormat;
    return f.call(this, value).trim();
  },

  _formatObject: function(value, opts) {
    opts = opts || {};
    var mainKeys = opts.keys || this.keys(value);

    var len = 0;

    var formatPropertyValue = opts.formatPropertyValue || this.formatPropertyValue;
    var formatPropertyName = opts.formatPropertyName || this.formatPropertyName;
    var keyValueSep = opts.keyValueSep || ': ';
    var keyFilter = opts.keyFilter || function() { return true; };

    this.seen.push(value);
    var keys = [];

    mainKeys.forEach(function(key) {
      if(!keyFilter(key)) return;

      var fName = formatPropertyName.call(this, key);

      var f = (fName ? fName + keyValueSep : '') + formatPropertyValue.call(this, value, key);
      len += f.length;
      keys.push(f);
    }, this);
    this.seen.pop();

    (opts.additionalProperties || []).forEach(function(keyValue) {
      var f = keyValue[0] + keyValueSep + this.format(keyValue[1]);
      len += f.length;
      keys.push(f);
    }, this);

    var prefix = opts.prefix || Formatter.constructorName(value) || '';
    if(prefix.length > 0) prefix += ' ';

    var lbracket, rbracket;
    if(Array.isArray(opts.brackets)) {
      lbracket = opts.brackets && opts.brackets[0];
      rbracket = opts.brackets && opts.brackets[1];
    } else {
      lbracket = '{';
      rbracket = '}';
    }

    var rootValue = opts.value || '';

    if(keys.length === 0)
      return rootValue || (prefix + lbracket + rbracket);

    if(len <= this.maxLineLength) {
      return prefix + lbracket + ' ' + (rootValue ? rootValue + ' ' : '') + keys.join(this.propSep + ' ') + ' ' + rbracket;
    } else {
      return prefix + lbracket + '\n' + (rootValue ? '  ' + rootValue + '\n' : '') + keys.map(util.addSpaces).join(this.propSep + '\n') + '\n' + rbracket;
    }
  },

  formatObject: function(value, prefix, props) {
    props = props || this.keys(value);

    var len = 0;

    this.seen.push(value);
    props = props.map(function(prop) {
      var f = this.formatProperty(value, prop);
      len += f.length;
      return f;
    }, this);
    this.seen.pop();

    if(props.length === 0) return '{}';

    if(len <= this.maxLineLength) {
      return '{ ' + (prefix ? prefix + ' ' : '') + props.join(this.propSep + ' ') + ' }';
    } else {
      return '{' + '\n' + (prefix ? '  ' + prefix + '\n' : '') + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
    }
  },

  formatPropertyName: function(name) {
    return name.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/) ? name : this.format(name);
  },

  formatProperty: function(value, prop) {
    var desc = Formatter.getPropertyDescriptor(value, prop);

    var propName = this.formatPropertyName(prop);

    var propValue = desc.get && desc.set ?
      '[Getter/Setter]' : desc.get ?
      '[Getter]' : desc.set ?
      '[Setter]' : this.seen.indexOf(desc.value) >= 0 ?
      '[Circular]' :
      this.format(desc.value);

    return propName + ': ' + propValue;
  },

  formatPropertyValue: function(value, prop) {
    var desc = Formatter.getPropertyDescriptor(value, prop);

    var propValue = desc.get && desc.set ?
      '[Getter/Setter]' : desc.get ?
      '[Getter]' : desc.set ?
      '[Setter]' : this.seen.indexOf(desc.value) >= 0 ?
      '[Circular]' :
      this.format(desc.value);

    return propValue;
  }
};

Formatter.add = function add(type, cls, sub, f) {
  var args = Array.prototype.slice.call(arguments);
  f = args.pop();
  Formatter.prototype['_format_' + args.join('_')] = f;
};

Formatter.formatObjectWithPrefix = function formatObjectWithPrefix(f) {
  return function(value) {
    var prefix = f.call(this, value);
    var props = this.keys(value);
    if(props.length == 0) return prefix;
    else return this.formatObject(value, prefix, props);
  };
};

var functionNameRE = /^\s*function\s*(\S*)\s*\(/;

Formatter.functionName = function functionName(f) {
  if(f.name) {
    return f.name;
  }
  var matches = f.toString().match(functionNameRE);
  if (matches === null) {
    // `functionNameRE` doesn't match arrow functions.
    return '';
  }
  var name = matches[1];
  return name;
};

Formatter.constructorName = function(obj) {
  while (obj) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, 'constructor');
    if (descriptor !== undefined &&
        typeof descriptor.value === 'function') {

        var name = Formatter.functionName(descriptor.value);
        if(name !== '') {
          return name;
        }
    }

    obj = Object.getPrototypeOf(obj);
  }
};

Formatter.getPropertyDescriptor = function(obj, value) {
  var desc;
  try {
    desc = Object.getOwnPropertyDescriptor(obj, value) || {value: obj[value]};
  } catch(e) {
    desc = {value: e};
  }
  return desc;
};

Formatter.generateFunctionForIndexedArray = function generateFunctionForIndexedArray(lengthProp, name, padding) {
  return function(value) {
    var max = this.byteArrayMaxLength || 50;
    var length = value[lengthProp];
    var formattedValues = [];
    var len = 0;
    for(var i = 0; i < max && i < length; i++) {
      var b = value[i] || 0;
      var v = util.pad0(b.toString(16), padding);
      len += v.length;
      formattedValues.push(v);
    }
    var prefix = value.constructor.name || name || '';
    if(prefix) prefix += ' ';

    if(formattedValues.length === 0)
      return prefix + '[]';

    if(len <= this.maxLineLength) {
      return prefix + '[ ' + formattedValues.join(this.propSep + ' ') + ' ' + ']';
    } else {
      return prefix + '[\n' + formattedValues.map(util.addSpaces).join(this.propSep + '\n') + '\n' + ']';
    }
  };
};

Formatter.add('undefined', function() { return 'undefined' });
Formatter.add('null', function() { return 'null' });
Formatter.add('boolean', function(value) { return value ? 'true': 'false' });
Formatter.add('symbol', function(value) { return value.toString() });

['number', 'boolean'].forEach(function(name) {
  Formatter.add('object', name, function(value) {
    return this._formatObject(value, {
      additionalProperties: [['[[PrimitiveValue]]', value.valueOf()]]
    });
  });
});

Formatter.add('object', 'string', function(value) {
  var realValue = value.valueOf();

  return this._formatObject(value, {
    keyFilter: function(key) {
      //skip useless indexed properties
      return !(key.match(/\d+/) && parseInt(key, 10) < realValue.length);
    },
    additionalProperties: [['[[PrimitiveValue]]', realValue]]
  });
});

Formatter.add('object', 'regexp', function(value) {
  return this._formatObject(value, {
    value: String(value)
  });
});

Formatter.add('number', function(value) {
  if(value === 0 && 1 / value < 0) return '-0';
  return String(value);
});

Formatter.add('string', function(value) {
  return '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
      .replace(/'/g, "\\'")
      .replace(/\\"/g, '"') + '\'';
});

Formatter.add('object', function(value) {
  return this._formatObject(value);
});

Formatter.add('object', 'arguments', function(value) {
  return this._formatObject(value, {
    prefix: 'Arguments',
    formatPropertyName: function(key) {
      if(!key.match(/\d+/)) {
        return this.formatPropertyName(key);
      }
    },
    brackets: ['[', ']']
  });
});

Formatter.add('object', 'array', function(value) {
  return this._formatObject(value, {
    formatPropertyName: function(key) {
      if(!key.match(/\d+/)) {
        return this.formatPropertyName(key);
      }
    },
    brackets: ['[', ']']
  });
});


function formatDate(value, isUTC) {
  var prefix = isUTC ? 'UTC' : '';

  var date = value['get' + prefix + 'FullYear']() +
    '-' +
    util.pad0(value['get' + prefix + 'Month']() + 1, 2) +
    '-' +
    util.pad0(value['get' + prefix + 'Date'](), 2);

  var time = util.pad0(value['get' + prefix + 'Hours'](), 2) +
    ':' +
    util.pad0(value['get' + prefix + 'Minutes'](), 2) +
    ':' +
    util.pad0(value['get' + prefix + 'Seconds'](), 2) +
    '.' +
    util.pad0(value['get' + prefix + 'Milliseconds'](), 3);

  var to = value.getTimezoneOffset();
  var absTo = Math.abs(to);
  var hours = Math.floor(absTo / 60);
  var minutes = absTo - hours * 60;
  var tzFormat = (to < 0 ? '+' : '-') + util.pad0(hours, 2) + util.pad0(minutes, 2);

  return date + ' ' + time + (isUTC ? '' : ' ' + tzFormat);
}

Formatter.add('object', 'date', function(value) {
  return this._formatObject(value, { value: formatDate(value, this.isUTCdate) });
});

Formatter.add('function', function(value) {
  return this._formatObject(value, {
    additionalProperties: [['name', Formatter.functionName(value)]]
  });
});

Formatter.add('object', 'error', function(value) {
  return this._formatObject(value, {
    prefix: value.name,
    additionalProperties: [['message', value.message]]
  });
});

Formatter.add('object', 'buffer', Formatter.generateFunctionForIndexedArray('length', 'Buffer', 2));

Formatter.add('object', 'array-buffer', Formatter.generateFunctionForIndexedArray('byteLength', 'ArrayBuffer', 2));

Formatter.add('object', 'typed-array', 'int8', Formatter.generateFunctionForIndexedArray('length', 'Int8Array', 2));
Formatter.add('object', 'typed-array', 'uint8', Formatter.generateFunctionForIndexedArray('length', 'Uint8Array', 2));
Formatter.add('object', 'typed-array', 'uint8clamped', Formatter.generateFunctionForIndexedArray('length', 'Uint8ClampedArray', 2));

Formatter.add('object', 'typed-array', 'int16', Formatter.generateFunctionForIndexedArray('length', 'Int16Array', 4));
Formatter.add('object', 'typed-array', 'uint16', Formatter.generateFunctionForIndexedArray('length', 'Uint16Array', 4));

Formatter.add('object', 'typed-array', 'int32', Formatter.generateFunctionForIndexedArray('length', 'Int32Array', 8));
Formatter.add('object', 'typed-array', 'uint32', Formatter.generateFunctionForIndexedArray('length', 'Uint32Array', 8));

//TODO add float32 and float64

Formatter.add('object', 'promise', function() {
  return '[Promise]';//TODO it could be nice to inspect its state and value
});

Formatter.add('object', 'xhr', function() {
  return '[XMLHttpRequest]';//TODO it could be nice to inspect its state
});

Formatter.add('object', 'html-element', function(value) {
  return value.outerHTML;
});

Formatter.add('object', 'html-element', '#text', function(value) {
  return value.nodeValue;
});

Formatter.add('object', 'html-element', '#document', function(value) {
  return value.documentElement.outerHTML;
});

Formatter.add('object', 'host', function() {
  return '[Host]';
});

Formatter.add('object', 'set', function(value) {
  var iter = value.values();
  var len = 0;

  this.seen.push(value);

  var props = [];

  var next = iter.next();
  while(!next.done) {
    var val = next.value;
    var f = this.format(val);
    len += f.length;
    props.push(f);

    next = iter.next();
  }

  this.seen.pop();

  if(props.length === 0) return 'Set {}';

  if(len <= this.maxLineLength) {
    return 'Set { ' + props.join(this.propSep + ' ') + ' }';
  } else {
    return 'Set {\n' + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
  }
});

Formatter.add('object', 'map', function(value) {
  var iter = value.entries();
  var len = 0;

  this.seen.push(value);

  var props = [];

  var next = iter.next();
  while(!next.done) {
    var val = next.value;
    var fK = this.format(val[0]);
    var fV = this.format(val[1]);

    var f;
    if((fK.length + fV.length + 4) <= this.maxLineLength) {
      f = fK + ' => ' + fV;
    } else {
      f = fK + ' =>\n' + fV;
    }

    len += fK.length + fV.length + 4;
    props.push(f);

    next = iter.next();
  }

  this.seen.pop();

  if(props.length === 0) return 'Map {}';

  if(len <= this.maxLineLength) {
    return 'Map { ' + props.join(this.propSep + ' ') + ' }';
  } else {
    return 'Map {\n' + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
  }
});

Formatter.prototype.defaultFormat = Formatter.prototype._format_object;

function defaultFormat(value, opts) {
  return new Formatter(opts).format(value);
}

defaultFormat.Formatter = Formatter;
module.exports = defaultFormat;

},{"./util":156,"should-type":157}],156:[function(require,module,exports){
function addSpaces(v) {
  return v.split('\n').map(function(vv) { return '  ' + vv; }).join('\n');
}

function pad(str, value, filler) {
  str = String(str)
  var isRight = false;

  if(value < 0) {
    isRight = true;
    value = -value;
  }

  if(str.length < value) {
    var padding = new Array(value - str.length + 1).join(filler);
    return isRight ? str + padding : padding + str;
  } else{
    return str;
  }
}

module.exports = {
  addSpaces: addSpaces,
  pad: pad,
  pad0: function(str, value) {
    return pad(str, value, '0');
  }
};

},{}],157:[function(require,module,exports){
(function (Buffer){
var toString = Object.prototype.toString;

var types = require('./types');

/**
 * Simple data function to store type information
 * @param {string} type Usually what is returned from typeof
 * @param {string} cls  Sanitized @Class via Object.prototype.toString
 * @param {string} sub  If type and cls the same, and need to specify somehow
 * @private
 * @example
 *
 * //for null
 * new Type('null');
 *
 * //for Date
 * new Type('object', 'date');
 *
 * //for Uint8Array
 *
 * new Type('object', 'typed-array', 'uint8');
 */
function Type(type, cls, sub) {
  this.type = type;
  this.cls = cls;
  this.sub = sub;
}

/**
 * Function to store type checks
 * @private
 */
function TypeChecker() {
  this.checks = [];
}

TypeChecker.prototype = {
  add: function(func) {
    this.checks.push(func);
    return this;
  },

  addTypeOf: function(type, res) {
    return this.add(function(obj, tpeOf) {
      if(tpeOf === type) {
        return new Type(res);
      }
    });
  },

  addClass: function(cls, res, sub) {
    return this.add(function(obj, tpeOf, objCls) {
      if(objCls === cls) {
        return new Type(types.OBJECT, res, sub);
      }
    });
  },

  getType: function(obj) {
    var typeOf = typeof obj;
    var cls = toString.call(obj);

    for(var i = 0, l = this.checks.length; i < l; i++) {
      var res = this.checks[i].call(this, obj, typeOf, cls);
      if(typeof res !== 'undefined') return res;
    }

  }
};

var main = new TypeChecker();

//TODO add iterators

main
  .addTypeOf(types.NUMBER, types.NUMBER)
  .addTypeOf(types.UNDEFINED, types.UNDEFINED)
  .addTypeOf(types.STRING, types.STRING)
  .addTypeOf(types.BOOLEAN, types.BOOLEAN)
  .addTypeOf(types.FUNCTION, types.FUNCTION)
  .addTypeOf(types.SYMBOL, types.SYMBOL)
  .add(function(obj, tpeOf) {
    if(obj === null) return new Type(types.NULL);
  })
  .addClass('[object String]', types.STRING)
  .addClass('[object Boolean]', types.BOOLEAN)
  .addClass('[object Number]', types.NUMBER)
  .addClass('[object Array]', types.ARRAY)
  .addClass('[object RegExp]', types.REGEXP)
  .addClass('[object Error]', types.ERROR)
  .addClass('[object Date]', types.DATE)
  .addClass('[object Arguments]', types.ARGUMENTS)
  .addClass('[object Math]')
  .addClass('[object JSON]')
  .addClass('[object ArrayBuffer]', types.ARRAY_BUFFER)
  .addClass('[object Int8Array]', types.TYPED_ARRAY, 'int8')
  .addClass('[object Uint8Array]', types.TYPED_ARRAY, 'uint8')
  .addClass('[object Uint8ClampedArray]', types.TYPED_ARRAY, 'uint8clamped')
  .addClass('[object Int16Array]', types.TYPED_ARRAY, 'int16')
  .addClass('[object Uint16Array]', types.TYPED_ARRAY, 'uint16')
  .addClass('[object Int32Array]', types.TYPED_ARRAY, 'int32')
  .addClass('[object Uint32Array]', types.TYPED_ARRAY, 'uint32')
  .addClass('[object Float32Array]', types.TYPED_ARRAY, 'float32')
  .addClass('[object Float64Array]', types.TYPED_ARRAY, 'float64')
  .addClass('[object DataView]', types.DATA_VIEW)
  .addClass('[object Map]', types.MAP)
  .addClass('[object WeakMap]', types.WEAK_MAP)
  .addClass('[object Set]', types.SET)
  .addClass('[object WeakSet]', types.WEAK_SET)
  .addClass('[object Promise]', types.PROMISE)
  .addClass('[object Blob]', types.BLOB)
  .addClass('[object File]', types.FILE)
  .addClass('[object FileList]', types.FILE_LIST)
  .addClass('[object XMLHttpRequest]', types.XHR)
  .add(function(obj) {
    if((typeof Promise === types.FUNCTION && obj instanceof Promise) ||
        (typeof obj.then === types.FUNCTION)) {
          return new Type(types.OBJECT, types.PROMISE);
        }
  })
  .add(function(obj) {
    if(typeof Buffer !== 'undefined' && obj instanceof Buffer) {
      return new Type(types.OBJECT, types.BUFFER);
    }
  })
  .add(function(obj) {
    if(typeof Node !== 'undefined' && obj instanceof Node) {
      return new Type(types.OBJECT, types.HTML_ELEMENT, obj.nodeName);
    }
  })
  .add(function(obj) {
    // probably at the begginging should be enough these checks
    if(obj.Boolean === Boolean && obj.Number === Number && obj.String === String && obj.Date === Date) {
      return new Type(types.OBJECT, types.HOST);
    }
  })
  .add(function() {
    return new Type(types.OBJECT);
  });

/**
 * Get type information of anything
 *
 * @param  {any} obj Anything that could require type information
 * @return {Type}    type info
 */
function getGlobalType(obj) {
  return main.getType(obj);
}

getGlobalType.checker = main;
getGlobalType.TypeChecker = TypeChecker;
getGlobalType.Type = Type;

Object.keys(types).forEach(function(typeName) {
  getGlobalType[typeName] = types[typeName];
});

module.exports = getGlobalType;

}).call(this,require("buffer").Buffer)

},{"./types":158,"buffer":2}],158:[function(require,module,exports){
var types = {
  NUMBER: 'number',
  UNDEFINED: 'undefined',
  STRING: 'string',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  FUNCTION: 'function',
  NULL: 'null',
  ARRAY: 'array',
  REGEXP: 'regexp',
  DATE: 'date',
  ERROR: 'error',
  ARGUMENTS: 'arguments',
  SYMBOL: 'symbol',
  ARRAY_BUFFER: 'array-buffer',
  TYPED_ARRAY: 'typed-array',
  DATA_VIEW: 'data-view',
  MAP: 'map',
  SET: 'set',
  WEAK_SET: 'weak-set',
  WEAK_MAP: 'weak-map',
  PROMISE: 'promise',

// node buffer
  BUFFER: 'buffer',

// dom html element
  HTML_ELEMENT: 'html-element',
  HTML_ELEMENT_TEXT: 'html-element-text',
  DOCUMENT: 'document',
  WINDOW: 'window',
  FILE: 'file',
  FILE_LIST: 'file-list',
  BLOB: 'blob',

  HOST: 'host',

  XHR: 'xhr'
};

module.exports = types;

},{}],159:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _isString = require('lodash/isString');
var _isPlainObject = require('lodash/isPlainObject');
var _isFunction = require('lodash/isFunction');
var _get = require('lodash/get');
var _set = require('lodash/set');
var _defaultsDeep = require('lodash/defaultsDeep');
var _trimRight = require('lodash/trimEnd');

module.exports = function inspirationArchitectFactory(factory_config) {

    var default_factory_config = {
        config_files: {},
        config_files_use_ext: '.js',
        app_config_path: 'config',
        config_env_filename: '.env',
        config_app_filename: 'app',
        config_providers_path: 'providers',
        provider_files: {}
    };

    factory_config = _defaultsDeep(factory_config || {}, default_factory_config);

    return function () {
        function InspirationArchitect(initial) {
            _classCallCheck(this, InspirationArchitect);

            initial = _defaultsDeep(initial, {
                app: {},
                config: {},
                providers: []
            });

            this.app = initial.app;
            this.config = initial.config;
            this.providers = initial.providers;
        }

        _createClass(InspirationArchitect, [{
            key: 'loadConfig',
            value: function loadConfig(callback) {
                var _this = this;

                if (_isString(factory_config.config_files)) {

                    var fs = require('fs');
                    var path = require('path');

                    fs.readdir(factory_config.config_files, function (err, files) {

                        if (err) {
                            return callback(err);
                        }
                        var config_files = {};

                        for (var x = 0; x < files.length; x++) {

                            var file = files[x];
                            config_files[file] = require(path.join(factory_config.config_files, file));
                        }

                        _this.useConfigFiles(config_files);
                        callback();
                    });
                } else if (_isPlainObject(factory_config.config_files)) {

                    this.useConfigFiles(factory_config.config_files);
                    callback();
                } else {
                    this.useConfigFiles();
                    callback();
                }
            }
        }, {
            key: 'useConfigFiles',
            value: function useConfigFiles(config_files) {

                if (!config_files) {
                    config_files = {};
                }

                var addtl_config = {};
                var env_config = {};
                var app_config = {};

                for (var file in config_files) {

                    if (factory_config.config_files_use_ext) {
                        var key = _trimRight(file, factory_config.config_files_use_ext);
                    }

                    var value = config_files[file];

                    if (key === factory_config.config_env_filename) {
                        env_config = value;
                    } else if (key === factory_config.config_app_filename) {
                        app_config = value;
                    } else {
                        addtl_config[key] = value;
                    }
                }

                var _config = _defaultsDeep({}, this.config, env_config, app_config, addtl_config);

                _set(this.app, factory_config.app_config_path, function (path, default_value) {
                    return _get(_config, path, default_value);
                });
            }
        }, {
            key: 'loadProviders',
            value: function loadProviders(callback) {
                var _this2 = this;

                var loadProvider = function loadProvider(provider) {
                    return provider;
                };

                if (_isString(factory_config.provider_files)) {

                    var path = require('path');

                    loadProvider = function loadProvider(provider) {
                        return require(path.join(factory_config.provider_files, provider));
                    };
                } else if (_isPlainObject(factory_config.provider_files)) {

                    loadProvider = function loadProvider(provider) {
                        return factory_config.provider_files[provider];
                    };
                }

                var addtl_providers = _get(this.app, factory_config.app_config_path)(factory_config.config_providers_path, []);

                var providers = this.providers.concat(addtl_providers);
                var index = 0;

                var next = function next(err) {

                    if (err || index === providers.length) {
                        return callback(err);
                    }

                    var provider = providers[index++];

                    if (_isString(provider)) {

                        provider = loadProvider(provider);
                    }

                    if (!_isFunction(provider)) {
                        return next(new Error('Provider ' + index + ' is not a function.'));
                    }

                    try {

                        provider(_this2.app, next);
                    } catch (err) {

                        next(err);
                    }
                };

                next();
            }
        }, {
            key: 'init',
            value: function init(callback) {
                var _this3 = this;

                var fns = [function (next) {
                    _this3.loadConfig(next);
                }, function (next) {
                    _this3.loadProviders(next);
                }];

                var index = 0;

                var next = function next(err) {

                    if (err || index === fns.length) {
                        return callback(err, _this3.app);
                    }

                    var fn = fns[index++];

                    try {

                        fn(next);
                    } catch (err) {

                        next(err);
                    }
                };

                next();
            }
        }], [{
            key: 'factory_config',
            get: function get() {
                return factory_config;
            }
        }, {
            key: 'default_factory_config',
            get: function get() {
                return default_factory_config;
            }
        }]);

        return InspirationArchitect;
    }();
};

},{"fs":1,"lodash/defaultsDeep":106,"lodash/get":108,"lodash/isFunction":114,"lodash/isPlainObject":119,"lodash/isString":120,"lodash/set":128,"lodash/trimEnd":133,"path":6}],160:[function(require,module,exports){
"use strict";

var inspirationArchitectFactory = require('../src/factory');

var should = require('should');

var _get = require('lodash/get');
var _set = require('lodash/set');

var globalTests = require('./global-tests');
var factoryTests = require('./factory-tests');

var config_files = {'.env': require('../test/fixtures/sample-app/config/.env.js'),'app': require('../test/fixtures/sample-app/config/app.js'),'external': require('../test/fixtures/sample-app/config/external.js')};
var empty_config_files = {};
var provider_files = {'addSomething': require('../test/fixtures/sample-app/providers/addSomething.js'),'addSomethingAsync': require('../test/fixtures/sample-app/providers/addSomethingAsync.js')};
var empty_provider_files = {};

factoryTests();

describe('browserify tests', function () {

    describe('different config files', function () {

        var factory_config = {
            config_files: config_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function () {

            globalTests(Inspiration);
        });

        it('should honor the server config files', function (done) {

            var inspiration = new Inspiration();

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                should(inspiration.app.config('a_sample')).equal('one');
                should(inspiration.app.config('b_sample')).equal('two');
                should(inspiration.app.config('e_sample.f_sample.g_sample')).equal(5);
                should(inspiration.app.config('external.h_sample')).equal('hello');
                done();
            });
        });

        it('should be able to overwrite server config files', function (done) {

            var config = {
                a_sample: 'overwritten',
                b_sample: 'also overwritten',
                external: {
                    h_sample: 'this is also overwritten'
                }
            };
            var inspiration = new Inspiration({
                config: config
            });

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                should(inspiration.app.config('a_sample')).equal(config.a_sample);
                should(inspiration.app.config('b_sample')).equal(config.b_sample);
                should(inspiration.app.config('external.h_sample')).equal(config.external.h_sample);
                should(inspiration.app.config('external.i_sample')).not.equal(undefined);
                done();
            });
        });
    });

    describe('no config files', function () {

        var factory_config = {
            config_files: empty_config_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function () {

            globalTests(Inspiration);
        });

        it('should be able to overwrite empty server config files', function (done) {

            var config = {
                a_sample: 'overwritten',
                b_sample: 'also overwritten',
                external: {
                    h_sample: 'this is also overwritten'
                }
            };
            var inspiration = new Inspiration({
                config: config
            });

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                should(inspiration.app.config('a_sample')).equal(config.a_sample);
                should(inspiration.app.config('b_sample')).equal(config.b_sample);
                should(inspiration.app.config('external.h_sample')).equal(config.external.h_sample);
                done();
            });
        });
    });

    describe('reference server providers', function () {

        var factory_config = {
            provider_files: provider_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the server providers based on the config', function (done) {

            var inspiration = new Inspiration({
                config: {
                    providers: ['addSomethingAsync', 'addSomething', function (app, done) {
                        app.doSomethingElse = function () {

                            return 3;
                        };
                        done();
                    }]
                }
            });

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }

                inspiration.app.doSomethingAsync().should.equal(1);
                inspiration.app.doSomething().should.equal(2);
                inspiration.app.doSomethingElse().should.equal(3);

                done();
            });
        });
    });

    describe('no provider files', function () {

        var factory_config = {
            provider_files: empty_provider_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function () {

            globalTests(Inspiration);
        });

        it('should still run initial providers', function (done) {

            var inspiration = new Inspiration({
                providers: [function (app, done) {

                    app.something_property = 1;
                    done();
                }, function (app, done) {

                    app.something_other_property = 2;
                    done();
                }],
                config: {
                    providers: [function (app, done) {
                        app.something_third_property = 3;
                        done();
                    }]
                }
            });

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                inspiration.app.something_property.should.equal(1);
                inspiration.app.something_other_property.should.equal(2);
                inspiration.app.something_third_property.should.equal(3);
                done();
            });
        });
    });

    describe('different factory config values combined', function () {

        var config_env_filename = 'local';
        var config_app_filename = 'application';
        var config_providers_path = 'these.are.my.providers';
        var app_config_path = 'locals.config';

        var factory_config = {
            config_files: {},
            config_env_filename: config_env_filename,
            config_app_filename: config_app_filename,
            config_providers_path: config_providers_path,
            app_config_path: app_config_path,
            provider_files: provider_files
        };
        factory_config.config_files[config_env_filename] = {
            greeting: 'aloha'
        };
        factory_config.config_files[config_app_filename] = {
            greeting: 'hello',
            parting: 'goodbye'
        };
        _set(factory_config.config_files[config_app_filename], config_providers_path, ['addSomething']);

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should honor the factory config', function (done) {

            var inspiration = new Inspiration();
            inspiration.test = true;
            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }

                var config = _get(inspiration.app, app_config_path);
                should(config('greeting')).equal('aloha');
                should(config('parting')).equal('goodbye');
                inspiration.app.doSomething().should.equal(2);
                done();
            });
        });
    });
});

},{"../src/factory":159,"../test/fixtures/sample-app/config/.env.js":163,"../test/fixtures/sample-app/config/app.js":164,"../test/fixtures/sample-app/config/external.js":165,"../test/fixtures/sample-app/providers/addSomething.js":166,"../test/fixtures/sample-app/providers/addSomethingAsync.js":167,"./factory-tests":161,"./global-tests":162,"lodash/get":108,"lodash/set":128,"should":134}],161:[function(require,module,exports){
"use strict";

var should = require('should');
var _get = require('lodash/get');
var _set = require('lodash/set');
var globalTests = require('./global-tests');
var inspirationArchitectFactory = require('../src/factory');

module.exports = function factoryTests() {
    describe('factory', function () {

        describe('empty factory config', function () {

            var Inspiration = inspirationArchitectFactory();

            globalTests(Inspiration);
        });

        describe('different app config path', function () {

            var factory_config = {
                app_config_path: 'locals.config'
            };

            var Inspiration = inspirationArchitectFactory(factory_config);

            globalTests(Inspiration);

            describe('locals.config', function () {

                it('should be able to access the config at locals.config', function (done) {

                    var inspiration = new Inspiration({
                        config: {
                            greeting: 'hello'
                        }
                    });

                    inspiration.init(function (err) {

                        if (err) {
                            throw err;
                        }

                        should(_get(inspiration.app, factory_config.app_config_path)).not.equal(undefined);
                        inspiration.app.locals.config('greeting').should.equal('hello');
                        done();
                    });
                });
            });
        });

        describe('different config providers path', function () {

            var factory_config = {
                config_providers_path: 'custom.providers'
            };

            var Inspiration = inspirationArchitectFactory(factory_config);

            globalTests(Inspiration);

            describe('custom.providers', function () {

                it('should be able to use custom.providers as the config path to get providers', function (done) {

                    var config = {};
                    _set(config, 'custom.providers', [function (app, done) {
                        app.something = function () {
                            return 'hello';
                        };
                        done();
                    }]);
                    var inspiration = new Inspiration({
                        config: config
                    });

                    inspiration.init(function (err) {

                        if (err) {
                            throw err;
                        }

                        should(inspiration.app.config('custom.providers')).not.equal(undefined);
                        inspiration.app.something().should.equal('hello');
                        done();
                    });
                });
            });
        });
    });
};

},{"../src/factory":159,"./global-tests":162,"lodash/get":108,"lodash/set":128,"should":134}],162:[function(require,module,exports){
'use strict';

var should = require('should');
var _get = require('lodash/get');
var _set = require('lodash/set');

module.exports = function globalTests(Inspiration) {

    var app_config_path = Inspiration.factory_config.app_config_path;

    describe('with no initials', function () {

        it('should create a new inspiration class, then a new instance, with a config function.', function (done) {

            var inspiration = new Inspiration();

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                done();
            });
        });
    });

    describe('with an initial app', function () {

        var app = {
            name: 'My Cool App'
        };

        it('should create a new inspiration class, then a new instance with the initial app.', function (done) {

            var inspiration = new Inspiration({ app: app });
            inspiration.app.should.equal(app);
            inspiration.app.should.have.property('name', app.name);

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                done();
            });
        });
    });

    describe('with an initial config', function () {

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ config: config });
            inspiration.config.should.equal(config);
            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }

                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);
                done();
            });
        });
    });

    describe('with an initial app and an initial config', function () {

        var app = {
            name: 'My Cool App'
        };

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ app: app, config: config });
            inspiration.config.should.equal(config);
            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                inspiration.app.should.equal(app);
                inspiration.app.should.have.property('name', app.name);
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);

                done();
            });
        });
    });

    describe('with an initial set of providers', function () {

        var providers = [function (app, done) {
            app.something = function () {
                return 1;
            };
            done();
        }, function (app, done) {

            setTimeout(function () {

                app.somethingAsync = function () {
                    return 2;
                };
                done();
            }, 100);
        }];

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ providers: providers });
            inspiration.providers.should.equal(providers);
            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                inspiration.app.should.have.property('something');
                inspiration.app.something().should.equal(1);
                inspiration.app.should.have.property('somethingAsync');
                inspiration.app.somethingAsync().should.equal(2);
                done();
            });
        });
    });

    describe('with an initial app, an initial config, and an initial set of providers', function () {

        var app = {
            name: 'My Cool App'
        };

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };
        _set(config, Inspiration.factory_config.config_providers_path, [function (app, done) {
            app.somethingElse = function () {

                return 3;
            };
            done();
        }]);

        var providers = [function (app, done) {
            app.something = function () {
                return 1;
            };
            done();
        }, function (app, done) {

            setTimeout(function () {

                app.somethingAsync = function () {
                    return 2;
                };
                done();
            }, 100);
        }];

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ app: app, config: config, providers: providers });
            inspiration.config.should.equal(config);
            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                inspiration.app.should.equal(app);
                inspiration.app.should.have.property('name', app.name);
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);
                inspiration.app.should.have.property('something');
                inspiration.app.something().should.equal(1);
                inspiration.app.should.have.property('somethingAsync');
                inspiration.app.somethingAsync().should.equal(2);
                inspiration.app.should.have.property('somethingElse');
                inspiration.app.somethingElse().should.equal(3);
                done();
            });
        });
    });
};

},{"lodash/get":108,"lodash/set":128,"should":134}],163:[function(require,module,exports){
'use strict';

module.exports = {
    a_sample: 'one'
};

},{}],164:[function(require,module,exports){
'use strict';

module.exports = {
    a_sample: 1,
    b_sample: 'two',
    c_sample: [true, {
        d_sample: 4
    }],
    e_sample: {
        f_sample: {
            g_sample: 5
        }
    }
};

},{}],165:[function(require,module,exports){
'use strict';

module.exports = {
    h_sample: 'hello',
    i_sample: 'goodbye'
};

},{}],166:[function(require,module,exports){
"use strict";

module.exports = function addSomething(app, done) {

    app.doSomething = function () {

        return 2;
    };
    done();
};

},{}],167:[function(require,module,exports){
"use strict";

module.exports = function addSomethingAsync(app, done) {

    setTimeout(function () {

        app.doSomethingAsync = function () {
            return 1;
        };
        done();
    }, 100);
};

},{}]},{},[160])(160)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fSGFzaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fUHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1JlZmxlY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1VpbnQ4QXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYWRkTWFwRW50cnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hZGRTZXRFbnRyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FwcGx5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlFYWNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlQdXNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlSZWR1Y2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NpZ25NZXJnZVZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0RlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc29jR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ2xvbmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQ3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRBbGxLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5c0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1lcmdlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1lcmdlRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2xpY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0UGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RTbGljZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NoYXJzRW5kSW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jaGVja0dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQXJyYXlCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZUJ1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lRGF0YVZpZXcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lUmVnRXhwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3B5U3ltYm9scy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUFzc2lnbmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0QWxsS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldExlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE5hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFByb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFN5bWJvbHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5kZXhLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5kZXhPZk5hTi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0hvc3RPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJdGVyYXRlZUNhbGwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXRlcmF0b3JUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVyZ2VEZWZhdWx0cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmluZ1RvUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvS2V5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2NvbnN0YW50LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9kZWZhdWx0c0RlZXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9nZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2VPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNOYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzUGxhaW5PYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL21lbW9pemUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL21lcmdlV2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvcmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b0ludGVnZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b1BsYWluT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdHJpbUVuZC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9hc3NlcnRpb24tZXJyb3IuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9hc3NlcnRpb24uanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9jb25maWcuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvX2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9hc3NlcnQuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvYm9vbC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9jaGFpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9jb250YWluLmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9saWIvZXh0L2VxbC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9tYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9udW1iZXIuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL3Nob3VsZC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL25vZGVfbW9kdWxlcy9zaG91bGQtZXF1YWwvZm9ybWF0LmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9ub2RlX21vZHVsZXMvc2hvdWxkLWVxdWFsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9ub2RlX21vZHVsZXMvc2hvdWxkLWZvcm1hdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbm9kZV9tb2R1bGVzL3Nob3VsZC1mb3JtYXQvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbm9kZV9tb2R1bGVzL3Nob3VsZC10eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9ub2RlX21vZHVsZXMvc2hvdWxkLXR5cGUvdHlwZXMuanMiLCJzcmMvZmFjdG9yeS5qcyIsInRlc3Qtc3JjL2Jyb3dzZXJpZnkuanMiLCJ0ZXN0LXNyYy9mYWN0b3J5LXRlc3RzLmpzIiwidGVzdC1zcmMvZ2xvYmFsLXRlc3RzLmpzIiwidGVzdC9maXh0dXJlcy9zYW1wbGUtYXBwL2NvbmZpZy8uZW52LmpzIiwidGVzdC9maXh0dXJlcy9zYW1wbGUtYXBwL2NvbmZpZy9hcHAuanMiLCJ0ZXN0L2ZpeHR1cmVzL3NhbXBsZS1hcHAvY29uZmlnL2V4dGVybmFsLmpzIiwidGVzdC9maXh0dXJlcy9zYW1wbGUtYXBwL3Byb3ZpZGVycy9hZGRTb21ldGhpbmcuanMiLCJ0ZXN0L2ZpeHR1cmVzL3NhbXBsZS1hcHAvcHJvdmlkZXJzL2FkZFNvbWV0aGluZ0FzeW5jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvcURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBOzs7Ozs7QUFFQSxJQUFJLFlBQVksUUFBUSxpQkFBUixDQUFoQjtBQUNBLElBQUksaUJBQWlCLFFBQVEsc0JBQVIsQ0FBckI7QUFDQSxJQUFJLGNBQWMsUUFBUSxtQkFBUixDQUFsQjtBQUNBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDtBQUNBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDtBQUNBLElBQUksZ0JBQWdCLFFBQVEscUJBQVIsQ0FBcEI7QUFDQSxJQUFJLGFBQWEsUUFBUSxnQkFBUixDQUFqQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUywyQkFBVCxDQUFxQyxjQUFyQyxFQUFxRDs7QUFFbEUsUUFBSSx5QkFBeUI7QUFDekIsc0JBQWMsRUFEVztBQUV6Qiw4QkFBc0IsS0FGRztBQUd6Qix5QkFBaUIsUUFIUTtBQUl6Qiw2QkFBcUIsTUFKSTtBQUt6Qiw2QkFBcUIsS0FMSTtBQU16QiwrQkFBdUIsV0FORTtBQU96Qix3QkFBZ0I7QUFQUyxLQUE3Qjs7QUFVQSxxQkFBaUIsY0FBYyxrQkFBa0IsRUFBaEMsRUFBb0Msc0JBQXBDLENBQWpCOztBQUVBO0FBRUksc0NBQVksT0FBWixFQUFxQjtBQUFBOztBQUVqQixzQkFBVSxjQUFjLE9BQWQsRUFBdUI7QUFDN0IscUJBQUssRUFEd0I7QUFFN0Isd0JBQVEsRUFGcUI7QUFHN0IsMkJBQVc7QUFIa0IsYUFBdkIsQ0FBVjs7QUFNQSxpQkFBSyxHQUFMLEdBQVcsUUFBUSxHQUFuQjtBQUNBLGlCQUFLLE1BQUwsR0FBYyxRQUFRLE1BQXRCO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixRQUFRLFNBQXpCO0FBQ0g7O0FBYkw7QUFBQTtBQUFBLHVDQWVlLFFBZmYsRUFleUI7QUFBQTs7QUFFakIsb0JBQUksVUFBVSxlQUFlLFlBQXpCLENBQUosRUFBNEM7O0FBRXhDLHdCQUFJLEtBQUssUUFBUSxJQUFSLENBQVQ7QUFDQSx3QkFBSSxPQUFPLFFBQVEsTUFBUixDQUFYOztBQUVBLHVCQUFHLE9BQUgsQ0FBVyxlQUFlLFlBQTFCLEVBQXdDLFVBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7O0FBRXBELDRCQUFJLEdBQUosRUFBUztBQUNMLG1DQUFPLFNBQVMsR0FBVCxDQUFQO0FBQ0g7QUFDRCw0QkFBSSxlQUFlLEVBQW5COztBQUVBLDZCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1Qzs7QUFFbkMsZ0NBQUksT0FBTyxNQUFNLENBQU4sQ0FBWDtBQUNBLHlDQUFhLElBQWIsSUFBcUIsUUFBUSxLQUFLLElBQUwsQ0FBVSxlQUFlLFlBQXpCLEVBQXVDLElBQXZDLENBQVIsQ0FBckI7QUFDSDs7QUFFRCw4QkFBSyxjQUFMLENBQW9CLFlBQXBCO0FBQ0E7QUFDSCxxQkFmRDtBQWdCSCxpQkFyQkQsTUFxQk8sSUFBSSxlQUFlLGVBQWUsWUFBOUIsQ0FBSixFQUFpRDs7QUFFcEQseUJBQUssY0FBTCxDQUFvQixlQUFlLFlBQW5DO0FBQ0E7QUFDSCxpQkFKTSxNQUtGO0FBQ0QseUJBQUssY0FBTDtBQUNBO0FBQ0g7QUFDSjtBQS9DTDtBQUFBO0FBQUEsMkNBaURtQixZQWpEbkIsRUFpRGlDOztBQUV6QixvQkFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDZixtQ0FBZSxFQUFmO0FBQ0g7O0FBRUQsb0JBQUksZUFBZSxFQUFuQjtBQUNBLG9CQUFJLGFBQWEsRUFBakI7QUFDQSxvQkFBSSxhQUFhLEVBQWpCOztBQUVBLHFCQUFLLElBQUksSUFBVCxJQUFpQixZQUFqQixFQUErQjs7QUFFM0Isd0JBQUksZUFBZSxvQkFBbkIsRUFBeUM7QUFDckMsNEJBQUksTUFBTSxXQUFXLElBQVgsRUFBaUIsZUFBZSxvQkFBaEMsQ0FBVjtBQUNIOztBQUVELHdCQUFJLFFBQVEsYUFBYSxJQUFiLENBQVo7O0FBRUEsd0JBQUksUUFBUSxlQUFlLG1CQUEzQixFQUFnRDtBQUM1QyxxQ0FBYSxLQUFiO0FBQ0gscUJBRkQsTUFFTyxJQUFJLFFBQVEsZUFBZSxtQkFBM0IsRUFBZ0Q7QUFDbkQscUNBQWEsS0FBYjtBQUNILHFCQUZNLE1BRUE7QUFDSCxxQ0FBYSxHQUFiLElBQW9CLEtBQXBCO0FBQ0g7QUFDSjs7QUFFRCxvQkFBSSxVQUFVLGNBQWMsRUFBZCxFQUFrQixLQUFLLE1BQXZCLEVBQStCLFVBQS9CLEVBQTJDLFVBQTNDLEVBQXVELFlBQXZELENBQWQ7O0FBRUEscUJBQUssS0FBSyxHQUFWLEVBQWUsZUFBZSxlQUE5QixFQUErQyxVQUFDLElBQUQsRUFBTyxhQUFQLEVBQXlCO0FBQ3BFLDJCQUFPLEtBQUssT0FBTCxFQUFjLElBQWQsRUFBb0IsYUFBcEIsQ0FBUDtBQUNILGlCQUZEO0FBR0g7QUFqRkw7QUFBQTtBQUFBLDBDQW1Ga0IsUUFuRmxCLEVBbUY0QjtBQUFBOztBQUVwQixvQkFBSSxlQUFlLHNCQUFDLFFBQUQsRUFBYztBQUM3QiwyQkFBTyxRQUFQO0FBQ0gsaUJBRkQ7O0FBSUEsb0JBQUksVUFBVSxlQUFlLGNBQXpCLENBQUosRUFBOEM7O0FBRTFDLHdCQUFJLE9BQU8sUUFBUSxNQUFSLENBQVg7O0FBRUEsbUNBQWUsc0JBQUMsUUFBRCxFQUFjO0FBQ3pCLCtCQUFPLFFBQVEsS0FBSyxJQUFMLENBQVUsZUFBZSxjQUF6QixFQUF5QyxRQUF6QyxDQUFSLENBQVA7QUFDSCxxQkFGRDtBQUlILGlCQVJELE1BUU8sSUFBSSxlQUFlLGVBQWUsY0FBOUIsQ0FBSixFQUFtRDs7QUFFdEQsbUNBQWUsc0JBQUMsUUFBRCxFQUFjO0FBQ3pCLCtCQUFPLGVBQWUsY0FBZixDQUE4QixRQUE5QixDQUFQO0FBQ0gscUJBRkQ7QUFHSDs7QUFFRCxvQkFBSSxrQkFBa0IsS0FBSyxLQUFLLEdBQVYsRUFBZSxlQUFlLGVBQTlCLEVBQStDLGVBQWUscUJBQTlELEVBQXFGLEVBQXJGLENBQXRCOztBQUVBLG9CQUFJLFlBQVksS0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixlQUF0QixDQUFoQjtBQUNBLG9CQUFJLFFBQVEsQ0FBWjs7QUFFQSxvQkFBSSxPQUFPLFNBQVAsSUFBTyxDQUFDLEdBQUQsRUFBUzs7QUFFaEIsd0JBQUksT0FBTyxVQUFVLFVBQVUsTUFBL0IsRUFBdUM7QUFDbkMsK0JBQU8sU0FBUyxHQUFULENBQVA7QUFDSDs7QUFFRCx3QkFBSSxXQUFXLFVBQVUsT0FBVixDQUFmOztBQUVBLHdCQUFJLFVBQVUsUUFBVixDQUFKLEVBQXlCOztBQUVyQixtQ0FBVyxhQUFhLFFBQWIsQ0FBWDtBQUNIOztBQUVELHdCQUFJLENBQUMsWUFBWSxRQUFaLENBQUwsRUFBNEI7QUFDeEIsK0JBQU8sS0FBSyxJQUFJLEtBQUosZUFBc0IsS0FBdEIseUJBQUwsQ0FBUDtBQUNIOztBQUVELHdCQUFJOztBQUVBLGlDQUFTLE9BQUssR0FBZCxFQUFtQixJQUFuQjtBQUVILHFCQUpELENBSUUsT0FBTSxHQUFOLEVBQVc7O0FBRVQsNkJBQUssR0FBTDtBQUNIO0FBRUosaUJBMUJEOztBQTRCQTtBQUNIO0FBMUlMO0FBQUE7QUFBQSxpQ0E2SVMsUUE3SVQsRUE2SW1CO0FBQUE7O0FBRVgsb0JBQUksTUFBTSxDQUNOLFVBQUMsSUFBRCxFQUFVO0FBQ04sMkJBQUssVUFBTCxDQUFnQixJQUFoQjtBQUNILGlCQUhLLEVBSU4sVUFBQyxJQUFELEVBQVM7QUFDTCwyQkFBSyxhQUFMLENBQW1CLElBQW5CO0FBQ0gsaUJBTkssQ0FBVjs7QUFTQSxvQkFBSSxRQUFRLENBQVo7O0FBRUEsb0JBQUksT0FBTyxTQUFQLElBQU8sQ0FBQyxHQUFELEVBQVM7O0FBRWhCLHdCQUFJLE9BQU8sVUFBVSxJQUFJLE1BQXpCLEVBQWlDO0FBQzdCLCtCQUFPLFNBQVMsR0FBVCxFQUFjLE9BQUssR0FBbkIsQ0FBUDtBQUNIOztBQUVELHdCQUFJLEtBQUssSUFBSSxPQUFKLENBQVQ7O0FBRUEsd0JBQUk7O0FBRUEsMkJBQUcsSUFBSDtBQUVILHFCQUpELENBSUUsT0FBTSxHQUFOLEVBQVc7O0FBRVQsNkJBQUssR0FBTDtBQUNIO0FBQ0osaUJBaEJEOztBQWtCQTtBQUNIO0FBN0tMO0FBQUE7QUFBQSxnQ0ErS2dDO0FBQ3hCLHVCQUFPLGNBQVA7QUFDSDtBQWpMTDtBQUFBO0FBQUEsZ0NBbUx3QztBQUNoQyx1QkFBTyxzQkFBUDtBQUNIO0FBckxMOztBQUFBO0FBQUE7QUF1TEgsQ0FyTUQ7OztBQ1ZBOztBQUVBLElBQUksOEJBQThCLFFBQVEsZ0JBQVIsQ0FBbEM7O0FBRUEsSUFBSSxTQUFTLFFBQVEsUUFBUixDQUFiOztBQUVBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDtBQUNBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDs7QUFFQSxJQUFJLGNBQWMsUUFBUSxnQkFBUixDQUFsQjtBQUNBLElBQUksZUFBZSxRQUFRLGlCQUFSLENBQW5COztBQUVBLElBQUksZUFBZSxRQUFRLHlDQUFSLEVBQW1ELEVBQUMsTUFBTSxNQUFQLEVBQWUsU0FBUyxFQUFDLEtBQUssSUFBTixFQUF4QixFQUFuRCxDQUFuQjtBQUNBLElBQUkscUJBQXFCLFFBQVEsNkJBQVIsRUFBdUMsRUFBQyxNQUFNLE1BQVAsRUFBdkMsQ0FBekI7QUFDQSxJQUFJLGlCQUFpQixRQUFRLDRDQUFSLEVBQXNELEVBQUMsTUFBTSxNQUFQLEVBQXRELENBQXJCO0FBQ0EsSUFBSSx1QkFBdUIsUUFBUSw2QkFBUixFQUF1QyxFQUFDLE1BQU0sTUFBUCxFQUF2QyxDQUEzQjs7QUFFQTs7QUFFQSxTQUFTLGtCQUFULEVBQTZCLFlBQVc7O0FBRXBDLGFBQVMsd0JBQVQsRUFBbUMsWUFBVzs7QUFFMUMsWUFBSSxpQkFBaUI7QUFDakIsMEJBQWM7QUFERyxTQUFyQjs7QUFJQSxZQUFJLGNBQWMsNEJBQTRCLGNBQTVCLENBQWxCOztBQUVBLFdBQUcsNEJBQUgsRUFBaUMsWUFBVzs7QUFFeEMsd0JBQVksV0FBWjtBQUNILFNBSEQ7O0FBS0EsV0FBRyxzQ0FBSCxFQUEyQyxVQUFTLElBQVQsRUFBZTs7QUFFdEQsZ0JBQUksY0FBYyxJQUFJLFdBQUosRUFBbEI7O0FBRUEsd0JBQVksSUFBWixDQUFpQixVQUFTLEdBQVQsRUFBYzs7QUFFM0Isb0JBQUksR0FBSixFQUFTO0FBQ0wsMEJBQU0sR0FBTjtBQUNIO0FBQ0QsdUJBQU8sWUFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCLENBQVAsRUFBMkMsS0FBM0MsQ0FBaUQsS0FBakQ7QUFDQSx1QkFBTyxZQUFZLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkIsQ0FBUCxFQUEyQyxLQUEzQyxDQUFpRCxLQUFqRDtBQUNBLHVCQUFPLFlBQVksR0FBWixDQUFnQixNQUFoQixDQUF1Qiw0QkFBdkIsQ0FBUCxFQUE2RCxLQUE3RCxDQUFtRSxDQUFuRTtBQUNBLHVCQUFPLFlBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixtQkFBdkIsQ0FBUCxFQUFvRCxLQUFwRCxDQUEwRCxPQUExRDtBQUNBO0FBQ0gsYUFWRDtBQVdILFNBZkQ7O0FBaUJBLFdBQUcsaURBQUgsRUFBc0QsVUFBUyxJQUFULEVBQWU7O0FBRWpFLGdCQUFJLFNBQVM7QUFDVCwwQkFBVSxhQUREO0FBRVQsMEJBQVUsa0JBRkQ7QUFHVCwwQkFBVTtBQUNOLDhCQUFVO0FBREo7QUFIRCxhQUFiO0FBT0EsZ0JBQUksY0FBYyxJQUFJLFdBQUosQ0FBZ0I7QUFDOUIsd0JBQVE7QUFEc0IsYUFBaEIsQ0FBbEI7O0FBSUEsd0JBQVksSUFBWixDQUFpQixVQUFTLEdBQVQsRUFBYzs7QUFFM0Isb0JBQUksR0FBSixFQUFTO0FBQ0wsMEJBQU0sR0FBTjtBQUNIO0FBQ0QsdUJBQU8sWUFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCLENBQVAsRUFBMkMsS0FBM0MsQ0FBaUQsT0FBTyxRQUF4RDtBQUNBLHVCQUFPLFlBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixVQUF2QixDQUFQLEVBQTJDLEtBQTNDLENBQWlELE9BQU8sUUFBeEQ7QUFDQSx1QkFBTyxZQUFZLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBdUIsbUJBQXZCLENBQVAsRUFBb0QsS0FBcEQsQ0FBMEQsT0FBTyxRQUFQLENBQWdCLFFBQTFFO0FBQ0EsdUJBQU8sWUFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLG1CQUF2QixDQUFQLEVBQW9ELEdBQXBELENBQXdELEtBQXhELENBQThELFNBQTlEO0FBQ0E7QUFDSCxhQVZEO0FBV0gsU0F4QkQ7QUEwQkgsS0F4REQ7O0FBMERBLGFBQVMsaUJBQVQsRUFBNEIsWUFBVzs7QUFFbkMsWUFBSSxpQkFBaUI7QUFDakIsMEJBQWM7QUFERyxTQUFyQjs7QUFJQSxZQUFJLGNBQWMsNEJBQTRCLGNBQTVCLENBQWxCOztBQUVBLFdBQUcsNEJBQUgsRUFBaUMsWUFBVzs7QUFFeEMsd0JBQVksV0FBWjtBQUNILFNBSEQ7O0FBS0EsV0FBRyx1REFBSCxFQUE0RCxVQUFTLElBQVQsRUFBZTs7QUFFdkUsZ0JBQUksU0FBUztBQUNULDBCQUFVLGFBREQ7QUFFVCwwQkFBVSxrQkFGRDtBQUdULDBCQUFVO0FBQ04sOEJBQVU7QUFESjtBQUhELGFBQWI7QUFPQSxnQkFBSSxjQUFjLElBQUksV0FBSixDQUFnQjtBQUM5Qix3QkFBUTtBQURzQixhQUFoQixDQUFsQjs7QUFJQSx3QkFBWSxJQUFaLENBQWlCLFVBQVMsR0FBVCxFQUFjOztBQUUzQixvQkFBSSxHQUFKLEVBQVM7QUFDTCwwQkFBTSxHQUFOO0FBQ0g7QUFDRCx1QkFBTyxZQUFZLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBdUIsVUFBdkIsQ0FBUCxFQUEyQyxLQUEzQyxDQUFpRCxPQUFPLFFBQXhEO0FBQ0EsdUJBQU8sWUFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLFVBQXZCLENBQVAsRUFBMkMsS0FBM0MsQ0FBaUQsT0FBTyxRQUF4RDtBQUNBLHVCQUFPLFlBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixtQkFBdkIsQ0FBUCxFQUFvRCxLQUFwRCxDQUEwRCxPQUFPLFFBQVAsQ0FBZ0IsUUFBMUU7QUFDQTtBQUNILGFBVEQ7QUFVSCxTQXZCRDtBQXdCSCxLQXJDRDs7QUF1Q0EsYUFBUyw0QkFBVCxFQUF1QyxZQUFXOztBQUU5QyxZQUFJLGlCQUFpQjtBQUNqQiw0QkFBZ0I7QUFEQyxTQUFyQjs7QUFJQSxZQUFJLGNBQWMsNEJBQTRCLGNBQTVCLENBQWxCOztBQUVBLFdBQUcscURBQUgsRUFBMEQsVUFBUyxJQUFULEVBQWU7O0FBRXJFLGdCQUFJLGNBQWMsSUFBSSxXQUFKLENBQWdCO0FBQzlCLHdCQUFRO0FBQ0osK0JBQVcsQ0FDUCxtQkFETyxFQUVQLGNBRk8sRUFHUCxVQUFTLEdBQVQsRUFBYyxJQUFkLEVBQW9CO0FBQ2hCLDRCQUFJLGVBQUosR0FBc0IsWUFBVzs7QUFFN0IsbUNBQU8sQ0FBUDtBQUNILHlCQUhEO0FBSUE7QUFDSCxxQkFUTTtBQURQO0FBRHNCLGFBQWhCLENBQWxCOztBQWdCQSx3QkFBWSxJQUFaLENBQWlCLFVBQVMsR0FBVCxFQUFjOztBQUUzQixvQkFBSSxHQUFKLEVBQVM7QUFDTCwwQkFBTSxHQUFOO0FBQ0g7O0FBRUQsNEJBQVksR0FBWixDQUFnQixnQkFBaEIsR0FBbUMsTUFBbkMsQ0FBMEMsS0FBMUMsQ0FBZ0QsQ0FBaEQ7QUFDQSw0QkFBWSxHQUFaLENBQWdCLFdBQWhCLEdBQThCLE1BQTlCLENBQXFDLEtBQXJDLENBQTJDLENBQTNDO0FBQ0EsNEJBQVksR0FBWixDQUFnQixlQUFoQixHQUFrQyxNQUFsQyxDQUF5QyxLQUF6QyxDQUErQyxDQUEvQzs7QUFFQTtBQUNILGFBWEQ7QUFhSCxTQS9CRDtBQWdDSCxLQXhDRDs7QUEwQ0EsYUFBUyxtQkFBVCxFQUE4QixZQUFXOztBQUVyQyxZQUFJLGlCQUFpQjtBQUNqQiw0QkFBZ0I7QUFEQyxTQUFyQjs7QUFJQSxZQUFJLGNBQWMsNEJBQTRCLGNBQTVCLENBQWxCOztBQUVBLFdBQUcsNEJBQUgsRUFBaUMsWUFBVzs7QUFFeEMsd0JBQVksV0FBWjtBQUNILFNBSEQ7O0FBS0EsV0FBRyxvQ0FBSCxFQUF5QyxVQUFTLElBQVQsRUFBZTs7QUFFcEQsZ0JBQUksY0FBYyxJQUFJLFdBQUosQ0FBZ0I7QUFDOUIsMkJBQVcsQ0FDUCxVQUFTLEdBQVQsRUFBYyxJQUFkLEVBQW9COztBQUVoQix3QkFBSSxrQkFBSixHQUF5QixDQUF6QjtBQUNBO0FBQ0gsaUJBTE0sRUFNUCxVQUFTLEdBQVQsRUFBYyxJQUFkLEVBQW9COztBQUVoQix3QkFBSSx3QkFBSixHQUErQixDQUEvQjtBQUNBO0FBQ0gsaUJBVk0sQ0FEbUI7QUFhOUIsd0JBQVE7QUFDSiwrQkFBVyxDQUNQLFVBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0I7QUFDaEIsNEJBQUksd0JBQUosR0FBK0IsQ0FBL0I7QUFDQTtBQUNILHFCQUpNO0FBRFA7QUFic0IsYUFBaEIsQ0FBbEI7O0FBdUJBLHdCQUFZLElBQVosQ0FBaUIsVUFBUyxHQUFULEVBQWM7O0FBRTNCLG9CQUFJLEdBQUosRUFBUztBQUNMLDBCQUFNLEdBQU47QUFDSDtBQUNELDRCQUFZLEdBQVosQ0FBZ0Isa0JBQWhCLENBQW1DLE1BQW5DLENBQTBDLEtBQTFDLENBQWdELENBQWhEO0FBQ0EsNEJBQVksR0FBWixDQUFnQix3QkFBaEIsQ0FBeUMsTUFBekMsQ0FBZ0QsS0FBaEQsQ0FBc0QsQ0FBdEQ7QUFDQSw0QkFBWSxHQUFaLENBQWdCLHdCQUFoQixDQUF5QyxNQUF6QyxDQUFnRCxLQUFoRCxDQUFzRCxDQUF0RDtBQUNBO0FBQ0gsYUFURDtBQVdILFNBcENEO0FBcUNILEtBbEREOztBQW9EQSxhQUFTLDBDQUFULEVBQXFELFlBQVc7O0FBRTVELFlBQUksc0JBQXNCLE9BQTFCO0FBQ0EsWUFBSSxzQkFBc0IsYUFBMUI7QUFDQSxZQUFJLHdCQUF3Qix3QkFBNUI7QUFDQSxZQUFJLGtCQUFrQixlQUF0Qjs7QUFFQSxZQUFJLGlCQUFpQjtBQUNqQiwwQkFBYyxFQURHO0FBRWpCLGlDQUFxQixtQkFGSjtBQUdqQixpQ0FBcUIsbUJBSEo7QUFJakIsbUNBQXVCLHFCQUpOO0FBS2pCLDZCQUFpQixlQUxBO0FBTWpCLDRCQUFnQjtBQU5DLFNBQXJCO0FBUUEsdUJBQWUsWUFBZixDQUE0QixtQkFBNUIsSUFBbUQ7QUFDL0Msc0JBQVU7QUFEcUMsU0FBbkQ7QUFHQSx1QkFBZSxZQUFmLENBQTRCLG1CQUE1QixJQUFtRDtBQUMvQyxzQkFBVSxPQURxQztBQUUvQyxxQkFBUztBQUZzQyxTQUFuRDtBQUlBLGFBQUssZUFBZSxZQUFmLENBQTRCLG1CQUE1QixDQUFMLEVBQXVELHFCQUF2RCxFQUE4RSxDQUMxRSxjQUQwRSxDQUE5RTs7QUFJQSxZQUFJLGNBQWMsNEJBQTRCLGNBQTVCLENBQWxCOztBQUVBLFdBQUcsaUNBQUgsRUFBc0MsVUFBUyxJQUFULEVBQWU7O0FBRWpELGdCQUFJLGNBQWMsSUFBSSxXQUFKLEVBQWxCO0FBQ0Esd0JBQVksSUFBWixHQUFtQixJQUFuQjtBQUNBLHdCQUFZLElBQVosQ0FBaUIsVUFBUyxHQUFULEVBQWM7O0FBRTNCLG9CQUFJLEdBQUosRUFBUztBQUNMLDBCQUFNLEdBQU47QUFDSDs7QUFFRCxvQkFBSSxTQUFTLEtBQUssWUFBWSxHQUFqQixFQUFzQixlQUF0QixDQUFiO0FBQ0EsdUJBQU8sT0FBTyxVQUFQLENBQVAsRUFBMkIsS0FBM0IsQ0FBaUMsT0FBakM7QUFDQSx1QkFBTyxPQUFPLFNBQVAsQ0FBUCxFQUEwQixLQUExQixDQUFnQyxTQUFoQztBQUNBLDRCQUFZLEdBQVosQ0FBZ0IsV0FBaEIsR0FBOEIsTUFBOUIsQ0FBcUMsS0FBckMsQ0FBMkMsQ0FBM0M7QUFDQTtBQUNILGFBWEQ7QUFZSCxTQWhCRDtBQWtCSCxLQTlDRDtBQWdESCxDQWpQRDs7O0FDbkJBOztBQUVBLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBYjtBQUNBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDtBQUNBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDtBQUNBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCO0FBQ0EsSUFBSSw4QkFBOEIsUUFBUSxnQkFBUixDQUFsQzs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxZQUFULEdBQXdCO0FBQ3JDLGFBQVMsU0FBVCxFQUFvQixZQUFXOztBQUUzQixpQkFBUyxzQkFBVCxFQUFpQyxZQUFXOztBQUV4QyxnQkFBSSxjQUFjLDZCQUFsQjs7QUFFQSx3QkFBWSxXQUFaO0FBQ0gsU0FMRDs7QUFPQSxpQkFBUywyQkFBVCxFQUFzQyxZQUFXOztBQUU3QyxnQkFBSSxpQkFBaUI7QUFDakIsaUNBQWlCO0FBREEsYUFBckI7O0FBSUEsZ0JBQUksY0FBYyw0QkFBNEIsY0FBNUIsQ0FBbEI7O0FBRUEsd0JBQVksV0FBWjs7QUFFQSxxQkFBUyxlQUFULEVBQTBCLFlBQVc7O0FBRWpDLG1CQUFHLHNEQUFILEVBQTJELFVBQVMsSUFBVCxFQUFlOztBQUV0RSx3QkFBSSxjQUFjLElBQUksV0FBSixDQUFnQjtBQUM5QixnQ0FBUTtBQUNKLHNDQUFVO0FBRE47QUFEc0IscUJBQWhCLENBQWxCOztBQU1BLGdDQUFZLElBQVosQ0FBaUIsVUFBUyxHQUFULEVBQWM7O0FBRTNCLDRCQUFJLEdBQUosRUFBUztBQUNMLGtDQUFNLEdBQU47QUFDSDs7QUFFRCwrQkFBTyxLQUFLLFlBQVksR0FBakIsRUFBc0IsZUFBZSxlQUFyQyxDQUFQLEVBQThELEdBQTlELENBQWtFLEtBQWxFLENBQXdFLFNBQXhFO0FBQ0Esb0NBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixNQUF2QixDQUE4QixVQUE5QixFQUEwQyxNQUExQyxDQUFpRCxLQUFqRCxDQUF1RCxPQUF2RDtBQUNBO0FBQ0gscUJBVEQ7QUFVSCxpQkFsQkQ7QUFtQkgsYUFyQkQ7QUFzQkgsU0FoQ0Q7O0FBa0NBLGlCQUFTLGlDQUFULEVBQTRDLFlBQVc7O0FBRW5ELGdCQUFJLGlCQUFpQjtBQUNqQix1Q0FBdUI7QUFETixhQUFyQjs7QUFJQSxnQkFBSSxjQUFjLDRCQUE0QixjQUE1QixDQUFsQjs7QUFFQSx3QkFBWSxXQUFaOztBQUVBLHFCQUFTLGtCQUFULEVBQTZCLFlBQVc7O0FBRXBDLG1CQUFHLDRFQUFILEVBQWlGLFVBQVMsSUFBVCxFQUFlOztBQUU1Rix3QkFBSSxTQUFTLEVBQWI7QUFDQSx5QkFBSyxNQUFMLEVBQWEsa0JBQWIsRUFBaUMsQ0FDN0IsVUFBUyxHQUFULEVBQWMsSUFBZCxFQUFvQjtBQUNoQiw0QkFBSSxTQUFKLEdBQWdCLFlBQVc7QUFDdkIsbUNBQU8sT0FBUDtBQUNILHlCQUZEO0FBR0E7QUFDSCxxQkFONEIsQ0FBakM7QUFRQSx3QkFBSSxjQUFjLElBQUksV0FBSixDQUFnQjtBQUM5QixnQ0FBUTtBQURzQixxQkFBaEIsQ0FBbEI7O0FBSUEsZ0NBQVksSUFBWixDQUFpQixVQUFTLEdBQVQsRUFBYzs7QUFFM0IsNEJBQUksR0FBSixFQUFTO0FBQ0wsa0NBQU0sR0FBTjtBQUNIOztBQUVELCtCQUFPLFlBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixrQkFBdkIsQ0FBUCxFQUFtRCxHQUFuRCxDQUF1RCxLQUF2RCxDQUE2RCxTQUE3RDtBQUNBLG9DQUFZLEdBQVosQ0FBZ0IsU0FBaEIsR0FBNEIsTUFBNUIsQ0FBbUMsS0FBbkMsQ0FBeUMsT0FBekM7QUFDQTtBQUNILHFCQVREO0FBVUgsaUJBekJEO0FBMEJILGFBNUJEO0FBNkJILFNBdkNEO0FBd0NILEtBbkZEO0FBb0ZILENBckZEOzs7OztBQ1JBLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBYjtBQUNBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDtBQUNBLElBQUksT0FBTyxRQUFRLFlBQVIsQ0FBWDs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxXQUFULENBQXFCLFdBQXJCLEVBQWtDOztBQUUvQyxRQUFJLGtCQUFrQixZQUFZLGNBQVosQ0FBMkIsZUFBakQ7O0FBRUEsYUFBUyxrQkFBVCxFQUE2QixZQUFXOztBQUVwQyxXQUFHLHFGQUFILEVBQTBGLFVBQVMsSUFBVCxFQUFlOztBQUVyRyxnQkFBSSxjQUFjLElBQUksV0FBSixFQUFsQjs7QUFFQSx3QkFBWSxJQUFaLENBQWlCLFVBQVMsR0FBVCxFQUFjOztBQUUzQixvQkFBSSxHQUFKLEVBQVM7QUFDTCwwQkFBTSxHQUFOO0FBQ0g7QUFDRCx1QkFBTyxLQUFLLFlBQVksR0FBakIsRUFBc0IsZUFBdEIsQ0FBUCxFQUErQyxHQUEvQyxDQUFtRCxLQUFuRCxDQUF5RCxTQUF6RDtBQUNBO0FBQ0gsYUFQRDtBQVFILFNBWkQ7QUFhSCxLQWZEOztBQWlCQSxhQUFTLHFCQUFULEVBQWdDLFlBQVc7O0FBRXZDLFlBQUksTUFBTTtBQUNOLGtCQUFNO0FBREEsU0FBVjs7QUFLQSxXQUFHLGtGQUFILEVBQXVGLFVBQVMsSUFBVCxFQUFlOztBQUVsRyxnQkFBSSxjQUFjLElBQUksV0FBSixDQUFnQixFQUFDLEtBQUssR0FBTixFQUFoQixDQUFsQjtBQUNBLHdCQUFZLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBdUIsS0FBdkIsQ0FBNkIsR0FBN0I7QUFDQSx3QkFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLElBQXZCLENBQTRCLFFBQTVCLENBQXFDLE1BQXJDLEVBQTZDLElBQUksSUFBakQ7O0FBRUEsd0JBQVksSUFBWixDQUFpQixVQUFTLEdBQVQsRUFBYzs7QUFFM0Isb0JBQUksR0FBSixFQUFTO0FBQ0wsMEJBQU0sR0FBTjtBQUNIO0FBQ0QsdUJBQU8sS0FBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLENBQVAsRUFBK0MsR0FBL0MsQ0FBbUQsS0FBbkQsQ0FBeUQsU0FBekQ7QUFDQTtBQUNILGFBUEQ7QUFRSCxTQWREO0FBZ0JILEtBdkJEOztBQXlCQSxhQUFTLHdCQUFULEVBQW1DLFlBQVc7O0FBRTFDLFlBQUksU0FBUztBQUNULGVBQUcsTUFETTtBQUVULGVBQUc7QUFDQyxtQkFBRztBQURKO0FBRk0sU0FBYjs7QUFPQSxXQUFHLDZEQUFILEVBQWtFLFVBQVMsSUFBVCxFQUFlOztBQUU3RSxnQkFBSSxjQUFjLElBQUksV0FBSixDQUFnQixFQUFDLFFBQVEsTUFBVCxFQUFoQixDQUFsQjtBQUNBLHdCQUFZLE1BQVosQ0FBbUIsTUFBbkIsQ0FBMEIsS0FBMUIsQ0FBZ0MsTUFBaEM7QUFDQSx3QkFBWSxJQUFaLENBQWlCLFVBQVMsR0FBVCxFQUFjOztBQUUzQixvQkFBSSxHQUFKLEVBQVM7QUFDTCwwQkFBTSxHQUFOO0FBQ0g7O0FBRUQsdUJBQU8sS0FBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLENBQVAsRUFBK0MsR0FBL0MsQ0FBbUQsS0FBbkQsQ0FBeUQsU0FBekQ7QUFDQSxxQkFBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLEVBQXVDLEdBQXZDLEVBQTRDLE1BQTVDLENBQW1ELEtBQW5ELENBQXlELE9BQU8sQ0FBaEU7QUFDQSxxQkFBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLEVBQXVDLEtBQXZDLEVBQThDLE1BQTlDLENBQXFELEtBQXJELENBQTJELE9BQU8sQ0FBUCxDQUFTLENBQXBFO0FBQ0E7QUFDSCxhQVZEO0FBV0gsU0FmRDtBQWdCSCxLQXpCRDs7QUEyQkEsYUFBUywyQ0FBVCxFQUFzRCxZQUFXOztBQUU3RCxZQUFJLE1BQU07QUFDTixrQkFBTTtBQURBLFNBQVY7O0FBSUEsWUFBSSxTQUFTO0FBQ1QsZUFBRyxNQURNO0FBRVQsZUFBRztBQUNDLG1CQUFHO0FBREo7QUFGTSxTQUFiOztBQU9BLFdBQUcsNkRBQUgsRUFBa0UsVUFBUyxJQUFULEVBQWU7O0FBRTdFLGdCQUFJLGNBQWMsSUFBSSxXQUFKLENBQWdCLEVBQUMsS0FBSyxHQUFOLEVBQVcsUUFBUSxNQUFuQixFQUFoQixDQUFsQjtBQUNBLHdCQUFZLE1BQVosQ0FBbUIsTUFBbkIsQ0FBMEIsS0FBMUIsQ0FBZ0MsTUFBaEM7QUFDQSx3QkFBWSxJQUFaLENBQWlCLFVBQVMsR0FBVCxFQUFjOztBQUUzQixvQkFBSSxHQUFKLEVBQVM7QUFDTCwwQkFBTSxHQUFOO0FBQ0g7QUFDRCw0QkFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLEtBQXZCLENBQTZCLEdBQTdCO0FBQ0EsNEJBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixJQUF2QixDQUE0QixRQUE1QixDQUFxQyxNQUFyQyxFQUE2QyxJQUFJLElBQWpEO0FBQ0EsdUJBQU8sS0FBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLENBQVAsRUFBK0MsR0FBL0MsQ0FBbUQsS0FBbkQsQ0FBeUQsU0FBekQ7QUFDQSxxQkFBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLEVBQXVDLEdBQXZDLEVBQTRDLE1BQTVDLENBQW1ELEtBQW5ELENBQXlELE9BQU8sQ0FBaEU7QUFDQSxxQkFBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLEVBQXVDLEtBQXZDLEVBQThDLE1BQTlDLENBQXFELEtBQXJELENBQTJELE9BQU8sQ0FBUCxDQUFTLENBQXBFOztBQUVBO0FBQ0gsYUFaRDtBQWFILFNBakJEO0FBa0JILEtBL0JEOztBQWtDQSxhQUFTLGtDQUFULEVBQTZDLFlBQVc7O0FBRXBELFlBQUksWUFBWSxDQUNaLFVBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0I7QUFDaEIsZ0JBQUksU0FBSixHQUFnQixZQUFXO0FBQ3ZCLHVCQUFPLENBQVA7QUFDSCxhQUZEO0FBR0E7QUFDSCxTQU5XLEVBT1osVUFBUyxHQUFULEVBQWMsSUFBZCxFQUFvQjs7QUFFaEIsdUJBQVcsWUFBVzs7QUFFbEIsb0JBQUksY0FBSixHQUFxQixZQUFXO0FBQzVCLDJCQUFPLENBQVA7QUFDSCxpQkFGRDtBQUdBO0FBQ0gsYUFORCxFQU1HLEdBTkg7QUFPSCxTQWhCVyxDQUFoQjs7QUFtQkEsV0FBRyw2REFBSCxFQUFrRSxVQUFTLElBQVQsRUFBZTs7QUFFN0UsZ0JBQUksY0FBYyxJQUFJLFdBQUosQ0FBZ0IsRUFBQyxXQUFXLFNBQVosRUFBaEIsQ0FBbEI7QUFDQSx3QkFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLEtBQTdCLENBQW1DLFNBQW5DO0FBQ0Esd0JBQVksSUFBWixDQUFpQixVQUFTLEdBQVQsRUFBYzs7QUFFM0Isb0JBQUksR0FBSixFQUFTO0FBQ0wsMEJBQU0sR0FBTjtBQUNIO0FBQ0QsNEJBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixJQUF2QixDQUE0QixRQUE1QixDQUFxQyxXQUFyQztBQUNBLDRCQUFZLEdBQVosQ0FBZ0IsU0FBaEIsR0FBNEIsTUFBNUIsQ0FBbUMsS0FBbkMsQ0FBeUMsQ0FBekM7QUFDQSw0QkFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLElBQXZCLENBQTRCLFFBQTVCLENBQXFDLGdCQUFyQztBQUNBLDRCQUFZLEdBQVosQ0FBZ0IsY0FBaEIsR0FBaUMsTUFBakMsQ0FBd0MsS0FBeEMsQ0FBOEMsQ0FBOUM7QUFDQTtBQUNILGFBVkQ7QUFXSCxTQWZEO0FBZ0JILEtBckNEOztBQXVDQSxhQUFTLHlFQUFULEVBQW9GLFlBQVc7O0FBRTNGLFlBQUksTUFBTTtBQUNOLGtCQUFNO0FBREEsU0FBVjs7QUFJQSxZQUFJLFNBQVM7QUFDVCxlQUFHLE1BRE07QUFFVCxlQUFHO0FBQ0MsbUJBQUc7QUFESjtBQUZNLFNBQWI7QUFNQSxhQUFLLE1BQUwsRUFBYSxZQUFZLGNBQVosQ0FBMkIscUJBQXhDLEVBQStELENBQzNELFVBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0I7QUFDaEIsZ0JBQUksYUFBSixHQUFvQixZQUFXOztBQUUzQix1QkFBTyxDQUFQO0FBQ0gsYUFIRDtBQUlBO0FBQ0gsU0FQMEQsQ0FBL0Q7O0FBVUEsWUFBSSxZQUFZLENBQ1osVUFBUyxHQUFULEVBQWMsSUFBZCxFQUFvQjtBQUNoQixnQkFBSSxTQUFKLEdBQWdCLFlBQVc7QUFDdkIsdUJBQU8sQ0FBUDtBQUNILGFBRkQ7QUFHQTtBQUNILFNBTlcsRUFPWixVQUFTLEdBQVQsRUFBYyxJQUFkLEVBQW9COztBQUVoQix1QkFBVyxZQUFXOztBQUVsQixvQkFBSSxjQUFKLEdBQXFCLFlBQVc7QUFDNUIsMkJBQU8sQ0FBUDtBQUNILGlCQUZEO0FBR0E7QUFDSCxhQU5ELEVBTUcsR0FOSDtBQU9ILFNBaEJXLENBQWhCOztBQW1CQSxXQUFHLDZEQUFILEVBQWtFLFVBQVMsSUFBVCxFQUFlOztBQUU3RSxnQkFBSSxjQUFjLElBQUksV0FBSixDQUFnQixFQUFDLEtBQUssR0FBTixFQUFXLFFBQVEsTUFBbkIsRUFBMkIsV0FBVyxTQUF0QyxFQUFoQixDQUFsQjtBQUNBLHdCQUFZLE1BQVosQ0FBbUIsTUFBbkIsQ0FBMEIsS0FBMUIsQ0FBZ0MsTUFBaEM7QUFDQSx3QkFBWSxJQUFaLENBQWlCLFVBQVMsR0FBVCxFQUFjOztBQUUzQixvQkFBSSxHQUFKLEVBQVM7QUFDTCwwQkFBTSxHQUFOO0FBQ0g7QUFDRCw0QkFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLEtBQXZCLENBQTZCLEdBQTdCO0FBQ0EsNEJBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixJQUF2QixDQUE0QixRQUE1QixDQUFxQyxNQUFyQyxFQUE2QyxJQUFJLElBQWpEO0FBQ0EsdUJBQU8sS0FBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLENBQVAsRUFBK0MsR0FBL0MsQ0FBbUQsS0FBbkQsQ0FBeUQsU0FBekQ7QUFDQSxxQkFBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLEVBQXVDLEdBQXZDLEVBQTRDLE1BQTVDLENBQW1ELEtBQW5ELENBQXlELE9BQU8sQ0FBaEU7QUFDQSxxQkFBSyxZQUFZLEdBQWpCLEVBQXNCLGVBQXRCLEVBQXVDLEtBQXZDLEVBQThDLE1BQTlDLENBQXFELEtBQXJELENBQTJELE9BQU8sQ0FBUCxDQUFTLENBQXBFO0FBQ0EsNEJBQVksR0FBWixDQUFnQixNQUFoQixDQUF1QixJQUF2QixDQUE0QixRQUE1QixDQUFxQyxXQUFyQztBQUNBLDRCQUFZLEdBQVosQ0FBZ0IsU0FBaEIsR0FBNEIsTUFBNUIsQ0FBbUMsS0FBbkMsQ0FBeUMsQ0FBekM7QUFDQSw0QkFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLElBQXZCLENBQTRCLFFBQTVCLENBQXFDLGdCQUFyQztBQUNBLDRCQUFZLEdBQVosQ0FBZ0IsY0FBaEIsR0FBaUMsTUFBakMsQ0FBd0MsS0FBeEMsQ0FBOEMsQ0FBOUM7QUFDQSw0QkFBWSxHQUFaLENBQWdCLE1BQWhCLENBQXVCLElBQXZCLENBQTRCLFFBQTVCLENBQXFDLGVBQXJDO0FBQ0EsNEJBQVksR0FBWixDQUFnQixhQUFoQixHQUFnQyxNQUFoQyxDQUF1QyxLQUF2QyxDQUE2QyxDQUE3QztBQUNBO0FBQ0gsYUFqQkQ7QUFrQkgsU0F0QkQ7QUF1QkgsS0FoRUQ7QUFpRUgsQ0FuTkQ7Ozs7O0FDSkEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsY0FBVTtBQURHLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGNBQVUsQ0FERztBQUViLGNBQVUsS0FGRztBQUdiLGNBQVUsQ0FDTixJQURNLEVBQ0E7QUFDRixrQkFBVTtBQURSLEtBREEsQ0FIRztBQVFiLGNBQVU7QUFDTixrQkFBVTtBQUNOLHNCQUFVO0FBREo7QUFESjtBQVJHLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGNBQVUsT0FERztBQUViLGNBQVU7QUFGRyxDQUFqQjs7O0FDQUE7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQixJQUEzQixFQUFpQzs7QUFFOUMsUUFBSSxXQUFKLEdBQWtCLFlBQVc7O0FBRXpCLGVBQU8sQ0FBUDtBQUNILEtBSEQ7QUFJQTtBQUNILENBUEQ7OztBQ0ZBOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFTLGlCQUFULENBQTJCLEdBQTNCLEVBQWdDLElBQWhDLEVBQXNDOztBQUVuRCxlQUFXLFlBQVc7O0FBRWxCLFlBQUksZ0JBQUosR0FBdUIsWUFBVztBQUM5QixtQkFBTyxDQUFQO0FBQ0gsU0FGRDtBQUdBO0FBQ0gsS0FORCxFQU1HLEdBTkg7QUFPSCxDQVREIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG4vKlxuICogRXhwb3J0IGtNYXhMZW5ndGggYWZ0ZXIgdHlwZWQgYXJyYXkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkLlxuICovXG5leHBvcnRzLmtNYXhMZW5ndGggPSBrTWF4TGVuZ3RoKClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAodGhhdCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXR0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2MobnVsbCwgc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlICh0aGF0LCBzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICB0aGF0W2ldID0gMFxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKG51bGwsIHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuXG4gIHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYXJyYXkuYnl0ZUxlbmd0aCAvLyB0aGlzIHRocm93cyBpZiBgYXJyYXlgIGlzIG5vdCBhIHZhbGlkIEFycmF5QnVmZmVyXG5cbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ29mZnNldFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnbGVuZ3RoXFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gYXJyYXlcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgdGhhdCA9IGZyb21BcnJheUxpa2UodGhhdCwgYXJyYXkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAodGhhdCwgb2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuKVxuXG4gICAgaWYgKHRoYXQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhhdFxuICAgIH1cblxuICAgIG9iai5jb3B5KHRoYXQsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gdGhhdFxuICB9XG5cbiAgaWYgKG9iaikge1xuICAgIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICBvYmouYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8ICdsZW5ndGgnIGluIG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBpc25hbihvYmoubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIDApXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmopXG4gICAgfVxuXG4gICAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iai5kYXRhKSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqLmRhdGEpXG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIGFycmF5LWxpa2Ugb2JqZWN0LicpXG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAvLyBEZXByZWNhdGVkXG4gICAgICBjYXNlICdyYXcnOlxuICAgICAgY2FzZSAncmF3cyc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgZm9yICh2YXIgaSA9IDA7IGJ5dGVPZmZzZXQgKyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocmVhZChhcnIsIGJ5dGVPZmZzZXQgKyBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gKGJ5dGVPZmZzZXQgKyBmb3VuZEluZGV4KSAqIGluZGV4U2l6ZVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgIH1cbiAgfVxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA+Pj0gMFxuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG4gIGlmIChieXRlT2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm4gLTFcblxuICAvLyBOZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IE1hdGgubWF4KHRoaXMubGVuZ3RoICsgYnl0ZU9mZnNldCwgMClcblxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gc3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKVxuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCBbIHZhbCBdLCBieXRlT2Zmc2V0LCBlbmNvZGluZylcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBiaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAgIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyBpKyspIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbG9va3VwW2ldID0gY29kZVtpXVxuICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxuICB9XG5cbiAgcmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG4gIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xufVxuXG5pbml0KClcblxuZnVuY3Rpb24gdG9CeXRlQXJyYXkgKGI2NCkge1xuICB2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG4gIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcbiAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXG5cbiAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gIGFyciA9IG5ldyBBcnIobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cblxuICB2YXIgTCA9IDBcblxuICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBvdXRwdXQgPSAnJ1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPT0nXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArICh1aW50OFtsZW4gLSAxXSlcbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAxMF1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9J1xuICB9XG5cbiAgcGFydHMucHVzaChvdXRwdXQpXG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBoYXNoIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gSGFzaCgpIHt9XG5cbi8vIEF2b2lkIGluaGVyaXRpbmcgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAgd2hlbiBwb3NzaWJsZS5cbkhhc2gucHJvdG90eXBlID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDogb2JqZWN0UHJvdG87XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2xlYXIgPSByZXF1aXJlKCcuL19tYXBDbGVhcicpLFxuICAgIG1hcERlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcERlbGV0ZScpLFxuICAgIG1hcEdldCA9IHJlcXVpcmUoJy4vX21hcEdldCcpLFxuICAgIG1hcEhhcyA9IHJlcXVpcmUoJy4vX21hcEhhcycpLFxuICAgIG1hcFNldCA9IHJlcXVpcmUoJy4vX21hcFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPyB2YWx1ZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gdmFsdWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcEhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFJlZmxlY3QgPSByb290LlJlZmxlY3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVmbGVjdDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2sodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID8gdmFsdWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IHZhbHVlc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsIi8qKlxuICogQWRkcyB0aGUga2V5LXZhbHVlIGBwYWlyYCB0byBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhaXIgVGhlIGtleS12YWx1ZSBwYWlyIHRvIGFkZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG1hcGAuXG4gKi9cbmZ1bmN0aW9uIGFkZE1hcEVudHJ5KG1hcCwgcGFpcikge1xuICAvLyBEb24ndCByZXR1cm4gYE1hcCNzZXRgIGJlY2F1c2UgaXQgZG9lc24ndCByZXR1cm4gdGhlIG1hcCBpbnN0YW5jZSBpbiBJRSAxMS5cbiAgbWFwLnNldChwYWlyWzBdLCBwYWlyWzFdKTtcbiAgcmV0dXJuIG1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNYXBFbnRyeTtcbiIsIi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIGBzZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYWRkLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgc2V0YC5cbiAqL1xuZnVuY3Rpb24gYWRkU2V0RW50cnkoc2V0LCB2YWx1ZSkge1xuICBzZXQuYWRkKHZhbHVlKTtcbiAgcmV0dXJuIHNldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRTZXRFbnRyeTtcbiIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgdmFyIGxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5yZWR1Y2VgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpbml0QWNjdW1dIFNwZWNpZnkgdXNpbmcgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YCBhc1xuICogIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0pIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgaWYgKGluaXRBY2N1bSAmJiBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGFycmF5WysraW5kZXhdO1xuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYWNjdW11bGF0b3IgPSBpdGVyYXRlZShhY2N1bXVsYXRvciwgYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiBhY2N1bXVsYXRvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVJlZHVjZTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGFzc2lnblZhbHVlYCBleGNlcHQgdGhhdCBpdCBkb2Vzbid0IGFzc2lnblxuICogYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmICgodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhZXEob2JqZWN0W2tleV0sIHZhbHVlKSkgfHxcbiAgICAgICh0eXBlb2Yga2V5ID09ICdudW1iZXInICYmIHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduTWVyZ2VWYWx1ZTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGFzc29jaWF0aXZlIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jRGVsZXRlKGFycmF5LCBrZXkpIHtcbiAgdmFyIGluZGV4ID0gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgYXJyYXkucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoYXJyYXksIGluZGV4LCAxKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0RlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBhc3NvY2lhdGl2ZSBhcnJheSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBhc3NvY0dldChhcnJheSwga2V5KSB7XG4gIHZhciBpbmRleCA9IGFzc29jSW5kZXhPZihhcnJheSwga2V5KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGFycmF5W2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0dldDtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gYXNzb2NpYXRpdmUgYXJyYXkgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSGFzKGFycmF5LCBrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSGFzO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIFNldHMgdGhlIGFzc29jaWF0aXZlIGFycmF5IGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NTZXQoYXJyYXksIGtleSwgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgYXJyYXkucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGFycmF5W2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NTZXQ7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduYCB3aXRob3V0IHN1cHBvcnQgZm9yIG11bHRpcGxlIHNvdXJjZXNcbiAqIG9yIGBjdXN0b21pemVyYCBmdW5jdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgY29weU9iamVjdChzb3VyY2UsIGtleXMoc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ24nKSxcbiAgICBjbG9uZUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQnVmZmVyJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgY29weVN5bWJvbHMgPSByZXF1aXJlKCcuL19jb3B5U3ltYm9scycpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNIb3N0T2JqZWN0ID0gcmVxdWlyZSgnLi9faXNIb3N0T2JqZWN0JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRhVmlld1RhZ10gPVxuY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MTZUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MzJUYWddID0gY2xvbmVhYmxlVGFnc1ttYXBUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID0gY2xvbmVhYmxlVGFnc1tzeW1ib2xUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3NcbiAqIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0Z1bGxdIFNwZWNpZnkgYSBjbG9uZSBpbmNsdWRpbmcgc3ltYm9scy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCBpc0Z1bGwsIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFjaykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0LCBzdGFjaykgOiBjdXN0b21pemVyKHZhbHVlKTtcbiAgfVxuICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICBpZiAoaXNBcnIpIHtcbiAgICByZXN1bHQgPSBpbml0Q2xvbmVBcnJheSh2YWx1ZSk7XG4gICAgaWYgKCFpc0RlZXApIHtcbiAgICAgIHJldHVybiBjb3B5QXJyYXkodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xuXG4gICAgaWYgKGlzQnVmZmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNsb25lQnVmZmVyKHZhbHVlLCBpc0RlZXApO1xuICAgIH1cbiAgICBpZiAodGFnID09IG9iamVjdFRhZyB8fCB0YWcgPT0gYXJnc1RhZyB8fCAoaXNGdW5jICYmICFvYmplY3QpKSB7XG4gICAgICBpZiAoaXNIb3N0T2JqZWN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZU9iamVjdChpc0Z1bmMgPyB7fSA6IHZhbHVlKTtcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiBjb3B5U3ltYm9scyh2YWx1ZSwgYmFzZUFzc2lnbihyZXN1bHQsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2xvbmVhYmxlVGFnc1t0YWddKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QgPyB2YWx1ZSA6IHt9O1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgYmFzZUNsb25lLCBpc0RlZXApO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGl0cyBjb3JyZXNwb25kaW5nIGNsb25lLlxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldCh2YWx1ZSk7XG4gIGlmIChzdGFja2VkKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQ7XG4gIH1cbiAgc3RhY2suc2V0KHZhbHVlLCByZXN1bHQpO1xuXG4gIGlmICghaXNBcnIpIHtcbiAgICB2YXIgcHJvcHMgPSBpc0Z1bGwgPyBnZXRBbGxLZXlzKHZhbHVlKSA6IGtleXModmFsdWUpO1xuICB9XG4gIC8vIFJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gIGFycmF5RWFjaChwcm9wcyB8fCB2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3ViVmFsdWU7XG4gICAgICBzdWJWYWx1ZSA9IHZhbHVlW2tleV07XG4gICAgfVxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGlzRGVlcCwgaXNGdWxsLCBjdXN0b21pemVyLCBrZXksIHZhbHVlLCBzdGFjaykpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2xvbmU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGUgVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlQ3JlYXRlKHByb3RvKSB7XG4gIHJldHVybiBpc09iamVjdChwcm90bykgPyBvYmplY3RDcmVhdGUocHJvdG8pIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNyZWF0ZTtcbiIsInZhciBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5nZXRgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVmYXVsdCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXQob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG5cbiAgdmFyIGluZGV4ID0gMCxcbiAgICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuXG4gIHdoaWxlIChvYmplY3QgIT0gbnVsbCAmJiBpbmRleCA8IGxlbmd0aCkge1xuICAgIG9iamVjdCA9IG9iamVjdFt0b0tleShwYXRoW2luZGV4KytdKV07XG4gIH1cbiAgcmV0dXJuIChpbmRleCAmJiBpbmRleCA9PSBsZW5ndGgpID8gb2JqZWN0IDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXQ7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRBbGxLZXlzYCBhbmQgYGdldEFsbEtleXNJbmAgd2hpY2ggdXNlc1xuICogYGtleXNGdW5jYCBhbmQgYHN5bWJvbHNGdW5jYCB0byBnZXQgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3ltYm9sc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0Z1bmMsIHN5bWJvbHNGdW5jKSB7XG4gIHZhciByZXN1bHQgPSBrZXlzRnVuYyhvYmplY3QpO1xuICByZXR1cm4gaXNBcnJheShvYmplY3QpXG4gICAgPyByZXN1bHRcbiAgICA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIGdldFByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2dldFByb3RvdHlwZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc2Agd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VIYXMob2JqZWN0LCBrZXkpIHtcbiAgLy8gQXZvaWQgYSBidWcgaW4gSUUgMTAtMTEgd2hlcmUgb2JqZWN0cyB3aXRoIGEgW1tQcm90b3R5cGVdXSBvZiBgbnVsbGAsXG4gIC8vIHRoYXQgYXJlIGNvbXBvc2VkIGVudGlyZWx5IG9mIGluZGV4IHByb3BlcnRpZXMsIHJldHVybiBgZmFsc2VgIGZvclxuICAvLyBgaGFzT3duUHJvcGVydHlgIGNoZWNrcyBvZiB0aGVtLlxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgfHxcbiAgICAodHlwZW9mIG9iamVjdCA9PSAnb2JqZWN0JyAmJiBrZXkgaW4gb2JqZWN0ICYmIGdldFByb3RvdHlwZShvYmplY3QpID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzO1xuIiwidmFyIGluZGV4T2ZOYU4gPSByZXF1aXJlKCcuL19pbmRleE9mTmFOJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgaWYgKHZhbHVlICE9PSB2YWx1ZSkge1xuICAgIHJldHVybiBpbmRleE9mTmFOKGFycmF5LCBmcm9tSW5kZXgpO1xuICB9XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG4iLCIvKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IE9iamVjdC5rZXlzO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3Qgc2tpcCB0aGUgY29uc3RydWN0b3JcbiAqIHByb3BlcnR5IG9mIHByb3RvdHlwZXMgb3IgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIHJldHVybiBuYXRpdmVLZXlzKE9iamVjdChvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBSZWZsZWN0ID0gcmVxdWlyZSgnLi9fUmVmbGVjdCcpLFxuICAgIGl0ZXJhdG9yVG9BcnJheSA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9yVG9BcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBlbnVtZXJhdGUgPSBSZWZsZWN0ID8gUmVmbGVjdC5lbnVtZXJhdGUgOiB1bmRlZmluZWQsXG4gICAgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3Qgc2tpcCB0aGUgY29uc3RydWN0b3JcbiAqIHByb3BlcnR5IG9mIHByb3RvdHlwZXMgb3IgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgb2JqZWN0ID0gb2JqZWN0ID09IG51bGwgPyBvYmplY3QgOiBPYmplY3Qob2JqZWN0KTtcblxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEZhbGxiYWNrIGZvciBJRSA8IDkgd2l0aCBlczYtc2hpbS5cbmlmIChlbnVtZXJhdGUgJiYgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoeyAndmFsdWVPZic6IDEgfSwgJ3ZhbHVlT2YnKSkge1xuICBiYXNlS2V5c0luID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIGl0ZXJhdG9yVG9BcnJheShlbnVtZXJhdGUob2JqZWN0KSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXNJbjtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduTWVyZ2VWYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnbk1lcmdlVmFsdWUnKSxcbiAgICBiYXNlTWVyZ2VEZWVwID0gcmVxdWlyZSgnLi9fYmFzZU1lcmdlRGVlcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzcmNJbmRleCBUaGUgaW5kZXggb2YgYHNvdXJjZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnZWQgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2UgdmFsdWVzIGFuZCB0aGVpciBtZXJnZWRcbiAqICBjb3VudGVycGFydHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmIChvYmplY3QgPT09IHNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIShpc0FycmF5KHNvdXJjZSkgfHwgaXNUeXBlZEFycmF5KHNvdXJjZSkpKSB7XG4gICAgdmFyIHByb3BzID0ga2V5c0luKHNvdXJjZSk7XG4gIH1cbiAgYXJyYXlFYWNoKHByb3BzIHx8IHNvdXJjZSwgZnVuY3Rpb24oc3JjVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3JjVmFsdWU7XG4gICAgICBzcmNWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNPYmplY3Qoc3JjVmFsdWUpKSB7XG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgYmFzZU1lcmdlLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgICA/IGN1c3RvbWl6ZXIob2JqZWN0W2tleV0sIHNyY1ZhbHVlLCAoa2V5ICsgJycpLCBvYmplY3QsIHNvdXJjZSwgc3RhY2spXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdWYWx1ZSA9IHNyY1ZhbHVlO1xuICAgICAgfVxuICAgICAgYXNzaWduTWVyZ2VWYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlO1xuIiwidmFyIGFzc2lnbk1lcmdlVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25NZXJnZVZhbHVlJyksXG4gICAgYmFzZUNsb25lID0gcmVxdWlyZSgnLi9fYmFzZUNsb25lJyksXG4gICAgY29weUFycmF5ID0gcmVxdWlyZSgnLi9fY29weUFycmF5JyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi9pc1BsYWluT2JqZWN0JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKSxcbiAgICB0b1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi90b1BsYWluT2JqZWN0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlTWVyZ2VgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgbWVyZ2VzIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIG1lcmdlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gc3JjSW5kZXggVGhlIGluZGV4IG9mIGBzb3VyY2VgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGdW5jIFRoZSBmdW5jdGlvbiB0byBtZXJnZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZU1lcmdlRGVlcChvYmplY3QsIHNvdXJjZSwga2V5LCBzcmNJbmRleCwgbWVyZ2VGdW5jLCBjdXN0b21pemVyLCBzdGFjaykge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgIHNyY1ZhbHVlID0gc291cmNlW2tleV0sXG4gICAgICBzdGFja2VkID0gc3RhY2suZ2V0KHNyY1ZhbHVlKTtcblxuICBpZiAoc3RhY2tlZCkge1xuICAgIGFzc2lnbk1lcmdlVmFsdWUob2JqZWN0LCBrZXksIHN0YWNrZWQpO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3VmFsdWUgPSBjdXN0b21pemVyXG4gICAgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwgKGtleSArICcnKSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIHZhciBpc0NvbW1vbiA9IG5ld1ZhbHVlID09PSB1bmRlZmluZWQ7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgbmV3VmFsdWUgPSBzcmNWYWx1ZTtcbiAgICBpZiAoaXNBcnJheShzcmNWYWx1ZSkgfHwgaXNUeXBlZEFycmF5KHNyY1ZhbHVlKSkge1xuICAgICAgaWYgKGlzQXJyYXkob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc0FycmF5TGlrZU9iamVjdChvYmpWYWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBjb3B5QXJyYXkob2JqVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlzQ29tbW9uID0gZmFsc2U7XG4gICAgICAgIG5ld1ZhbHVlID0gYmFzZUNsb25lKHNyY1ZhbHVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChzcmNWYWx1ZSkgfHwgaXNBcmd1bWVudHMoc3JjVmFsdWUpKSB7XG4gICAgICBpZiAoaXNBcmd1bWVudHMob2JqVmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdG9QbGFpbk9iamVjdChvYmpWYWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghaXNPYmplY3Qob2JqVmFsdWUpIHx8IChzcmNJbmRleCAmJiBpc0Z1bmN0aW9uKG9ialZhbHVlKSkpIHtcbiAgICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICAgICAgbmV3VmFsdWUgPSBiYXNlQ2xvbmUoc3JjVmFsdWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5ld1ZhbHVlID0gb2JqVmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaXNDb21tb24gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2suc2V0KHNyY1ZhbHVlLCBuZXdWYWx1ZSk7XG5cbiAgaWYgKGlzQ29tbW9uKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgbWVyZ2VGdW5jKG5ld1ZhbHVlLCBzcmNWYWx1ZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgfVxuICBzdGFja1snZGVsZXRlJ10oc3JjVmFsdWUpO1xuICBhc3NpZ25NZXJnZVZhbHVlKG9iamVjdCwga2V5LCBuZXdWYWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlRGVlcDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBwYXRoIGNyZWF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNldChvYmplY3QsIHBhdGgsIHZhbHVlLCBjdXN0b21pemVyKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDEsXG4gICAgICBuZXN0ZWQgPSBvYmplY3Q7XG5cbiAgd2hpbGUgKG5lc3RlZCAhPSBudWxsICYmICsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gdG9LZXkocGF0aFtpbmRleF0pO1xuICAgIGlmIChpc09iamVjdChuZXN0ZWQpKSB7XG4gICAgICB2YXIgbmV3VmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmIChpbmRleCAhPSBsYXN0SW5kZXgpIHtcbiAgICAgICAgdmFyIG9ialZhbHVlID0gbmVzdGVkW2tleV07XG4gICAgICAgIG5ld1ZhbHVlID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIGtleSwgbmVzdGVkKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IG9ialZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gKGlzSW5kZXgocGF0aFtpbmRleCArIDFdKSA/IFtdIDoge30pXG4gICAgICAgICAgICA6IG9ialZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhc3NpZ25WYWx1ZShuZXN0ZWQsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgICBuZXN0ZWQgPSBuZXN0ZWRba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXQ7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNsaWNlYCB3aXRob3V0IGFuIGl0ZXJhdGVlIGNhbGwgZ3VhcmQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzbGljZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gLXN0YXJ0ID4gbGVuZ3RoID8gMCA6IChsZW5ndGggKyBzdGFydCk7XG4gIH1cbiAgZW5kID0gZW5kID4gbGVuZ3RoID8gbGVuZ3RoIDogZW5kO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgbGVuZ3RoID0gc3RhcnQgPiBlbmQgPyAwIDogKChlbmQgLSBzdGFydCkgPj4+IDApO1xuICBzdGFydCA+Pj49IDA7XG5cbiAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W2luZGV4ICsgc3RhcnRdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNsaWNlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1N0cmluZztcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlKSB7XG4gIHJldHVybiBpc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogc3RyaW5nVG9QYXRoKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsInZhciBiYXNlU2xpY2UgPSByZXF1aXJlKCcuL19iYXNlU2xpY2UnKTtcblxuLyoqXG4gKiBDYXN0cyBgYXJyYXlgIHRvIGEgc2xpY2UgaWYgaXQncyBuZWVkZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBzbGljZS5cbiAqL1xuZnVuY3Rpb24gY2FzdFNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogZW5kO1xuICByZXR1cm4gKCFzdGFydCAmJiBlbmQgPj0gbGVuZ3RoKSA/IGFycmF5IDogYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0U2xpY2U7XG4iLCJ2YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpO1xuXG4vKipcbiAqIFVzZWQgYnkgYF8udHJpbWAgYW5kIGBfLnRyaW1FbmRgIHRvIGdldCB0aGUgaW5kZXggb2YgdGhlIGxhc3Qgc3RyaW5nIHN5bWJvbFxuICogdGhhdCBpcyBub3QgZm91bmQgaW4gdGhlIGNoYXJhY3RlciBzeW1ib2xzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzdHJTeW1ib2xzIFRoZSBzdHJpbmcgc3ltYm9scyB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtBcnJheX0gY2hyU3ltYm9scyBUaGUgY2hhcmFjdGVyIHN5bWJvbHMgdG8gZmluZC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IHVubWF0Y2hlZCBzdHJpbmcgc3ltYm9sLlxuICovXG5mdW5jdGlvbiBjaGFyc0VuZEluZGV4KHN0clN5bWJvbHMsIGNoclN5bWJvbHMpIHtcbiAgdmFyIGluZGV4ID0gc3RyU3ltYm9scy5sZW5ndGg7XG5cbiAgd2hpbGUgKGluZGV4LS0gJiYgYmFzZUluZGV4T2YoY2hyU3ltYm9scywgc3RyU3ltYm9sc1tpbmRleF0sIDApID4gLTEpIHt9XG4gIHJldHVybiBpbmRleDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGFyc0VuZEluZGV4O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGdsb2JhbCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge251bGx8T2JqZWN0fSBSZXR1cm5zIGB2YWx1ZWAgaWYgaXQncyBhIGdsb2JhbCBvYmplY3QsIGVsc2UgYG51bGxgLlxuICovXG5mdW5jdGlvbiBjaGVja0dsb2JhbCh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHZhbHVlLk9iamVjdCA9PT0gT2JqZWN0KSA/IHZhbHVlIDogbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja0dsb2JhbDtcbiIsInZhciBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgYXJyYXlCdWZmZXJgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhcnJheUJ1ZmZlciBUaGUgYXJyYXkgYnVmZmVyIHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5QnVmZmVyfSBSZXR1cm5zIHRoZSBjbG9uZWQgYXJyYXkgYnVmZmVyLlxuICovXG5mdW5jdGlvbiBjbG9uZUFycmF5QnVmZmVyKGFycmF5QnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgYXJyYXlCdWZmZXIuY29uc3RydWN0b3IoYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gIG5ldyBVaW50OEFycmF5KHJlc3VsdCkuc2V0KG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVBcnJheUJ1ZmZlcjtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IG5ldyBidWZmZXIuY29uc3RydWN0b3IoYnVmZmVyLmxlbmd0aCk7XG4gIGJ1ZmZlci5jb3B5KHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVCdWZmZXI7XG4iLCJ2YXIgY2xvbmVBcnJheUJ1ZmZlciA9IHJlcXVpcmUoJy4vX2Nsb25lQXJyYXlCdWZmZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGRhdGFWaWV3YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFWaWV3IFRoZSBkYXRhIHZpZXcgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXBdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIGRhdGEgdmlldy5cbiAqL1xuZnVuY3Rpb24gY2xvbmVEYXRhVmlldyhkYXRhVmlldywgaXNEZWVwKSB7XG4gIHZhciBidWZmZXIgPSBpc0RlZXAgPyBjbG9uZUFycmF5QnVmZmVyKGRhdGFWaWV3LmJ1ZmZlcikgOiBkYXRhVmlldy5idWZmZXI7XG4gIHJldHVybiBuZXcgZGF0YVZpZXcuY29uc3RydWN0b3IoYnVmZmVyLCBkYXRhVmlldy5ieXRlT2Zmc2V0LCBkYXRhVmlldy5ieXRlTGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURhdGFWaWV3O1xuIiwidmFyIGFkZE1hcEVudHJ5ID0gcmVxdWlyZSgnLi9fYWRkTWFwRW50cnknKSxcbiAgICBhcnJheVJlZHVjZSA9IHJlcXVpcmUoJy4vX2FycmF5UmVkdWNlJyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBtYXAuXG4gKi9cbmZ1bmN0aW9uIGNsb25lTWFwKG1hcCwgaXNEZWVwLCBjbG9uZUZ1bmMpIHtcbiAgdmFyIGFycmF5ID0gaXNEZWVwID8gY2xvbmVGdW5jKG1hcFRvQXJyYXkobWFwKSwgdHJ1ZSkgOiBtYXBUb0FycmF5KG1hcCk7XG4gIHJldHVybiBhcnJheVJlZHVjZShhcnJheSwgYWRkTWFwRW50cnksIG5ldyBtYXAuY29uc3RydWN0b3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lTWFwO1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgZmxhZ3MgZnJvbSB0aGVpciBjb2VyY2VkIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGByZWdleHBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcmVnZXhwIFRoZSByZWdleHAgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgcmVnZXhwLlxuICovXG5mdW5jdGlvbiBjbG9uZVJlZ0V4cChyZWdleHApIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyByZWdleHAuY29uc3RydWN0b3IocmVnZXhwLnNvdXJjZSwgcmVGbGFncy5leGVjKHJlZ2V4cCkpO1xuICByZXN1bHQubGFzdEluZGV4ID0gcmVnZXhwLmxhc3RJbmRleDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVJlZ0V4cDtcbiIsInZhciBhZGRTZXRFbnRyeSA9IHJlcXVpcmUoJy4vX2FkZFNldEVudHJ5JyksXG4gICAgYXJyYXlSZWR1Y2UgPSByZXF1aXJlKCcuL19hcnJheVJlZHVjZScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBzZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9uZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lIHZhbHVlcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc2V0LlxuICovXG5mdW5jdGlvbiBjbG9uZVNldChzZXQsIGlzRGVlcCwgY2xvbmVGdW5jKSB7XG4gIHZhciBhcnJheSA9IGlzRGVlcCA/IGNsb25lRnVuYyhzZXRUb0FycmF5KHNldCksIHRydWUpIDogc2V0VG9BcnJheShzZXQpO1xuICByZXR1cm4gYXJyYXlSZWR1Y2UoYXJyYXksIGFkZFNldEVudHJ5LCBuZXcgc2V0LmNvbnN0cnVjdG9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVNldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBgc3ltYm9sYCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeW1ib2wgVGhlIHN5bWJvbCBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgc3ltYm9sIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2xvbmVTeW1ib2woc3ltYm9sKSB7XG4gIHJldHVybiBzeW1ib2xWYWx1ZU9mID8gT2JqZWN0KHN5bWJvbFZhbHVlT2YuY2FsbChzeW1ib2wpKSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lU3ltYm9sO1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGB0eXBlZEFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHR5cGVkQXJyYXkgVGhlIHR5cGVkIGFycmF5IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCB0eXBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2xvbmVUeXBlZEFycmF5KHR5cGVkQXJyYXksIGlzRGVlcCkge1xuICB2YXIgYnVmZmVyID0gaXNEZWVwID8gY2xvbmVBcnJheUJ1ZmZlcih0eXBlZEFycmF5LmJ1ZmZlcikgOiB0eXBlZEFycmF5LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyB0eXBlZEFycmF5LmNvbnN0cnVjdG9yKGJ1ZmZlciwgdHlwZWRBcnJheS5ieXRlT2Zmc2V0LCB0eXBlZEFycmF5Lmxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBvZiBgc291cmNlYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBzb3VyY2UgVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIGZyb20uXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyB0by5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBjb3B5QXJyYXkoc291cmNlLCBhcnJheSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG5cbiAgYXJyYXkgfHwgKGFycmF5ID0gQXJyYXkobGVuZ3RoKSk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbaW5kZXhdID0gc291cmNlW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weUFycmF5O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKTtcblxuLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IGlkZW50aWZpZXJzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb3BpZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weU9iamVjdChzb3VyY2UsIHByb3BzLCBvYmplY3QsIGN1c3RvbWl6ZXIpIHtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuXG4gICAgdmFyIG5ld1ZhbHVlID0gY3VzdG9taXplclxuICAgICAgPyBjdXN0b21pemVyKG9iamVjdFtrZXldLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSlcbiAgICAgIDogc291cmNlW2tleV07XG5cbiAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weU9iamVjdDtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyk7XG5cbi8qKlxuICogQ29waWVzIG93biBzeW1ib2wgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCJ2YXIgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuL19pc0l0ZXJhdGVlQ2FsbCcpLFxuICAgIHJlc3QgPSByZXF1aXJlKCcuL3Jlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5hc3NpZ25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhc3NpZ25lciBUaGUgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFzc2lnbmVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVBc3NpZ25lcihhc3NpZ25lcikge1xuICByZXR1cm4gcmVzdChmdW5jdGlvbihvYmplY3QsIHNvdXJjZXMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gc291cmNlcy5sZW5ndGgsXG4gICAgICAgIGN1c3RvbWl6ZXIgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZ3VhcmQgPSBsZW5ndGggPiAyID8gc291cmNlc1syXSA6IHVuZGVmaW5lZDtcblxuICAgIGN1c3RvbWl6ZXIgPSB0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nXG4gICAgICA/IChsZW5ndGgtLSwgY3VzdG9taXplcilcbiAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGluZGV4LCBjdXN0b21pemVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQXNzaWduZXI7XG4iLCJ2YXIgYmFzZUdldEFsbEtleXMgPSByZXF1aXJlKCcuL19iYXNlR2V0QWxsS2V5cycpLFxuICAgIGdldFN5bWJvbHMgPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXM7XG4iLCJ2YXIgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGFcbiAqIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKSB0aGF0IGFmZmVjdHNcbiAqIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcbiIsInZhciBpc05hdGl2ZSA9IHJlcXVpcmUoJy4vaXNOYXRpdmUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICByZXR1cm4gaXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwiLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcblxuLyoqXG4gKiBHZXRzIHRoZSBgW1tQcm90b3R5cGVdXWAgb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7bnVsbHxPYmplY3R9IFJldHVybnMgdGhlIGBbW1Byb3RvdHlwZV1dYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJvdG90eXBlKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVHZXRQcm90b3R5cGUoT2JqZWN0KHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvdG90eXBlO1xuIiwiLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2wgcHJvcGVydGllcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRTeW1ib2xzKG9iamVjdCkge1xuICAvLyBDb2VyY2UgYG9iamVjdGAgdG8gYW4gb2JqZWN0IHRvIGF2b2lkIG5vbi1vYmplY3QgZXJyb3JzIGluIFY4LlxuICAvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzQ0MyBmb3IgbW9yZSBkZXRhaWxzLlxuICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzKE9iamVjdChvYmplY3QpKTtcbn1cblxuLy8gRmFsbGJhY2sgZm9yIElFIDwgMTEuXG5pZiAoIWdldE93blByb3BlcnR5U3ltYm9scykge1xuICBnZXRTeW1ib2xzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFN5bWJvbHM7XG4iLCJ2YXIgRGF0YVZpZXcgPSByZXF1aXJlKCcuL19EYXRhVmlldycpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIFByb21pc2UgPSByZXF1aXJlKCcuL19Qcm9taXNlJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFRhZyh2YWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExLFxuLy8gZm9yIGRhdGEgdmlld3MgaW4gRWRnZSwgYW5kIHByb21pc2VzIGluIE5vZGUuanMuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUYWc7XG4iLCJ2YXIgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoaGFzaCwga2V5KSB7XG4gIHJldHVybiBoYXNoSGFzKGhhc2gsIGtleSkgJiYgZGVsZXRlIGhhc2hba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoRGVsZXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoaGFzaCwga2V5KSB7XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gaGFzaFtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGhhc2gsIGtleSkgPyBoYXNoW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEdldDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoaGFzaCwga2V5KSB7XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyBoYXNoW2tleV0gIT09IHVuZGVmaW5lZCA6IGhhc093blByb3BlcnR5LmNhbGwoaGFzaCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChoYXNoLCBrZXksIHZhbHVlKSB7XG4gIGhhc2hba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hTZXQ7XG4iLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzU3RyaW5nID0gcmVxdWlyZSgnLi9pc1N0cmluZycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgaW5kZXgga2V5cyBmb3IgYG9iamVjdGAgdmFsdWVzIG9mIGFycmF5cyxcbiAqIGBhcmd1bWVudHNgIG9iamVjdHMsIGFuZCBzdHJpbmdzLCBvdGhlcndpc2UgYG51bGxgIGlzIHJldHVybmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl8bnVsbH0gUmV0dXJucyBpbmRleCBrZXlzLCBlbHNlIGBudWxsYC5cbiAqL1xuZnVuY3Rpb24gaW5kZXhLZXlzKG9iamVjdCkge1xuICB2YXIgbGVuZ3RoID0gb2JqZWN0ID8gb2JqZWN0Lmxlbmd0aCA6IHVuZGVmaW5lZDtcbiAgaWYgKGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNTdHJpbmcob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKSkge1xuICAgIHJldHVybiBiYXNlVGltZXMobGVuZ3RoLCBTdHJpbmcpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluZGV4S2V5cztcbiIsIi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYE5hTmAgaXMgZm91bmQgaW4gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCBgTmFOYCwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBpbmRleE9mTmFOKGFycmF5LCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMCA6IC0xKTtcblxuICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgIHZhciBvdGhlciA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAob3RoZXIgIT09IG90aGVyKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmRleE9mTmFOO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGFycmF5LmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgLy8gQWRkIHByb3BlcnRpZXMgYXNzaWduZWQgYnkgYFJlZ0V4cCNleGVjYC5cbiAgaWYgKGxlbmd0aCAmJiB0eXBlb2YgYXJyYXlbMF0gPT0gJ3N0cmluZycgJiYgaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgJ2luZGV4JykpIHtcbiAgICByZXN1bHQuaW5kZXggPSBhcnJheS5pbmRleDtcbiAgICByZXN1bHQuaW5wdXQgPSBhcnJheS5pbnB1dDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUFycmF5O1xuIiwidmFyIGNsb25lQXJyYXlCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUFycmF5QnVmZmVyJyksXG4gICAgY2xvbmVEYXRhVmlldyA9IHJlcXVpcmUoJy4vX2Nsb25lRGF0YVZpZXcnKSxcbiAgICBjbG9uZU1hcCA9IHJlcXVpcmUoJy4vX2Nsb25lTWFwJyksXG4gICAgY2xvbmVSZWdFeHAgPSByZXF1aXJlKCcuL19jbG9uZVJlZ0V4cCcpLFxuICAgIGNsb25lU2V0ID0gcmVxdWlyZSgnLi9fY2xvbmVTZXQnKSxcbiAgICBjbG9uZVN5bWJvbCA9IHJlcXVpcmUoJy4vX2Nsb25lU3ltYm9sJyksXG4gICAgY2xvbmVUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fY2xvbmVUeXBlZEFycmF5Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZSBiYXNlZCBvbiBpdHMgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNsb25pbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVCeVRhZyhvYmplY3QsIHRhZywgY2xvbmVGdW5jLCBpc0RlZXApIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIHJldHVybiBjbG9uZUFycmF5QnVmZmVyKG9iamVjdCk7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKCtvYmplY3QpO1xuXG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIHJldHVybiBjbG9uZURhdGFWaWV3KG9iamVjdCwgaXNEZWVwKTtcblxuICAgIGNhc2UgZmxvYXQzMlRhZzogY2FzZSBmbG9hdDY0VGFnOlxuICAgIGNhc2UgaW50OFRhZzogY2FzZSBpbnQxNlRhZzogY2FzZSBpbnQzMlRhZzpcbiAgICBjYXNlIHVpbnQ4VGFnOiBjYXNlIHVpbnQ4Q2xhbXBlZFRhZzogY2FzZSB1aW50MTZUYWc6IGNhc2UgdWludDMyVGFnOlxuICAgICAgcmV0dXJuIGNsb25lVHlwZWRBcnJheShvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHJldHVybiBjbG9uZU1hcChvYmplY3QsIGlzRGVlcCwgY2xvbmVGdW5jKTtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVJlZ0V4cChvYmplY3QpO1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTZXQob2JqZWN0LCBpc0RlZXAsIGNsb25lRnVuYyk7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIHJldHVybiBjbG9uZVN5bWJvbChvYmplY3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lQnlUYWc7XG4iLCJ2YXIgYmFzZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX2Jhc2VDcmVhdGUnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBvYmplY3QuY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNQcm90b3R5cGUob2JqZWN0KSlcbiAgICA/IGJhc2VDcmVhdGUoZ2V0UHJvdG90eXBlKG9iamVjdCkpXG4gICAgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QgaW4gSUUgPCA5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNIb3N0T2JqZWN0KHZhbHVlKSB7XG4gIC8vIE1hbnkgaG9zdCBvYmplY3RzIGFyZSBgT2JqZWN0YCBvYmplY3RzIHRoYXQgY2FuIGNvZXJjZSB0byBzdHJpbmdzXG4gIC8vIGRlc3BpdGUgaGF2aW5nIGltcHJvcGVybHkgZGVmaW5lZCBgdG9TdHJpbmdgIG1ldGhvZHMuXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgaWYgKHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nICE9ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gISEodmFsdWUgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSG9zdE9iamVjdDtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJ1xuICAgICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdClcbiAgICAgICkge1xuICAgIHJldHVybiBlcShvYmplY3RbaW5kZXhdLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sXG4gICAgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5KHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8XG4gICAgICB2YWx1ZSA9PSBudWxsIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAob2JqZWN0ICE9IG51bGwgJiYgdmFsdWUgaW4gT2JqZWN0KG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5YWJsZTtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogQ29udmVydHMgYGl0ZXJhdG9yYCB0byBhbiBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGl0ZXJhdG9yIFRoZSBpdGVyYXRvciB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGl0ZXJhdG9yVG9BcnJheShpdGVyYXRvcikge1xuICB2YXIgZGF0YSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICghKGRhdGEgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICByZXN1bHQucHVzaChkYXRhLnZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGl0ZXJhdG9yVG9BcnJheTtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBNYXAgPyBuZXcgTWFwIDogW10sXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2xlYXI7XG4iLCJ2YXIgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgYXNzb2NEZWxldGUgPSByZXF1aXJlKCcuL19hc3NvY0RlbGV0ZScpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgcmV0dXJuIGhhc2hEZWxldGUodHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/IGRhdGEuc3RyaW5nIDogZGF0YS5oYXNoLCBrZXkpO1xuICB9XG4gIHJldHVybiBNYXAgPyBkYXRhLm1hcFsnZGVsZXRlJ10oa2V5KSA6IGFzc29jRGVsZXRlKGRhdGEubWFwLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcERlbGV0ZTtcbiIsInZhciBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBhc3NvY0dldCA9IHJlcXVpcmUoJy4vX2Fzc29jR2V0JyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICByZXR1cm4gaGFzaEdldCh0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2gsIGtleSk7XG4gIH1cbiAgcmV0dXJuIE1hcCA/IGRhdGEubWFwLmdldChrZXkpIDogYXNzb2NHZXQoZGF0YS5tYXAsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwR2V0O1xuIiwidmFyIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIGFzc29jSGFzID0gcmVxdWlyZSgnLi9fYXNzb2NIYXMnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICByZXR1cm4gaGFzaEhhcyh0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2gsIGtleSk7XG4gIH1cbiAgcmV0dXJuIE1hcCA/IGRhdGEubWFwLmhhcyhrZXkpIDogYXNzb2NIYXMoZGF0YS5tYXAsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwSGFzO1xuIiwidmFyIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIGFzc29jU2V0ID0gcmVxdWlyZSgnLi9fYXNzb2NTZXQnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpLFxuICAgIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGlzS2V5YWJsZShrZXkpKSB7XG4gICAgaGFzaFNldCh0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2gsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKE1hcCkge1xuICAgIGRhdGEubWFwLnNldChrZXksIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NvY1NldChkYXRhLm1hcCwga2V5LCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwU2V0O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBhbiBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwVG9BcnJheTtcbiIsInZhciBiYXNlTWVyZ2UgPSByZXF1aXJlKCcuL19iYXNlTWVyZ2UnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLmRlZmF1bHRzRGVlcGAgdG8gY3VzdG9taXplIGl0cyBgXy5tZXJnZWAgdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9ialZhbHVlIFRoZSBkZXN0aW5hdGlvbiB2YWx1ZS5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHNvdXJjZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBwYXJlbnQgb2JqZWN0IG9mIGBvYmpWYWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGBzcmNWYWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSB2YWx1ZXMgYW5kIHRoZWlyIG1lcmdlZFxuICogIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIG1lcmdlRGVmYXVsdHMob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlLCBzdGFjaykge1xuICBpZiAoaXNPYmplY3Qob2JqVmFsdWUpICYmIGlzT2JqZWN0KHNyY1ZhbHVlKSkge1xuICAgIGJhc2VNZXJnZShvYmpWYWx1ZSwgc3JjVmFsdWUsIHVuZGVmaW5lZCwgbWVyZ2VEZWZhdWx0cywgc3RhY2suc2V0KHNyY1ZhbHVlLCBvYmpWYWx1ZSkpO1xuICB9XG4gIHJldHVybiBvYmpWYWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZURlZmF1bHRzO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUNyZWF0ZTtcbiIsInZhciBjaGVja0dsb2JhbCA9IHJlcXVpcmUoJy4vX2NoZWNrR2xvYmFsJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xudmFyIG9iamVjdFR5cGVzID0ge1xuICAnZnVuY3Rpb24nOiB0cnVlLFxuICAnb2JqZWN0JzogdHJ1ZVxufTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IChvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSlcbiAgPyBleHBvcnRzXG4gIDogdW5kZWZpbmVkO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IChvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSlcbiAgPyBtb2R1bGVcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IGNoZWNrR2xvYmFsKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHNlbGZdICYmIHNlbGYpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHdpbmRvd2AuICovXG52YXIgZnJlZVdpbmRvdyA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdyk7XG5cbi8qKiBEZXRlY3QgYHRoaXNgIGFzIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHRoaXNHbG9iYWwgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2YgdGhpc10gJiYgdGhpcyk7XG5cbi8qKlxuICogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC5cbiAqXG4gKiBUaGUgYHRoaXNgIHZhbHVlIGlzIHVzZWQgaWYgaXQncyB0aGUgZ2xvYmFsIG9iamVjdCB0byBhdm9pZCBHcmVhc2Vtb25rZXknc1xuICogcmVzdHJpY3RlZCBgd2luZG93YCBvYmplY3QsIG90aGVyd2lzZSB0aGUgYHdpbmRvd2Agb2JqZWN0IGlzIHVzZWQuXG4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fFxuICAoKGZyZWVXaW5kb3cgIT09ICh0aGlzR2xvYmFsICYmIHRoaXNHbG9iYWwud2luZG93KSkgJiYgZnJlZVdpbmRvdykgfHxcbiAgICBmcmVlU2VsZiB8fCB0aGlzR2xvYmFsIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvQXJyYXk7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSB7ICdhcnJheSc6IFtdLCAnbWFwJzogbnVsbCB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrQ2xlYXI7XG4iLCJ2YXIgYXNzb2NEZWxldGUgPSByZXF1aXJlKCcuL19hc3NvY0RlbGV0ZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgYXJyYXkgPSBkYXRhLmFycmF5O1xuXG4gIHJldHVybiBhcnJheSA/IGFzc29jRGVsZXRlKGFycmF5LCBrZXkpIDogZGF0YS5tYXBbJ2RlbGV0ZSddKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tEZWxldGU7XG4iLCJ2YXIgYXNzb2NHZXQgPSByZXF1aXJlKCcuL19hc3NvY0dldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgYXJyYXkgPSBkYXRhLmFycmF5O1xuXG4gIHJldHVybiBhcnJheSA/IGFzc29jR2V0KGFycmF5LCBrZXkpIDogZGF0YS5tYXAuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tHZXQ7XG4iLCJ2YXIgYXNzb2NIYXMgPSByZXF1aXJlKCcuL19hc3NvY0hhcycpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGFycmF5ID0gZGF0YS5hcnJheTtcblxuICByZXR1cm4gYXJyYXkgPyBhc3NvY0hhcyhhcnJheSwga2V5KSA6IGRhdGEubWFwLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrSGFzO1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKSxcbiAgICBhc3NvY1NldCA9IHJlcXVpcmUoJy4vX2Fzc29jU2V0Jyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgYXJyYXkgPSBkYXRhLmFycmF5O1xuXG4gIGlmIChhcnJheSkge1xuICAgIGlmIChhcnJheS5sZW5ndGggPCAoTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBhc3NvY1NldChhcnJheSwga2V5LCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEuYXJyYXkgPSBudWxsO1xuICAgICAgZGF0YS5tYXAgPSBuZXcgTWFwQ2FjaGUoYXJyYXkpO1xuICAgIH1cbiAgfVxuICB2YXIgbWFwID0gZGF0YS5tYXA7XG4gIGlmIChtYXApIHtcbiAgICBtYXAuc2V0KGtleSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwiLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIGNoYXJhY3RlciBjbGFzc2VzLiAqL1xudmFyIHJzQXN0cmFsUmFuZ2UgPSAnXFxcXHVkODAwLVxcXFx1ZGZmZicsXG4gICAgcnNDb21ib01hcmtzUmFuZ2UgPSAnXFxcXHUwMzAwLVxcXFx1MDM2ZlxcXFx1ZmUyMC1cXFxcdWZlMjMnLFxuICAgIHJzQ29tYm9TeW1ib2xzUmFuZ2UgPSAnXFxcXHUyMGQwLVxcXFx1MjBmMCcsXG4gICAgcnNWYXJSYW5nZSA9ICdcXFxcdWZlMGVcXFxcdWZlMGYnO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2FwdHVyZSBncm91cHMuICovXG52YXIgcnNBc3RyYWwgPSAnWycgKyByc0FzdHJhbFJhbmdlICsgJ10nLFxuICAgIHJzQ29tYm8gPSAnWycgKyByc0NvbWJvTWFya3NSYW5nZSArIHJzQ29tYm9TeW1ib2xzUmFuZ2UgKyAnXScsXG4gICAgcnNGaXR6ID0gJ1xcXFx1ZDgzY1tcXFxcdWRmZmItXFxcXHVkZmZmXScsXG4gICAgcnNNb2RpZmllciA9ICcoPzonICsgcnNDb21ibyArICd8JyArIHJzRml0eiArICcpJyxcbiAgICByc05vbkFzdHJhbCA9ICdbXicgKyByc0FzdHJhbFJhbmdlICsgJ10nLFxuICAgIHJzUmVnaW9uYWwgPSAnKD86XFxcXHVkODNjW1xcXFx1ZGRlNi1cXFxcdWRkZmZdKXsyfScsXG4gICAgcnNTdXJyUGFpciA9ICdbXFxcXHVkODAwLVxcXFx1ZGJmZl1bXFxcXHVkYzAwLVxcXFx1ZGZmZl0nLFxuICAgIHJzWldKID0gJ1xcXFx1MjAwZCc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSByZWdleGVzLiAqL1xudmFyIHJlT3B0TW9kID0gcnNNb2RpZmllciArICc/JyxcbiAgICByc09wdFZhciA9ICdbJyArIHJzVmFyUmFuZ2UgKyAnXT8nLFxuICAgIHJzT3B0Sm9pbiA9ICcoPzonICsgcnNaV0ogKyAnKD86JyArIFtyc05vbkFzdHJhbCwgcnNSZWdpb25hbCwgcnNTdXJyUGFpcl0uam9pbignfCcpICsgJyknICsgcnNPcHRWYXIgKyByZU9wdE1vZCArICcpKicsXG4gICAgcnNTZXEgPSByc09wdFZhciArIHJlT3B0TW9kICsgcnNPcHRKb2luLFxuICAgIHJzU3ltYm9sID0gJyg/OicgKyBbcnNOb25Bc3RyYWwgKyByc0NvbWJvICsgJz8nLCByc0NvbWJvLCByc1JlZ2lvbmFsLCByc1N1cnJQYWlyLCByc0FzdHJhbF0uam9pbignfCcpICsgJyknO1xuXG4vKiogVXNlZCB0byBtYXRjaCBbc3RyaW5nIHN5bWJvbHNdKGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LXVuaWNvZGUpLiAqL1xudmFyIHJlQ29tcGxleFN5bWJvbCA9IFJlZ0V4cChyc0ZpdHogKyAnKD89JyArIHJzRml0eiArICcpfCcgKyByc1N5bWJvbCArIHJzU2VxLCAnZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY29udmVydGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBzdHJpbmdUb0FycmF5KHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLm1hdGNoKHJlQ29tcGxleFN5bWJvbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVG9BcnJheTtcbiIsInZhciBtZW1vaXplID0gcmVxdWlyZSgnLi9tZW1vaXplJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF0vZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IG1lbW9pemUoZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdG9TdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uKG1hdGNoLCBudW1iZXIsIHF1b3RlLCBzdHJpbmcpIHtcbiAgICByZXN1bHQucHVzaChxdW90ZSA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgJyQxJykgOiAobnVtYmVyIHx8IG1hdGNoKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVG9QYXRoO1xuIiwidmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcga2V5IGlmIGl0J3Mgbm90IGEgc3RyaW5nIG9yIHN5bWJvbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtzdHJpbmd8c3ltYm9sfSBSZXR1cm5zIHRoZSBrZXkuXG4gKi9cbmZ1bmN0aW9uIHRvS2V5KHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0tleTtcbiIsIi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKiB2YXIgZ2V0dGVyID0gXy5jb25zdGFudChvYmplY3QpO1xuICpcbiAqIGdldHRlcigpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIG1lcmdlRGVmYXVsdHMgPSByZXF1aXJlKCcuL19tZXJnZURlZmF1bHRzJyksXG4gICAgbWVyZ2VXaXRoID0gcmVxdWlyZSgnLi9tZXJnZVdpdGgnKSxcbiAgICByZXN0ID0gcmVxdWlyZSgnLi9yZXN0Jyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5kZWZhdWx0c2AgZXhjZXB0IHRoYXQgaXQgcmVjdXJzaXZlbHkgYXNzaWduc1xuICogZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4xMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAc2VlIF8uZGVmYXVsdHNcbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZhdWx0c0RlZXAoeyAndXNlcic6IHsgJ25hbWUnOiAnYmFybmV5JyB9IH0sIHsgJ3VzZXInOiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogMzYgfSB9KTtcbiAqIC8vID0+IHsgJ3VzZXInOiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9IH1cbiAqXG4gKi9cbnZhciBkZWZhdWx0c0RlZXAgPSByZXN0KGZ1bmN0aW9uKGFyZ3MpIHtcbiAgYXJncy5wdXNoKHVuZGVmaW5lZCwgbWVyZ2VEZWZhdWx0cyk7XG4gIHJldHVybiBhcHBseShtZXJnZVdpdGgsIHVuZGVmaW5lZCwgYXJncyk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0c0RlZXA7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICogdmFyIG90aGVyID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXE7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIHRoZSByZXNvbHZlZCB2YWx1ZSBpc1xuICogYHVuZGVmaW5lZGAsIHRoZSBgZGVmYXVsdFZhbHVlYCBpcyB1c2VkIGluIGl0cyBwbGFjZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTtcbiAqXG4gKiBfLmdldChvYmplY3QsICdhWzBdLmIuYycpO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsdWUgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuIiwidmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAvLyBTYWZhcmkgOC4xIGluY29ycmVjdGx5IG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICghcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vX2dldExlbmd0aCcpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgoZ2V0TGVuZ3RoKHZhbHVlKSkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZU9iamVjdDtcbiIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBgT2JqZWN0YC4gKi9cbnZhciBvYmplY3RUeXBlcyA9IHtcbiAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgJ29iamVjdCc6IHRydWVcbn07XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSAob2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUpXG4gID8gZXhwb3J0c1xuICA6IHVuZGVmaW5lZDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSAob2JqZWN0VHlwZXNbdHlwZW9mIG1vZHVsZV0gJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUpXG4gID8gbW9kdWxlXG4gIDogdW5kZWZpbmVkO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSAoZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzKVxuICA/IGZyZWVFeHBvcnRzXG4gIDogdW5kZWZpbmVkO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9ICFCdWZmZXIgPyBjb25zdGFudChmYWxzZSkgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBCdWZmZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOCB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgd2VhayBtYXAgY29uc3RydWN0b3JzLFxuICAvLyBhbmQgUGhhbnRvbUpTIDEuOSB3aGljaCByZXR1cm5zICdmdW5jdGlvbicgZm9yIGBOb2RlTGlzdGAgaW5zdGFuY2VzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzSG9zdE9iamVjdCA9IHJlcXVpcmUoJy4vX2lzSG9zdE9iamVjdCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSAoaXNGdW5jdGlvbih2YWx1ZSkgfHwgaXNIb3N0T2JqZWN0KHZhbHVlKSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOYXRpdmU7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBpc0hvc3RPYmplY3QgPSByZXF1aXJlKCcuL19pc0hvc3RPYmplY3QnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGluZmVyIHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3Rvci4gKi9cbnZhciBvYmplY3RDdG9yU3RyaW5nID0gZnVuY1RvU3RyaW5nLmNhbGwoT2JqZWN0KTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIHRoYXQgaXMsIGFuIG9iamVjdCBjcmVhdGVkIGJ5IHRoZVxuICogYE9iamVjdGAgY29uc3RydWN0b3Igb3Igb25lIHdpdGggYSBgW1tQcm90b3R5cGVdXWAgb2YgYG51bGxgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC44LjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChuZXcgRm9vKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdCh7ICd4JzogMCwgJ3knOiAwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgfHxcbiAgICAgIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpICE9IG9iamVjdFRhZyB8fCBpc0hvc3RPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwcm90byA9IGdldFByb3RvdHlwZSh2YWx1ZSk7XG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBDdG9yID0gaGFzT3duUHJvcGVydHkuY2FsbChwcm90bywgJ2NvbnN0cnVjdG9yJykgJiYgcHJvdG8uY29uc3RydWN0b3I7XG4gIHJldHVybiAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJlxuICAgIEN0b3IgaW5zdGFuY2VvZiBDdG9yICYmIGZ1bmNUb1N0cmluZy5jYWxsKEN0b3IpID09IG9iamVjdEN0b3JTdHJpbmcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUGxhaW5PYmplY3Q7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fFxuICAgICghaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcbiIsInZhciBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGluZGV4S2V5cyA9IHJlcXVpcmUoJy4vX2luZGV4S2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KTtcbiAgaWYgKCEoaXNQcm90byB8fCBpc0FycmF5TGlrZShvYmplY3QpKSkge1xuICAgIHJldHVybiBiYXNlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciBpbmRleGVzID0gaW5kZXhLZXlzKG9iamVjdCksXG4gICAgICBza2lwSW5kZXhlcyA9ICEhaW5kZXhlcyxcbiAgICAgIHJlc3VsdCA9IGluZGV4ZXMgfHwgW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoYmFzZUhhcyhvYmplY3QsIGtleSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoa2V5ID09ICdsZW5ndGgnIHx8IGlzSW5kZXgoa2V5LCBsZW5ndGgpKSkgJiZcbiAgICAgICAgIShpc1Byb3RvICYmIGtleSA9PSAnY29uc3RydWN0b3InKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuIiwidmFyIGJhc2VLZXlzSW4gPSByZXF1aXJlKCcuL19iYXNlS2V5c0luJyksXG4gICAgaW5kZXhLZXlzID0gcmVxdWlyZSgnLi9faW5kZXhLZXlzJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IGlzUHJvdG90eXBlKG9iamVjdCksXG4gICAgICBwcm9wcyA9IGJhc2VLZXlzSW4ob2JqZWN0KSxcbiAgICAgIHByb3BzTGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgaW5kZXhlcyA9IGluZGV4S2V5cyhvYmplY3QpLFxuICAgICAgc2tpcEluZGV4ZXMgPSAhIWluZGV4ZXMsXG4gICAgICByZXN1bHQgPSBpbmRleGVzIHx8IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IHByb3BzTGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiAoa2V5ID09ICdsZW5ndGgnIHx8IGlzSW5kZXgoa2V5LCBsZW5ndGgpKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6aW5nIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogMiB9O1xuICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9O1xuICpcbiAqIHZhciB2YWx1ZXMgPSBfLm1lbW9pemUoXy52YWx1ZXMpO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiB2YWx1ZXMob3RoZXIpO1xuICogLy8gPT4gWzMsIDRdXG4gKlxuICogb2JqZWN0LmEgPSAyO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiAvLyBNb2RpZnkgdGhlIHJlc3VsdCBjYWNoZS5cbiAqIHZhbHVlcy5jYWNoZS5zZXQob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWydhJywgJ2InXVxuICpcbiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuXG4gKiBfLm1lbW9pemUuQ2FjaGUgPSBXZWFrTWFwO1xuICovXG5mdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nIHx8IChyZXNvbHZlciAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gQXNzaWduIGNhY2hlIHRvIGBfLm1lbW9pemVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemU7XG4iLCJ2YXIgYmFzZU1lcmdlID0gcmVxdWlyZSgnLi9fYmFzZU1lcmdlJyksXG4gICAgY3JlYXRlQXNzaWduZXIgPSByZXF1aXJlKCcuL19jcmVhdGVBc3NpZ25lcicpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ubWVyZ2VgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYGN1c3RvbWl6ZXJgIHdoaWNoXG4gKiBpcyBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIG1lcmdlZCB2YWx1ZXMgb2YgdGhlIGRlc3RpbmF0aW9uIGFuZCBzb3VyY2VcbiAqIHByb3BlcnRpZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgLCBtZXJnaW5nIGlzIGhhbmRsZWQgYnkgdGhlXG4gKiBtZXRob2QgaW5zdGVhZC4gVGhlIGBjdXN0b21pemVyYCBpcyBpbnZva2VkIHdpdGggc2V2ZW4gYXJndW1lbnRzOlxuICogKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBzb3VyY2VzIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSkge1xuICogICBpZiAoXy5pc0FycmF5KG9ialZhbHVlKSkge1xuICogICAgIHJldHVybiBvYmpWYWx1ZS5jb25jYXQoc3JjVmFsdWUpO1xuICogICB9XG4gKiB9XG4gKlxuICogdmFyIG9iamVjdCA9IHtcbiAqICAgJ2ZydWl0cyc6IFsnYXBwbGUnXSxcbiAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2JlZXQnXVxuICogfTtcbiAqXG4gKiB2YXIgb3RoZXIgPSB7XG4gKiAgICdmcnVpdHMnOiBbJ2JhbmFuYSddLFxuICogICAndmVnZXRhYmxlcyc6IFsnY2Fycm90J11cbiAqIH07XG4gKlxuICogXy5tZXJnZVdpdGgob2JqZWN0LCBvdGhlciwgY3VzdG9taXplcik7XG4gKiAvLyA9PiB7ICdmcnVpdHMnOiBbJ2FwcGxlJywgJ2JhbmFuYSddLCAndmVnZXRhYmxlcyc6IFsnYmVldCcsICdjYXJyb3QnXSB9XG4gKi9cbnZhciBtZXJnZVdpdGggPSBjcmVhdGVBc3NpZ25lcihmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgc3JjSW5kZXgsIGN1c3RvbWl6ZXIpIHtcbiAgYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBzcmNJbmRleCwgY3VzdG9taXplcik7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZVdpdGg7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlXG4gKiBjcmVhdGVkIGZ1bmN0aW9uIGFuZCBhcmd1bWVudHMgZnJvbSBgc3RhcnRgIGFuZCBiZXlvbmQgcHJvdmlkZWQgYXNcbiAqIGFuIGFycmF5LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvbiB0aGVcbiAqIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9tZG4uaW8vcmVzdF9wYXJhbWV0ZXJzKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHNheSA9IF8ucmVzdChmdW5jdGlvbih3aGF0LCBuYW1lcykge1xuICogICByZXR1cm4gd2hhdCArICcgJyArIF8uaW5pdGlhbChuYW1lcykuam9pbignLCAnKSArXG4gKiAgICAgKF8uc2l6ZShuYW1lcykgPiAxID8gJywgJiAnIDogJycpICsgXy5sYXN0KG5hbWVzKTtcbiAqIH0pO1xuICpcbiAqIHNheSgnaGVsbG8nLCAnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcycpO1xuICogLy8gPT4gJ2hlbGxvIGZyZWQsIGJhcm5leSwgJiBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiByZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHRvSW50ZWdlcihzdGFydCksIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHN3aXRjaCAoc3RhcnQpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCBhcnJheSk7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJnc1swXSwgYXJyYXkpO1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFycmF5KTtcbiAgICB9XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgaW5kZXggPSAtMTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSBhcnJheTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXN0O1xuIiwidmFyIGJhc2VTZXQgPSByZXF1aXJlKCcuL19iYXNlU2V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGBvYmplY3RgLiBJZiBhIHBvcnRpb24gb2YgYHBhdGhgIGRvZXNuJ3QgZXhpc3QsXG4gKiBpdCdzIGNyZWF0ZWQuIEFycmF5cyBhcmUgY3JlYXRlZCBmb3IgbWlzc2luZyBpbmRleCBwcm9wZXJ0aWVzIHdoaWxlIG9iamVjdHNcbiAqIGFyZSBjcmVhdGVkIGZvciBhbGwgb3RoZXIgbWlzc2luZyBwcm9wZXJ0aWVzLiBVc2UgYF8uc2V0V2l0aGAgdG8gY3VzdG9taXplXG4gKiBgcGF0aGAgY3JlYXRpb24uXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIG11dGF0ZXMgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjcuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFt7ICdiJzogeyAnYyc6IDMgfSB9XSB9O1xuICpcbiAqIF8uc2V0KG9iamVjdCwgJ2FbMF0uYi5jJywgNCk7XG4gKiBjb25zb2xlLmxvZyhvYmplY3QuYVswXS5iLmMpO1xuICogLy8gPT4gNFxuICpcbiAqIF8uc2V0KG9iamVjdCwgWyd4JywgJzAnLCAneScsICd6J10sIDUpO1xuICogY29uc29sZS5sb2cob2JqZWN0LnhbMF0ueS56KTtcbiAqIC8vID0+IDVcbiAqL1xuZnVuY3Rpb24gc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gb2JqZWN0IDogYmFzZVNldChvYmplY3QsIHBhdGgsIHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXQ7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGludGVnZXIuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvSW50ZWdlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDBcbiAqXG4gKiBfLnRvSW50ZWdlcihJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9JbnRlZ2VyKCczJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwO1xuICB9XG4gIHZhbHVlID0gdG9OdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHtcbiAgICB2YXIgc2lnbiA9ICh2YWx1ZSA8IDAgPyAtMSA6IDEpO1xuICAgIHJldHVybiBzaWduICogTUFYX0lOVEVHRVI7XG4gIH1cbiAgdmFyIHJlbWFpbmRlciA9IHZhbHVlICUgMTtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IChyZW1haW5kZXIgPyB2YWx1ZSAtIHJlbWFpbmRlciA6IHZhbHVlKSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9JbnRlZ2VyO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMycpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSBpc0Z1bmN0aW9uKHZhbHVlLnZhbHVlT2YpID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHBsYWluIG9iamVjdCBmbGF0dGVuaW5nIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN0cmluZ1xuICoga2V5ZWQgcHJvcGVydGllcyBvZiBgdmFsdWVgIHRvIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBwbGFpbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgcGxhaW4gb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmFzc2lnbih7ICdhJzogMSB9LCBuZXcgRm9vKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIgfVxuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIF8udG9QbGFpbk9iamVjdChuZXcgRm9vKSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfVxuICovXG5mdW5jdGlvbiB0b1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBjb3B5T2JqZWN0KHZhbHVlLCBrZXlzSW4odmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1BsYWluT2JqZWN0O1xuIiwidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1N0cmluZztcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKSxcbiAgICBjYXN0U2xpY2UgPSByZXF1aXJlKCcuL19jYXN0U2xpY2UnKSxcbiAgICBjaGFyc0VuZEluZGV4ID0gcmVxdWlyZSgnLi9fY2hhcnNFbmRJbmRleCcpLFxuICAgIHN0cmluZ1RvQXJyYXkgPSByZXF1aXJlKCcuL19zdHJpbmdUb0FycmF5JyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltRW5kID0gL1xccyskLztcblxuLyoqXG4gKiBSZW1vdmVzIHRyYWlsaW5nIHdoaXRlc3BhY2Ugb3Igc3BlY2lmaWVkIGNoYXJhY3RlcnMgZnJvbSBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byB0cmltLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFycz13aGl0ZXNwYWNlXSBUaGUgY2hhcmFjdGVycyB0byB0cmltLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRyaW1FbmQoJyAgYWJjICAnKTtcbiAqIC8vID0+ICcgIGFiYydcbiAqXG4gKiBfLnRyaW1FbmQoJy1fLWFiYy1fLScsICdfLScpO1xuICogLy8gPT4gJy1fLWFiYydcbiAqL1xuZnVuY3Rpb24gdHJpbUVuZChzdHJpbmcsIGNoYXJzLCBndWFyZCkge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICBpZiAoc3RyaW5nICYmIChndWFyZCB8fCBjaGFycyA9PT0gdW5kZWZpbmVkKSkge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShyZVRyaW1FbmQsICcnKTtcbiAgfVxuICBpZiAoIXN0cmluZyB8fCAhKGNoYXJzID0gYmFzZVRvU3RyaW5nKGNoYXJzKSkpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG4gIHZhciBzdHJTeW1ib2xzID0gc3RyaW5nVG9BcnJheShzdHJpbmcpLFxuICAgICAgZW5kID0gY2hhcnNFbmRJbmRleChzdHJTeW1ib2xzLCBzdHJpbmdUb0FycmF5KGNoYXJzKSkgKyAxO1xuXG4gIHJldHVybiBjYXN0U2xpY2Uoc3RyU3ltYm9scywgMCwgZW5kKS5qb2luKCcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmltRW5kO1xuIiwidmFyIHNob3VsZCA9IHJlcXVpcmUoJy4vbGliL3Nob3VsZCcpO1xuXG52YXIgZGVmYXVsdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBkZWZhdWx0UHJvcGVydHkgPSAnc2hvdWxkJztcblxuLy9FeHBvc2UgYXBpIHZpYSBgT2JqZWN0I3Nob3VsZGAuXG50cnkge1xuICB2YXIgcHJldlNob3VsZCA9IHNob3VsZC5leHRlbmQoZGVmYXVsdFByb3BlcnR5LCBkZWZhdWx0UHJvdG8pO1xuICBzaG91bGQuX3ByZXZTaG91bGQgPSBwcmV2U2hvdWxkO1xufSBjYXRjaChlKSB7XG4gIC8vaWdub3JlIGVycm9yc1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZDtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qKlxuICogc2hvdWxkIEFzc2VydGlvbkVycm9yXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGNvbnN0cnVjdG9yXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAc3RhdGljXG4gKi9cbnZhciBBc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdXRpbC5tZXJnZSh0aGlzLCBvcHRpb25zKTtcblxuICBpZiAoIW9wdGlvbnMubWVzc2FnZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX21lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UgPSB0aGlzLmdlbmVyYXRlTWVzc2FnZSgpO1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5zdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgaWYgKHRoaXMuc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gICAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgICB2YXIgZm5fbmFtZSA9IHV0aWwuZnVuY3Rpb25OYW1lKHRoaXMuc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgIC8vIG9uY2Ugd2UgaGF2ZSBsb2NhdGVkIHRoZSBmdW5jdGlvbiBmcmFtZVxuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKG5leHRfbGluZSArIDEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG5cbnZhciBpbmRlbnQgPSAnICAgICc7XG5mdW5jdGlvbiBwcmVwZW5kSW5kZW50KGxpbmUpIHtcbiAgcmV0dXJuIGluZGVudCArIGxpbmU7XG59XG5cbmZ1bmN0aW9uIGluZGVudExpbmVzKHRleHQpIHtcbiAgcmV0dXJuIHRleHQuc3BsaXQoJ1xcbicpLm1hcChwcmVwZW5kSW5kZW50KS5qb2luKCdcXG4nKTtcbn1cblxuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuQXNzZXJ0aW9uRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUsIHtcbiAgbmFtZToge1xuICAgIHZhbHVlOiAnQXNzZXJ0aW9uRXJyb3InXG4gIH0sXG5cbiAgZ2VuZXJhdGVNZXNzYWdlOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLm9wZXJhdG9yICYmIHRoaXMucHJldmlvdXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMubWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHZhciBhY3R1YWwgPSB1dGlsLmZvcm1hdCh0aGlzLmFjdHVhbCk7XG4gICAgICB2YXIgZXhwZWN0ZWQgPSAnZXhwZWN0ZWQnIGluIHRoaXMgPyAnICcgKyB1dGlsLmZvcm1hdCh0aGlzLmV4cGVjdGVkKSA6ICcnO1xuICAgICAgdmFyIGRldGFpbHMgPSAnZGV0YWlscycgaW4gdGhpcyAmJiB0aGlzLmRldGFpbHMgPyAnICgnICsgdGhpcy5kZXRhaWxzICsgJyknIDogJyc7XG5cbiAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMucHJldmlvdXMgPyAnXFxuJyArIGluZGVudExpbmVzKHRoaXMucHJldmlvdXMubWVzc2FnZSkgOiAnJztcblxuICAgICAgcmV0dXJuICdleHBlY3RlZCAnICsgYWN0dWFsICsgKHRoaXMubmVnYXRlID8gJyBub3QgJyA6ICcgJykgKyB0aGlzLm9wZXJhdG9yICsgZXhwZWN0ZWQgKyBkZXRhaWxzICsgcHJldmlvdXM7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3NlcnRpb25FcnJvcjtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciBBc3NlcnRpb25FcnJvciA9IHJlcXVpcmUoJy4vYXNzZXJ0aW9uLWVycm9yJyk7XG5cbi8qKlxuICogc2hvdWxkIEFzc2VydGlvblxuICogQHBhcmFtIHsqfSBvYmogR2l2ZW4gb2JqZWN0IGZvciBhc3NlcnRpb25cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1lbWJlck9mIHNob3VsZFxuICogQHN0YXRpY1xuICovXG5mdW5jdGlvbiBBc3NlcnRpb24ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xuXG4gIHRoaXMuYW55T25lID0gZmFsc2U7XG4gIHRoaXMubmVnYXRlID0gZmFsc2U7XG5cbiAgdGhpcy5wYXJhbXMgPSB7YWN0dWFsOiBvYmp9O1xufVxuXG5Bc3NlcnRpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogQXNzZXJ0aW9uLFxuXG4gIC8qKlxuICAgKiBCYXNlIG1ldGhvZCBmb3IgYXNzZXJ0aW9ucy5cbiAgICpcbiAgICogQmVmb3JlIGNhbGxpbmcgdGhpcyBtZXRob2QgbmVlZCB0byBmaWxsIEFzc2VydGlvbiNwYXJhbXMgb2JqZWN0LiBUaGlzIG1ldGhvZCB1c3VhbGx5IGNhbGxlZCBmcm9tIG90aGVyIGFzc2VydGlvbiBtZXRob2RzLlxuICAgKiBgQXNzZXJ0aW9uI3BhcmFtc2AgY2FuIGNvbnRhaW4gc3VjaCBwcm9wZXJ0aWVzOlxuICAgKiAqIGBvcGVyYXRvcmAgLSByZXF1aXJlZCBzdHJpbmcgY29udGFpbmluZyBkZXNjcmlwdGlvbiBvZiB0aGlzIGFzc2VydGlvblxuICAgKiAqIGBvYmpgIC0gb3B0aW9uYWwgcmVwbGFjZW1lbnQgZm9yIHRoaXMub2JqLCBpdCB1c2VmdWxsIGlmIHlvdSBwcmVwYXJlIG1vcmUgY2xlYXIgb2JqZWN0IHRoZW4gZ2l2ZW5cbiAgICogKiBgbWVzc2FnZWAgLSBpZiB0aGlzIHByb3BlcnR5IGZpbGxlZCB3aXRoIHN0cmluZyBhbnkgb3RoZXJzIHdpbGwgYmUgaWdub3JlZCBhbmQgdGhpcyBvbmUgdXNlZCBhcyBhc3NlcnRpb24gbWVzc2FnZVxuICAgKiAqIGBleHBlY3RlZGAgLSBhbnkgb2JqZWN0IHVzZWQgd2hlbiB5b3UgbmVlZCB0byBhc3NlcnQgcmVsYXRpb24gYmV0d2VlbiBnaXZlbiBvYmplY3QgYW5kIGV4cGVjdGVkLiBMaWtlIGdpdmVuID09IGV4cGVjdGVkICg9PSBpcyBhIHJlbGF0aW9uKVxuICAgKiAqIGBkZXRhaWxzYCAtIGFkZGl0aW9uYWwgc3RyaW5nIHdpdGggZGV0YWlscyB0byBnZW5lcmF0ZWQgbWVzc2FnZVxuICAgKlxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb25cbiAgICogQHBhcmFtIHsqfSBleHByIEFueSBleHByZXNzaW9uIHRoYXQgd2lsbCBiZSB1c2VkIGFzIGEgY29uZGl0aW9uIGZvciBhc3NlcnRpbmcuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBhID0gbmV3IHNob3VsZC5Bc3NlcnRpb24oNDIpO1xuICAgKlxuICAgKiBhLnBhcmFtcyA9IHtcbiAgICogIG9wZXJhdG9yOiAndG8gYmUgbWFnaWMgbnVtYmVyJyxcbiAgICogfVxuICAgKlxuICAgKiBhLmFzc2VydChmYWxzZSk7XG4gICAqIC8vdGhyb3dzIEFzc2VydGlvbkVycm9yOiBleHBlY3RlZCA0MiB0byBiZSBtYWdpYyBudW1iZXJcbiAgICovXG4gIGFzc2VydDogZnVuY3Rpb24oZXhwcikge1xuICAgIGlmIChleHByKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXM7XG5cbiAgICBpZiAoJ29iaicgaW4gcGFyYW1zICYmICEoJ2FjdHVhbCcgaW4gcGFyYW1zKSkge1xuICAgICAgcGFyYW1zLmFjdHVhbCA9IHBhcmFtcy5vYmo7XG4gICAgfSBlbHNlIGlmICghKCdvYmonIGluIHBhcmFtcykgJiYgISgnYWN0dWFsJyBpbiBwYXJhbXMpKSB7XG4gICAgICBwYXJhbXMuYWN0dWFsID0gdGhpcy5vYmo7XG4gICAgfVxuXG4gICAgcGFyYW1zLnN0YWNrU3RhcnRGdW5jdGlvbiA9IHBhcmFtcy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgdGhpcy5hc3NlcnQ7XG4gICAgcGFyYW1zLm5lZ2F0ZSA9IHRoaXMubmVnYXRlO1xuXG4gICAgcGFyYW1zLmFzc2VydGlvbiA9IHRoaXM7XG5cbiAgICB0aHJvdyBuZXcgQXNzZXJ0aW9uRXJyb3IocGFyYW1zKTtcbiAgfSxcblxuICAvKipcbiAgICogU2hvcnRjdXQgZm9yIGBBc3NlcnRpb24jYXNzZXJ0KGZhbHNlKWAuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvblxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB2YXIgYSA9IG5ldyBzaG91bGQuQXNzZXJ0aW9uKDQyKTtcbiAgICpcbiAgICogYS5wYXJhbXMgPSB7XG4gICAqICBvcGVyYXRvcjogJ3RvIGJlIG1hZ2ljIG51bWJlcicsXG4gICAqIH1cbiAgICpcbiAgICogYS5mYWlsKCk7XG4gICAqIC8vdGhyb3dzIEFzc2VydGlvbkVycm9yOiBleHBlY3RlZCA0MiB0byBiZSBtYWdpYyBudW1iZXJcbiAgICovXG4gIGZhaWw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFzc2VydChmYWxzZSk7XG4gIH1cbn07XG5cblxuXG4vKipcbiAqIEFzc2VydGlvbiB1c2VkIHRvIGRlbGVnYXRlIGNhbGxzIG9mIEFzc2VydGlvbiBtZXRob2RzIGluc2lkZSBvZiBQcm9taXNlLlxuICogSXQgaGFzIGFsbW9zdCBhbGwgbWV0aG9kcyBvZiBBc3NlcnRpb24ucHJvdG90eXBlXG4gKlxuICogQHBhcmFtIHtQcm9taXNlfSBvYmpcbiAqL1xuZnVuY3Rpb24gUHJvbWlzZWRBc3NlcnRpb24oLyogb2JqICovKSB7XG4gIEFzc2VydGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIE1ha2UgUHJvbWlzZWRBc3NlcnRpb24gdG8gbG9vayBsaWtlIHByb21pc2UuIERlbGVnYXRlIHJlc29sdmUgYW5kIHJlamVjdCB0byBnaXZlbiBwcm9taXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuUHJvbWlzZWRBc3NlcnRpb24ucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgcmV0dXJuIHRoaXMub2JqLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbn07XG5cbi8qKlxuICogV2F5IHRvIGV4dGVuZCBBc3NlcnRpb24gZnVuY3Rpb24uIEl0IHVzZXMgc29tZSBsb2dpY1xuICogdG8gZGVmaW5lIG9ubHkgcG9zaXRpdmUgYXNzZXJ0aW9ucyBhbmQgaXRzZWxmIHJ1bGUgd2l0aCBuZWdhdGl2ZSBhc3NlcnRpb24uXG4gKlxuICogQWxsIGFjdGlvbnMgaGFwcGVuIGluIHN1YmNvbnRleHQgYW5kIHRoaXMgbWV0aG9kIHRha2UgY2FyZSBhYm91dCBuZWdhdGlvbi5cbiAqIFBvdGVudGlhbGx5IHdlIGNhbiBhZGQgc29tZSBtb3JlIG1vZGlmaWVycyB0aGF0IGRvZXMgbm90IGRlcGVuZHMgZnJvbSBzdGF0ZSBvZiBhc3NlcnRpb24uXG4gKlxuICogQG1lbWJlck9mIEFzc2VydGlvblxuICogQHN0YXRpY1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiBhc3NlcnRpb24uIEl0IHdpbGwgYmUgdXNlZCBmb3IgZGVmaW5pbmcgbWV0aG9kIG9yIGdldHRlciBvbiBBc3NlcnRpb24ucHJvdG90eXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIEZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgb24gZXhlY3V0aW5nIGFzc2VydGlvblxuICogQGV4YW1wbGVcbiAqXG4gKiBBc3NlcnRpb24uYWRkKCdhc3NldCcsIGZ1bmN0aW9uKCkge1xuICogICAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSBhc3NldCcgfVxuICpcbiAqICAgICAgdGhpcy5vYmouc2hvdWxkLmhhdmUucHJvcGVydHkoJ2lkJykud2hpY2guaXMuYS5OdW1iZXIoKVxuICogICAgICB0aGlzLm9iai5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgncGF0aCcpXG4gKiB9KVxuICovXG5Bc3NlcnRpb24uYWRkID0gZnVuY3Rpb24obmFtZSwgZnVuYykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXNzZXJ0aW9uLnByb3RvdHlwZSwgbmFtZSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gbmV3IEFzc2VydGlvbih0aGlzLm9iaiwgdGhpcywgbmFtZSk7XG4gICAgICBjb250ZXh0LmFueU9uZSA9IHRoaXMuYW55T25lO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNoZWNrIGZvciBmYWlsXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAvLyBuZWdhdGl2ZSBmYWlsXG4gICAgICAgICAgaWYgKHRoaXMubmVnYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm9iaiA9IGNvbnRleHQub2JqO1xuICAgICAgICAgICAgdGhpcy5uZWdhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0ICE9PSBlLmFzc2VydGlvbikge1xuICAgICAgICAgICAgY29udGV4dC5wYXJhbXMucHJldmlvdXMgPSBlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHBvc2l0aXZlIGZhaWxcbiAgICAgICAgICBjb250ZXh0Lm5lZ2F0ZSA9IGZhbHNlO1xuICAgICAgICAgIGNvbnRleHQuZmFpbCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRocm93IGlmIGl0IGlzIGFub3RoZXIgZXhjZXB0aW9uXG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG5cbiAgICAgIC8vIG5lZ2F0aXZlIHBhc3NcbiAgICAgIGlmICh0aGlzLm5lZ2F0ZSkge1xuICAgICAgICBjb250ZXh0Lm5lZ2F0ZSA9IHRydWU7IC8vIGJlY2F1c2UgLmZhaWwgd2lsbCBzZXQgbmVnYXRlXG4gICAgICAgIGNvbnRleHQucGFyYW1zLmRldGFpbHMgPSAnZmFsc2UgbmVnYXRpdmUgZmFpbCc7XG4gICAgICAgIGNvbnRleHQuZmFpbCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBwb3NpdGl2ZSBwYXNzXG4gICAgICBpZiAoIXRoaXMucGFyYW1zLm9wZXJhdG9yKSB7XG4gICAgICAgIHRoaXMucGFyYW1zID0gY29udGV4dC5wYXJhbXM7IC8vIHNob3J0Y3V0XG4gICAgICB9XG4gICAgICB0aGlzLm9iaiA9IGNvbnRleHQub2JqO1xuICAgICAgdGhpcy5uZWdhdGUgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb21pc2VkQXNzZXJ0aW9uLnByb3RvdHlwZSwgbmFtZSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGhpcy5vYmogPSB0aGlzLm9iai50aGVuKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIGFbbmFtZV0uYXBwbHkoYSwgYXJncyk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogQWRkIGNoYWluaW5nIGdldHRlciB0byBBc3NlcnRpb24gbGlrZSAuYSwgLndoaWNoIGV0Y1xuICpcbiAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSAgIG5hbWUgb2YgZ2V0dGVyXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gW29uQ2FsbF0gb3B0aW9uYWwgZnVuY3Rpb24gdG8gY2FsbFxuICovXG5Bc3NlcnRpb24uYWRkQ2hhaW4gPSBmdW5jdGlvbihuYW1lLCBvbkNhbGwpIHtcbiAgb25DYWxsID0gb25DYWxsIHx8IGZ1bmN0aW9uKCkge307XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBc3NlcnRpb24ucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIG9uQ2FsbC5jYWxsKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9taXNlZEFzc2VydGlvbi5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmogPSB0aGlzLm9iai50aGVuKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgcmV0dXJuIGFbbmFtZV07XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFsaWFzIGZvciBzb21lIGBBc3NlcnRpb25gIHByb3BlcnR5XG4gKlxuICogQG1lbWJlck9mIEFzc2VydGlvblxuICogQHN0YXRpY1xuICogQHBhcmFtIHtTdHJpbmd9IGZyb20gTmFtZSBvZiB0byBtYXBcbiAqIEBwYXJhbSB7U3RyaW5nfSB0byBOYW1lIG9mIGFsaWFzXG4gKiBAZXhhbXBsZVxuICpcbiAqIEFzc2VydGlvbi5hbGlhcygndHJ1ZScsICdUcnVlJylcbiAqL1xuQXNzZXJ0aW9uLmFsaWFzID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEFzc2VydGlvbi5wcm90b3R5cGUsIGZyb20pO1xuICBpZiAoIWRlc2MpIHRocm93IG5ldyBFcnJvcignQWxpYXMgJyArIGZyb20gKyAnIC0+ICcgKyB0byArICcgY291bGQgbm90IGJlIGNyZWF0ZWQgYXMgJyArIGZyb20gKyAnIG5vdCBkZWZpbmVkJyk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBc3NlcnRpb24ucHJvdG90eXBlLCB0bywgZGVzYyk7XG5cbiAgdmFyIGRlc2MyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihQcm9taXNlZEFzc2VydGlvbi5wcm90b3R5cGUsIGZyb20pO1xuICBpZiAoZGVzYzIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvbWlzZWRBc3NlcnRpb24ucHJvdG90eXBlLCB0bywgZGVzYzIpO1xuICB9XG59O1xuLyoqXG4gKiBOZWdhdGlvbiBtb2RpZmllci4gQ3VycmVudCBhc3NlcnRpb24gY2hhaW4gYmVjb21lIG5lZ2F0ZWQuIEVhY2ggY2FsbCBpbnZlcnQgbmVnYXRpb24gb24gY3VycmVudCBhc3NlcnRpb24uXG4gKlxuICogQG5hbWUgbm90XG4gKiBAcHJvcGVydHlcbiAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAqIEBjYXRlZ29yeSBhc3NlcnRpb25cbiAqL1xuQXNzZXJ0aW9uLmFkZENoYWluKCdub3QnLCBmdW5jdGlvbigpIHtcbiAgdGhpcy5uZWdhdGUgPSAhdGhpcy5uZWdhdGU7XG59KTtcblxuLyoqXG4gKiBBbnkgbW9kaWZpZXIgLSBpdCBhZmZlY3Qgb24gZXhlY3V0aW9uIG9mIHNlcXVlbmNlZCBhc3NlcnRpb24gdG8gZG8gbm90IGBjaGVjayBhbGxgLCBidXQgYGNoZWNrIGFueSBvZmAuXG4gKlxuICogQG5hbWUgYW55XG4gKiBAcHJvcGVydHlcbiAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAqIEBjYXRlZ29yeSBhc3NlcnRpb25cbiAqL1xuQXNzZXJ0aW9uLmFkZENoYWluKCdhbnknLCBmdW5jdGlvbigpIHtcbiAgdGhpcy5hbnlPbmUgPSB0cnVlO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXNzZXJ0aW9uO1xubW9kdWxlLmV4cG9ydHMuUHJvbWlzZWRBc3NlcnRpb24gPSBQcm9taXNlZEFzc2VydGlvbjtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciBGb3JtYXR0ZXIgPSByZXF1aXJlKCdzaG91bGQtZm9ybWF0JykuRm9ybWF0dGVyO1xuXG52YXIgY29uZmlnID0ge1xuICBjaGVja1Byb3RvRXFsOiBmYWxzZSxcblxuICBnZXRGb3JtYXR0ZXI6IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IEZvcm1hdHRlcihvcHRzIHx8IGNvbmZpZyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xuIiwiLy8gaW1wbGVtZW50IGFzc2VydCBpbnRlcmZhY2UgdXNpbmcgYWxyZWFkeSB3cml0dGVuIHBlYWNlcyBvZiBzaG91bGQuanNcblxuLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHdoZW4gdXNlZCBpbiBub2RlLCB0aGlzIHdpbGwgYWN0dWFsbHkgbG9hZCB0aGUgdXRpbCBtb2R1bGUgd2UgZGVwZW5kIG9uXG4vLyB2ZXJzdXMgbG9hZGluZyB0aGUgYnVpbHRpbiB1dGlsIG1vZHVsZSBhcyBoYXBwZW5zIG90aGVyd2lzZVxuLy8gdGhpcyBpcyBhIGJ1ZyBpbiBub2RlIG1vZHVsZSBsb2FkaW5nIGFzIGZhciBhcyBJIGFtIGNvbmNlcm5lZFxudmFyIEFzc2VydGlvbiA9IHJlcXVpcmUoJy4vLi4vYXNzZXJ0aW9uJyk7XG5cbnZhciBfZGVlcEVxdWFsID0gcmVxdWlyZSgnc2hvdWxkLWVxdWFsJyk7XG5cbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cbi8qKlxuICogTm9kZS5qcyBzdGFuZGFyZCBbYGFzc2VydC5mYWlsYF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2Fzc2VydC5odG1sI2Fzc2VydF9hc3NlcnRfZmFpbF9hY3R1YWxfZXhwZWN0ZWRfbWVzc2FnZV9vcGVyYXRvcikuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSBhY3R1YWwgQWN0dWFsIG9iamVjdFxuICogQHBhcmFtIHsqfSBleHBlY3RlZCBFeHBlY3RlZCBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgZm9yIGFzc2VydGlvblxuICogQHBhcmFtIHtzdHJpbmd9IG9wZXJhdG9yIE9wZXJhdG9yIHRleHRcbiAqL1xuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHZhciBhID0gbmV3IEFzc2VydGlvbihhY3R1YWwpO1xuICBhLnBhcmFtcyA9IHtcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbFxuICB9O1xuXG4gIGEuZmFpbCgpO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cbi8qKlxuICogTm9kZS5qcyBzdGFuZGFyZCBbYGFzc2VydC5va2BdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9hc3NlcnQuaHRtbCNhc3NlcnRfYXNzZXJ0X3ZhbHVlX21lc3NhZ2VfYXNzZXJ0X29rX3ZhbHVlX21lc3NhZ2UpLlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0LmVxdWFsYF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2Fzc2VydC5odG1sI2Fzc2VydF9hc3NlcnRfZXF1YWxfYWN0dWFsX2V4cGVjdGVkX21lc3NhZ2UpLlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7Kn0gYWN0dWFsXG4gKiBAcGFyYW0geyp9IGV4cGVjdGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2VdXG4gKi9cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0Lm5vdEVxdWFsYF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2Fzc2VydC5odG1sI2Fzc2VydF9hc3NlcnRfbm90ZXF1YWxfYWN0dWFsX2V4cGVjdGVkX21lc3NhZ2UpLlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7Kn0gYWN0dWFsXG4gKiBAcGFyYW0geyp9IGV4cGVjdGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2VdXG4gKi9cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcbi8qKlxuICogTm9kZS5qcyBzdGFuZGFyZCBbYGFzc2VydC5kZWVwRXF1YWxgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9kZWVwZXF1YWxfYWN0dWFsX2V4cGVjdGVkX21lc3NhZ2UpLlxuICogQnV0IHVzZXMgc2hvdWxkLmpzIC5lcWwgaW1wbGVtZW50YXRpb24gaW5zdGVhZCBvZiBOb2RlLmpzIG93biBkZWVwRXF1YWwuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7Kn0gYWN0dWFsXG4gKiBAcGFyYW0geyp9IGV4cGVjdGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2VdXG4gKi9cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkucmVzdWx0KSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcbi8qKlxuICogTm9kZS5qcyBzdGFuZGFyZCBbYGFzc2VydC5ub3REZWVwRXF1YWxgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9ub3RkZWVwZXF1YWxfYWN0dWFsX2V4cGVjdGVkX21lc3NhZ2UpLlxuICogQnV0IHVzZXMgc2hvdWxkLmpzIC5lcWwgaW1wbGVtZW50YXRpb24gaW5zdGVhZCBvZiBOb2RlLmpzIG93biBkZWVwRXF1YWwuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7Kn0gYWN0dWFsXG4gKiBAcGFyYW0geyp9IGV4cGVjdGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2VdXG4gKi9cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKS5yZXN1bHQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG4vKipcbiAqIE5vZGUuanMgc3RhbmRhcmQgW2Bhc3NlcnQuc3RyaWN0RXF1YWxgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9zdHJpY3RlcXVhbF9hY3R1YWxfZXhwZWN0ZWRfbWVzc2FnZSkuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSBhY3R1YWxcbiAqIEBwYXJhbSB7Kn0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsYF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2Fzc2VydC5odG1sI2Fzc2VydF9hc3NlcnRfbm90c3RyaWN0ZXF1YWxfYWN0dWFsX2V4cGVjdGVkX21lc3NhZ2UpLlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7Kn0gYWN0dWFsXG4gKiBAcGFyYW0geyp9IGV4cGVjdGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2VdXG4gKi9cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PSAnc3RyaW5nJykge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhY3R1YWwgPSBlO1xuICB9XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKScgOiAnLicpICtcbiAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKCFzaG91bGRUaHJvdyAmJiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJiAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcbi8qKlxuICogTm9kZS5qcyBzdGFuZGFyZCBbYGFzc2VydC50aHJvd3NgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF90aHJvd3NfYmxvY2tfZXJyb3JfbWVzc2FnZSkuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHtGdW5jdGlvbn0gYmxvY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtlcnJvcl1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKC8qYmxvY2ssIGVycm9yLCBtZXNzYWdlKi8pIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbdHJ1ZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0LmRvZXNOb3RUaHJvd2BdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9hc3NlcnQuaHRtbCNhc3NlcnRfYXNzZXJ0X2RvZXNub3R0aHJvd19ibG9ja19tZXNzYWdlKS5cbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYXNzZXJ0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBibG9ja1xuICogQHBhcmFtIHtTdHJpbmd9IFttZXNzYWdlXVxuICovXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oLypibG9jaywgbWVzc2FnZSovKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW2ZhbHNlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0LmlmRXJyb3JgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9pZmVycm9yX3ZhbHVlKS5cbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYXNzZXJ0XG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqL1xuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgaWYgKGVycikge1xuICAgIHRocm93IGVycjtcbiAgfVxufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vX2Fzc2VydCcpO1xudmFyIEFzc2VydGlvbkVycm9yID0gcmVxdWlyZSgnLi4vYXNzZXJ0aW9uLWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkKSB7XG4gIHZhciBpID0gc2hvdWxkLmZvcm1hdDtcblxuICAvKlxuICAgKiBFeHBvc2UgYXNzZXJ0IHRvIHNob3VsZFxuICAgKlxuICAgKiBUaGlzIGFsbG93cyB5b3UgdG8gZG8gdGhpbmdzIGxpa2UgYmVsb3dcbiAgICogd2l0aG91dCByZXF1aXJlKClpbmcgdGhlIGFzc2VydCBtb2R1bGUuXG4gICAqXG4gICAqICAgIHNob3VsZC5lcXVhbChmb28uYmFyLCB1bmRlZmluZWQpO1xuICAgKlxuICAgKi9cbiAgdXRpbC5tZXJnZShzaG91bGQsIGFzc2VydCk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBfb2JqXyBleGlzdHMsIHdpdGggb3B0aW9uYWwgbWVzc2FnZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2Ygc2hvdWxkXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYXNzZXJ0XG4gICAqIEBhbGlhcyBzaG91bGQuZXhpc3RzXG4gICAqIEBwYXJhbSB7Kn0gb2JqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbXNnXVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBzaG91bGQuZXhpc3QoMSk7XG4gICAqIHNob3VsZC5leGlzdChuZXcgRGF0ZSgpKTtcbiAgICovXG4gIHNob3VsZC5leGlzdCA9IHNob3VsZC5leGlzdHMgPSBmdW5jdGlvbihvYmosIG1zZykge1xuICAgIGlmIChudWxsID09IG9iaikge1xuICAgICAgdGhyb3cgbmV3IEFzc2VydGlvbkVycm9yKHtcbiAgICAgICAgbWVzc2FnZTogbXNnIHx8ICgnZXhwZWN0ZWQgJyArIGkob2JqKSArICcgdG8gZXhpc3QnKSwgc3RhY2tTdGFydEZ1bmN0aW9uOiBzaG91bGQuZXhpc3RcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBzaG91bGQubm90ID0ge307XG4gIC8qKlxuICAgKiBBc3NlcnRzIF9vYmpfIGRvZXMgbm90IGV4aXN0LCB3aXRoIG9wdGlvbmFsIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBuYW1lIG5vdC5leGlzdFxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBzaG91bGRcbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAgICogQGFsaWFzIHNob3VsZC5ub3QuZXhpc3RzXG4gICAqIEBwYXJhbSB7Kn0gb2JqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbXNnXVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBzaG91bGQubm90LmV4aXN0KG51bGwpO1xuICAgKiBzaG91bGQubm90LmV4aXN0KHZvaWQgMCk7XG4gICAqL1xuICBzaG91bGQubm90LmV4aXN0ID0gc2hvdWxkLm5vdC5leGlzdHMgPSBmdW5jdGlvbihvYmosIG1zZykge1xuICAgIGlmIChudWxsICE9IG9iaikge1xuICAgICAgdGhyb3cgbmV3IEFzc2VydGlvbkVycm9yKHtcbiAgICAgICAgbWVzc2FnZTogbXNnIHx8ICgnZXhwZWN0ZWQgJyArIGkob2JqKSArICcgdG8gbm90IGV4aXN0JyksIHN0YWNrU3RhcnRGdW5jdGlvbjogc2hvdWxkLm5vdC5leGlzdFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgZXhhY3RseSBgdHJ1ZWAuXG4gICAqXG4gICAqIEBuYW1lIHRydWVcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGJvb2xcbiAgICogQGFsaWFzIEFzc2VydGlvbiNUcnVlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAodHJ1ZSkuc2hvdWxkLmJlLnRydWUoKTtcbiAgICogZmFsc2Uuc2hvdWxkLm5vdC5iZS50cnVlKCk7XG4gICAqXG4gICAqICh7IGE6IDEwfSkuc2hvdWxkLm5vdC5iZS50cnVlKCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCd0cnVlJywgZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHRoaXMuaXMuZXhhY3RseSh0cnVlLCBtZXNzYWdlKTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKCd0cnVlJywgJ1RydWUnKTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBleGFjdGx5IGBmYWxzZWAuXG4gICAqXG4gICAqIEBuYW1lIGZhbHNlXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBib29sXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jRmFsc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IFttZXNzYWdlXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh0cnVlKS5zaG91bGQubm90LmJlLmZhbHNlKCk7XG4gICAqIGZhbHNlLnNob3VsZC5iZS5mYWxzZSgpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnZmFsc2UnLCBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdGhpcy5pcy5leGFjdGx5KGZhbHNlLCBtZXNzYWdlKTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKCdmYWxzZScsICdGYWxzZScpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIHRodXRoeSBhY2NvcmRpbmcgamF2YXNjcmlwdCB0eXBlIGNvbnZlcnNpb25zLlxuICAgKlxuICAgKiBAbmFtZSBva1xuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYm9vbFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAodHJ1ZSkuc2hvdWxkLmJlLm9rKCk7XG4gICAqICcnLnNob3VsZC5ub3QuYmUub2soKTtcbiAgICogc2hvdWxkKG51bGwpLm5vdC5iZS5vaygpO1xuICAgKiBzaG91bGQodm9pZCAwKS5ub3QuYmUub2soKTtcbiAgICpcbiAgICogKDEwKS5zaG91bGQuYmUub2soKTtcbiAgICogKDApLnNob3VsZC5ub3QuYmUub2soKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ29rJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgdHJ1dGh5JyB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmopO1xuICB9KTtcbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNob3VsZCwgQXNzZXJ0aW9uKSB7XG4gIC8qKlxuICAgKiBTaW1wbGUgY2hhaW5pbmcuIEl0IGFjdHVhbGx5IGRvIG5vdGhpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQG5hbWUgYmVcbiAgICogQHByb3BlcnR5IHtzaG91bGQuQXNzZXJ0aW9ufSBiZVxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2FuXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jb2ZcbiAgICogQGFsaWFzIEFzc2VydGlvbiNhXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jYW5kXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jaGF2ZVxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2hhc1xuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI3dpdGhcbiAgICogQGFsaWFzIEFzc2VydGlvbiNpc1xuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI3doaWNoXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jdGhlXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jaXRcbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBjaGFpbmluZ1xuICAgKi9cbiAgWydhbicsICdvZicsICdhJywgJ2FuZCcsICdiZScsICdoYXMnLCAnaGF2ZScsICd3aXRoJywgJ2lzJywgJ3doaWNoJywgJ3RoZScsICdpdCddLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIEFzc2VydGlvbi5hZGRDaGFpbihuYW1lKTtcbiAgfSk7XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgZXFsID0gcmVxdWlyZSgnc2hvdWxkLWVxdWFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAgdmFyIGkgPSBzaG91bGQuZm9ybWF0O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBnaXZlbiBvYmplY3QgY29udGFpbiBzb21ldGhpbmcgdGhhdCBlcXVhbCB0byBgb3RoZXJgLiBJdCB1c2VzIGBzaG91bGQtZXF1YWxgIGZvciBlcXVhbGl0eSBjaGVja3MuXG4gICAqIElmIGdpdmVuIG9iamVjdCBpcyBhcnJheSBpdCBzZWFyY2ggdGhhdCBvbmUgb2YgZWxlbWVudHMgd2FzIGVxdWFsIHRvIGBvdGhlcmAuXG4gICAqIElmIGdpdmVuIG9iamVjdCBpcyBzdHJpbmcgaXQgY2hlY2tzIGlmIGBvdGhlcmAgaXMgYSBzdWJzdHJpbmcgLSBleHBlY3RlZCB0aGF0IGBvdGhlcmAgaXMgYSBzdHJpbmcuXG4gICAqIElmIGdpdmVuIG9iamVjdCBpcyBPYmplY3QgaXQgY2hlY2tzIHRoYXQgYG90aGVyYCBpcyBhIHN1Ym9iamVjdCAtIGV4cGVjdGVkIHRoYXQgYG90aGVyYCBpcyBhIG9iamVjdC5cbiAgICpcbiAgICogQG5hbWUgY29udGFpbkVxbFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gY29udGFpblxuICAgKiBAcGFyYW0geyp9IG90aGVyIE5lc3RlZCBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogWzEsIDIsIDNdLnNob3VsZC5jb250YWluRXFsKDEpO1xuICAgKiBbeyBhOiAxIH0sICdhJywgMTBdLnNob3VsZC5jb250YWluRXFsKHsgYTogMSB9KTtcbiAgICpcbiAgICogJ2FiYycuc2hvdWxkLmNvbnRhaW5FcWwoJ2InKTtcbiAgICogJ2FiMWMnLnNob3VsZC5jb250YWluRXFsKDEpO1xuICAgKlxuICAgKiAoeyBhOiAxMCwgYzogeyBkOiAxMCB9fSkuc2hvdWxkLmNvbnRhaW5FcWwoeyBhOiAxMCB9KTtcbiAgICogKHsgYTogMTAsIGM6IHsgZDogMTAgfX0pLnNob3VsZC5jb250YWluRXFsKHsgYzogeyBkOiAxMCB9fSk7XG4gICAqICh7IGE6IDEwLCBjOiB7IGQ6IDEwIH19KS5zaG91bGQuY29udGFpbkVxbCh7IGI6IDEwIH0pO1xuICAgKiAvLyB0aHJvd3MgQXNzZXJ0aW9uRXJyb3I6IGV4cGVjdGVkIHsgYTogMTAsIGM6IHsgZDogMTAgfSB9IHRvIGNvbnRhaW4geyBiOiAxMCB9XG4gICAqIC8vICAgICAgICAgICAgZXhwZWN0ZWQgeyBhOiAxMCwgYzogeyBkOiAxMCB9IH0gdG8gaGF2ZSBwcm9wZXJ0eSBiXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdjb250YWluRXFsJywgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGNvbnRhaW4gJyArIGkob3RoZXIpfTtcblxuICAgIHRoaXMuaXMubm90Lm51bGwoKS5hbmQubm90LnVuZGVmaW5lZCgpO1xuXG4gICAgdmFyIG9iaiA9IHRoaXMub2JqO1xuXG4gICAgaWYgKHR5cGVvZiBvYmogPT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuYXNzZXJ0KG9iai5pbmRleE9mKFN0cmluZyhvdGhlcikpID49IDApO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc0luZGV4YWJsZShvYmopKSB7XG4gICAgICB0aGlzLmFzc2VydCh1dGlsLnNvbWUob2JqLCBmdW5jdGlvbih2KSB7XG4gICAgICAgIHJldHVybiBlcWwodiwgb3RoZXIpLnJlc3VsdDtcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYXZlLnByb3BlcnRpZXMob3RoZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGdpdmVuIG9iamVjdCBpcyBjb250YWluIGVxdWFsbHkgc3RydWN0dXJlZCBvYmplY3Qgb24gdGhlIHNhbWUgZGVwdGggbGV2ZWwuXG4gICAqIElmIGdpdmVuIG9iamVjdCBpcyBhbiBhcnJheSBhbmQgYG90aGVyYCBpcyBhbiBhcnJheSBpdCBjaGVja3MgdGhhdCB0aGUgZXFsIGVsZW1lbnRzIGlzIGdvaW5nIGluIHRoZSBzYW1lIHNlcXVlbmNlIGluIGdpdmVuIGFycmF5IChyZWN1cnNpdmUpXG4gICAqIElmIGdpdmVuIG9iamVjdCBpcyBhbiBvYmplY3QgaXQgY2hlY2tzIHRoYXQgdGhlIHNhbWUga2V5cyBjb250YWluIGRlZXAgZXF1YWwgdmFsdWVzIChyZWN1cnNpdmUpXG4gICAqIE9uIG90aGVyIGNhc2VzIGl0IHRyeSB0byBjaGVjayB3aXRoIGAuZXFsYFxuICAgKlxuICAgKiBAbmFtZSBjb250YWluRGVlcE9yZGVyZWRcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGNvbnRhaW5cbiAgICogQHBhcmFtIHsqfSBvdGhlciBOZXN0ZWQgb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIFsgMSwgMiwgM10uc2hvdWxkLmNvbnRhaW5EZWVwT3JkZXJlZChbMSwgMl0pO1xuICAgKiBbIDEsIDIsIFsgMSwgMiwgMyBdXS5zaG91bGQuY29udGFpbkRlZXBPcmRlcmVkKFsgMSwgWyAyLCAzIF1dKTtcbiAgICpcbiAgICogKHsgYTogMTAsIGI6IHsgYzogMTAsIGQ6IFsxLCAyLCAzXSB9fSkuc2hvdWxkLmNvbnRhaW5EZWVwT3JkZXJlZCh7YTogMTB9KTtcbiAgICogKHsgYTogMTAsIGI6IHsgYzogMTAsIGQ6IFsxLCAyLCAzXSB9fSkuc2hvdWxkLmNvbnRhaW5EZWVwT3JkZXJlZCh7Yjoge2M6IDEwfX0pO1xuICAgKiAoeyBhOiAxMCwgYjogeyBjOiAxMCwgZDogWzEsIDIsIDNdIH19KS5zaG91bGQuY29udGFpbkRlZXBPcmRlcmVkKHtiOiB7ZDogWzEsIDNdfX0pO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnY29udGFpbkRlZXBPcmRlcmVkJywgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGNvbnRhaW4gJyArIGkob3RoZXIpfTtcblxuICAgIHZhciBvYmogPSB0aGlzLm9iajtcbiAgICBpZiAodHlwZW9mIG9iaiA9PSAnc3RyaW5nJykgey8vIGV4cGVjdCBvdGhlciB0byBiZSBzdHJpbmdcbiAgICAgIHRoaXMuaXMuZXF1YWwoU3RyaW5nKG90aGVyKSk7XG4gICAgfSBlbHNlIGlmICh1dGlsLmlzSW5kZXhhYmxlKG9iaikgJiYgdXRpbC5pc0luZGV4YWJsZShvdGhlcikpIHtcbiAgICAgIGZvciAodmFyIG9iaklkeCA9IDAsIG90aGVySWR4ID0gMCwgb2JqTGVuZ3RoID0gdXRpbC5sZW5ndGgob2JqKSwgb3RoZXJMZW5ndGggPSB1dGlsLmxlbmd0aChvdGhlcik7IG9iaklkeCA8IG9iakxlbmd0aCAmJiBvdGhlcklkeCA8IG90aGVyTGVuZ3RoOyBvYmpJZHgrKykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNob3VsZChvYmpbb2JqSWR4XSkuY29udGFpbkRlZXBPcmRlcmVkKG90aGVyW290aGVySWR4XSk7XG4gICAgICAgICAgb3RoZXJJZHgrKztcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2Ygc2hvdWxkLkFzc2VydGlvbkVycm9yKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFzc2VydChvdGhlcklkeCA9PT0gb3RoZXJMZW5ndGgpO1xuICAgIH0gZWxzZSBpZiAob2JqICE9IG51bGwgJiYgb3RoZXIgIT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09ICdvYmplY3QnICYmIHR5cGVvZiBvdGhlciA9PSAnb2JqZWN0Jykgey8vIG9iamVjdCBjb250YWlucyBvYmplY3QgY2FzZVxuICAgICAgdXRpbC5mb3JFYWNoKG90aGVyLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHNob3VsZChvYmpba2V5XSkuY29udGFpbkRlZXBPcmRlcmVkKHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBpZiBib3RoIG9iamVjdHMgaXMgZW1wdHkgbWVhbnMgd2UgZmluaXNoIHRyYXZlcnNpbmcgLSBhbmQgd2UgbmVlZCB0byBjb21wYXJlIGZvciBoaWRkZW4gdmFsdWVzXG4gICAgICBpZiAodXRpbC5pc0VtcHR5T2JqZWN0KG90aGVyKSkge1xuICAgICAgICB0aGlzLmVxbChvdGhlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXFsKG90aGVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBUaGUgc2FtZSBsaWtlIGBBc3NlcnRpb24jY29udGFpbkRlZXBPcmRlcmVkYCBidXQgYWxsIGNoZWNrcyBvbiBhcnJheXMgd2l0aG91dCBvcmRlci5cbiAgICpcbiAgICogQG5hbWUgY29udGFpbkRlZXBcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGNvbnRhaW5cbiAgICogQHBhcmFtIHsqfSBvdGhlciBOZXN0ZWQgb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIFsgMSwgMiwgM10uc2hvdWxkLmNvbnRhaW5EZWVwKFsyLCAxXSk7XG4gICAqIFsgMSwgMiwgWyAxLCAyLCAzIF1dLnNob3VsZC5jb250YWluRGVlcChbIDEsIFsgMywgMSBdXSk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdjb250YWluRGVlcCcsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBjb250YWluICcgKyBpKG90aGVyKX07XG5cbiAgICB2YXIgb2JqID0gdGhpcy5vYmo7XG4gICAgaWYgKHR5cGVvZiBvYmogPT0gJ3N0cmluZycpIHsvLyBleHBlY3Qgb3RoZXIgdG8gYmUgc3RyaW5nXG4gICAgICB0aGlzLmlzLmVxdWFsKFN0cmluZyhvdGhlcikpO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc0luZGV4YWJsZShvYmopICYmIHV0aWwuaXNJbmRleGFibGUob3RoZXIpKSB7XG4gICAgICB2YXIgdXNlZEtleXMgPSB7fTtcbiAgICAgIHV0aWwuZm9yRWFjaChvdGhlciwgZnVuY3Rpb24ob3RoZXJJdGVtKSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0KHV0aWwuc29tZShvYmosIGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgaWYgKGluZGV4IGluIHVzZWRLZXlzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2hvdWxkKGl0ZW0pLmNvbnRhaW5EZWVwKG90aGVySXRlbSk7XG4gICAgICAgICAgICB1c2VkS2V5c1tpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAob2JqICE9IG51bGwgJiYgb3RoZXIgIT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09ICdvYmplY3QnICYmIHR5cGVvZiBvdGhlciA9PSAnb2JqZWN0Jykgey8vIG9iamVjdCBjb250YWlucyBvYmplY3QgY2FzZVxuICAgICAgdXRpbC5mb3JFYWNoKG90aGVyLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHNob3VsZChvYmpba2V5XSkuY29udGFpbkRlZXAodmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGlmIGJvdGggb2JqZWN0cyBpcyBlbXB0eSBtZWFucyB3ZSBmaW5pc2ggdHJhdmVyc2luZyAtIGFuZCB3ZSBuZWVkIHRvIGNvbXBhcmUgZm9yIGhpZGRlbiB2YWx1ZXNcbiAgICAgIGlmICh1dGlsLmlzRW1wdHlPYmplY3Qob3RoZXIpKSB7XG4gICAgICAgIHRoaXMuZXFsKG90aGVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcWwob3RoZXIpO1xuICAgIH1cbiAgfSk7XG5cbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG52YXIgZXFsID0gcmVxdWlyZSgnc2hvdWxkLWVxdWFsJyk7XG52YXIgdHlwZSA9IHJlcXVpcmUoJ3Nob3VsZC10eXBlJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuZnVuY3Rpb24gZm9ybWF0RXFsUmVzdWx0KHIsIGEsIGIpIHtcbiAgcmV0dXJuICgoci5wYXRoLmxlbmd0aCA+IDAgPyAnYXQgJyArIHIucGF0aC5tYXAodXRpbC5mb3JtYXRQcm9wKS5qb2luKCcgLT4gJykgOiAnJykgK1xuICAoci5hID09PSBhID8gJycgOiAnLCBBIGhhcyAnICsgdXRpbC5mb3JtYXQoci5hKSkgK1xuICAoci5iID09PSBiID8gJycgOiAnIGFuZCBCIGhhcyAnICsgdXRpbC5mb3JtYXQoci5iKSkgK1xuICAoci5zaG93UmVhc29uID8gJyBiZWNhdXNlICcgKyByLnJlYXNvbiA6ICcnKSkudHJpbSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNob3VsZCwgQXNzZXJ0aW9uKSB7XG5cbiAgLyoqXG4gICAqIERlZXAgb2JqZWN0IGVxdWFsaXR5IGNvbXBhcmlzb24uIEZvciBmdWxsIHNwZWMgc2VlIFtgc2hvdWxkLWVxdWFsIHRlc3RzYF0oaHR0cHM6Ly9naXRodWIuY29tL3Nob3VsZGpzL2VxdWFsL2Jsb2IvbWFzdGVyL3Rlc3QuanMpLlxuICAgKlxuICAgKiBAbmFtZSBlcWxcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGVxdWFsaXR5XG4gICAqIEBhbGlhcyBBc3NlcnRpb24jZGVlcEVxdWFsXG4gICAqIEBwYXJhbSB7Kn0gdmFsIEV4cGVjdGVkIHZhbHVlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDEwKS5zaG91bGQuYmUuZXFsKDEwKTtcbiAgICogKCcxMCcpLnNob3VsZC5ub3QuYmUuZXFsKDEwKTtcbiAgICogKC0wKS5zaG91bGQubm90LmJlLmVxbCgrMCk7XG4gICAqXG4gICAqIE5hTi5zaG91bGQuYmUuZXFsKE5hTik7XG4gICAqXG4gICAqICh7IGE6IDEwfSkuc2hvdWxkLmJlLmVxbCh7IGE6IDEwIH0pO1xuICAgKiBbICdhJyBdLnNob3VsZC5ub3QuYmUuZXFsKHsgJzAnOiAnYScgfSk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdlcWwnLCBmdW5jdGlvbih2YWwsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBlcXVhbCcsIGV4cGVjdGVkOiB2YWwsIG1lc3NhZ2U6IGRlc2NyaXB0aW9ufTtcblxuICAgIHZhciByZXN1bHQgPSBlcWwodGhpcy5vYmosIHZhbCwgc2hvdWxkLmNvbmZpZyk7XG4gICAgdGhpcy5wYXJhbXMuZGV0YWlscyA9IHJlc3VsdC5yZXN1bHQgPyAnJyA6IGZvcm1hdEVxbFJlc3VsdChyZXN1bHQsIHRoaXMub2JqLCB2YWwpO1xuXG4gICAgdGhpcy5wYXJhbXMuc2hvd0RpZmYgPSBlcWwodHlwZSh0aGlzLm9iaiksIHR5cGUodmFsKSkucmVzdWx0O1xuXG4gICAgdGhpcy5hc3NlcnQocmVzdWx0LnJlc3VsdCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBFeGFjdCBjb21wYXJpc29uIHVzaW5nID09PS5cbiAgICpcbiAgICogQG5hbWUgZXF1YWxcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGVxdWFsaXR5XG4gICAqIEBhbGlhcyBBc3NlcnRpb24jZXhhY3RseVxuICAgKiBAcGFyYW0geyp9IHZhbCBFeHBlY3RlZCB2YWx1ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIDEwLnNob3VsZC5iZS5lcXVhbCgxMCk7XG4gICAqICdhJy5zaG91bGQuYmUuZXhhY3RseSgnYScpO1xuICAgKlxuICAgKiBzaG91bGQobnVsbCkuYmUuZXhhY3RseShudWxsKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2VxdWFsJywgZnVuY3Rpb24odmFsLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUnLCBleHBlY3RlZDogdmFsLCBtZXNzYWdlOiBkZXNjcmlwdGlvbn07XG5cbiAgICB0aGlzLnBhcmFtcy5zaG93RGlmZiA9IGVxbCh0eXBlKHRoaXMub2JqKSwgdHlwZSh2YWwpKS5yZXN1bHQ7XG5cbiAgICB0aGlzLmFzc2VydCh2YWwgPT09IHRoaXMub2JqKTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKCdlcXVhbCcsICdleGFjdGx5Jyk7XG4gIEFzc2VydGlvbi5hbGlhcygnZXFsJywgJ2RlZXBFcXVhbCcpO1xuXG4gIGZ1bmN0aW9uIGFkZE9uZU9mKG5hbWUsIG1lc3NhZ2UsIG1ldGhvZCkge1xuICAgIEFzc2VydGlvbi5hZGQobmFtZSwgZnVuY3Rpb24odmFscykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgdmFscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaG91bGQodmFscykuYmUuQXJyYXkoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6IG1lc3NhZ2UsIGV4cGVjdGVkOiB2YWxzfTtcblxuICAgICAgdmFyIG9iaiA9IHRoaXMub2JqO1xuICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG5cbiAgICAgIHV0aWwuZm9yRWFjaCh2YWxzLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzaG91bGQodmFsKVttZXRob2RdKG9iaik7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2Ygc2hvdWxkLkFzc2VydGlvbkVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm47Ly9kbyBub3RoaW5nXG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFzc2VydChmb3VuZCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhhY3QgY29tcGFyaXNvbiB1c2luZyA9PT0gdG8gYmUgb25lIG9mIHN1cHBsaWVkIG9iamVjdHMuXG4gICAqXG4gICAqIEBuYW1lIGVxdWFsT25lT2ZcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGVxdWFsaXR5XG4gICAqIEBwYXJhbSB7QXJyYXl8Kn0gdmFscyBFeHBlY3RlZCB2YWx1ZXNcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogJ2FiJy5zaG91bGQuYmUuZXF1YWxPbmVPZignYScsIDEwLCAnYWInKTtcbiAgICogJ2FiJy5zaG91bGQuYmUuZXF1YWxPbmVPZihbJ2EnLCAxMCwgJ2FiJ10pO1xuICAgKi9cbiAgYWRkT25lT2YoJ2VxdWFsT25lT2YnLCAndG8gYmUgZXF1YWxzIG9uZSBvZicsICdlcXVhbCcpO1xuXG4gIC8qKlxuICAgKiBFeGFjdCBjb21wYXJpc29uIHVzaW5nIC5lcWwgdG8gYmUgb25lIG9mIHN1cHBsaWVkIG9iamVjdHMuXG4gICAqXG4gICAqIEBuYW1lIG9uZU9mXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBlcXVhbGl0eVxuICAgKiBAcGFyYW0ge0FycmF5fCp9IHZhbHMgRXhwZWN0ZWQgdmFsdWVzXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7YTogMTB9KS5zaG91bGQuYmUub25lT2YoJ2EnLCAxMCwgJ2FiJywge2E6IDEwfSk7XG4gICAqICh7YTogMTB9KS5zaG91bGQuYmUub25lT2YoWydhJywgMTAsICdhYicsIHthOiAxMH1dKTtcbiAgICovXG4gIGFkZE9uZU9mKCdvbmVPZicsICd0byBiZSBvbmUgb2YnLCAnZXFsJyk7XG5cbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAgdmFyIGkgPSBzaG91bGQuZm9ybWF0O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gZnVuY3Rpb24gdGhyb3dzIGVycm9yIHdpdGggc3VjaCBtZXNzYWdlLlxuICAgKlxuICAgKiBAbmFtZSB0aHJvd1xuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gZXJyb3JzXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jdGhyb3dFcnJvclxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB8RnVuY3Rpb258T2JqZWN0fEdlbmVyYXRvckZ1bmN0aW9ufEdlbmVyYXRvck9iamVjdH0gW21lc3NhZ2VdIE1lc3NhZ2UgdG8gbWF0Y2ggb3IgcHJvcGVydGllc1xuICAgKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdIE9wdGlvbmFsIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIG1hdGNoZWQgdG8gdGhyb3duIGVycm9yXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIChmdW5jdGlvbigpeyB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWwnKSB9KS5zaG91bGQudGhyb3coKTtcbiAgICogKGZ1bmN0aW9uKCl7IHRocm93IG5ldyBFcnJvcignZmFpbCcpIH0pLnNob3VsZC50aHJvdygnZmFpbCcpO1xuICAgKiAoZnVuY3Rpb24oKXsgdGhyb3cgbmV3IEVycm9yKCdmYWlsJykgfSkuc2hvdWxkLnRocm93KC9mYWlsLyk7XG4gICAqXG4gICAqIChmdW5jdGlvbigpeyB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWwnKSB9KS5zaG91bGQudGhyb3coRXJyb3IpO1xuICAgKiB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoKTtcbiAgICogZXJyb3IuYSA9IDEwO1xuICAgKiAoZnVuY3Rpb24oKXsgdGhyb3cgZXJyb3I7IH0pLnNob3VsZC50aHJvdyhFcnJvciwgeyBhOiAxMCB9KTtcbiAgICogKGZ1bmN0aW9uKCl7IHRocm93IGVycm9yOyB9KS5zaG91bGQudGhyb3coeyBhOiAxMCB9KTtcbiAgICogKGZ1bmN0aW9uKigpIHtcbiAgICogICB5aWVsZCB0aHJvd0Vycm9yKCk7XG4gICAqIH0pLnNob3VsZC50aHJvdygpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgndGhyb3cnLCBmdW5jdGlvbihtZXNzYWdlLCBwcm9wZXJ0aWVzKSB7XG4gICAgdmFyIGZuID0gdGhpcy5vYmo7XG4gICAgdmFyIGVyciA9IHt9O1xuICAgIHZhciBlcnJvckluZm8gPSAnJztcbiAgICB2YXIgdGhyb3duID0gZmFsc2U7XG5cbiAgICBpZiAodXRpbC5pc0dlbmVyYXRvckZ1bmN0aW9uKGZuKSkge1xuICAgICAgcmV0dXJuIHNob3VsZChmbigpKS50aHJvdyhtZXNzYWdlLCBwcm9wZXJ0aWVzKTtcbiAgICB9IGVsc2UgaWYgKHV0aWwuaXNHZW5lcmF0b3JPYmplY3QoZm4pKSB7XG4gICAgICByZXR1cm4gc2hvdWxkKGZuLm5leHQuYmluZChmbikpLnRocm93KG1lc3NhZ2UsIHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHRoaXMuaXMuYS5GdW5jdGlvbigpO1xuXG4gICAgdmFyIGVycm9yTWF0Y2hlZCA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgZm4oKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvd24gPSB0cnVlO1xuICAgICAgZXJyID0gZTtcbiAgICB9XG5cbiAgICBpZiAodGhyb3duKSB7XG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIG1lc3NhZ2UpIHtcbiAgICAgICAgICBlcnJvck1hdGNoZWQgPSBtZXNzYWdlID09IGVyci5tZXNzYWdlO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICBlcnJvck1hdGNoZWQgPSBtZXNzYWdlLnRlc3QoZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2UgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIG1lc3NhZ2UpIHtcbiAgICAgICAgICBlcnJvck1hdGNoZWQgPSBlcnIgaW5zdGFuY2VvZiBtZXNzYWdlO1xuICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gbWVzc2FnZSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzaG91bGQoZXJyKS5tYXRjaChtZXNzYWdlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIHNob3VsZC5Bc3NlcnRpb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvckluZm8gPSBcIjogXCIgKyBlLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGVycm9yTWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWVycm9yTWF0Y2hlZCkge1xuICAgICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgbWVzc2FnZSB8fCBtZXNzYWdlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICBlcnJvckluZm8gPSBcIiB3aXRoIGEgbWVzc2FnZSBtYXRjaGluZyBcIiArIGkobWVzc2FnZSkgKyBcIiwgYnV0IGdvdCAnXCIgKyBlcnIubWVzc2FnZSArIFwiJ1wiO1xuICAgICAgICAgIH0gZWxzZSBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgbWVzc2FnZSkge1xuICAgICAgICAgICAgZXJyb3JJbmZvID0gXCIgb2YgdHlwZSBcIiArIHV0aWwuZnVuY3Rpb25OYW1lKG1lc3NhZ2UpICsgXCIsIGJ1dCBnb3QgXCIgKyB1dGlsLmZ1bmN0aW9uTmFtZShlcnIuY29uc3RydWN0b3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBtZXNzYWdlICYmIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2hvdWxkKGVycikubWF0Y2gocHJvcGVydGllcyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JJbmZvID0gXCI6IFwiICsgZS5tZXNzYWdlO1xuICAgICAgICAgICAgICBlcnJvck1hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvckluZm8gPSBcIiAoZ290IFwiICsgaShlcnIpICsgXCIpXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gdGhyb3cgZXhjZXB0aW9uJyArIGVycm9ySW5mbyB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhyb3duKTtcbiAgICB0aGlzLmFzc2VydChlcnJvck1hdGNoZWQpO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ3Rocm93JywgJ3Rocm93RXJyb3InKTtcbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBlcWwgPSByZXF1aXJlKCdzaG91bGQtZXF1YWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQsIEFzc2VydGlvbikge1xuICB2YXIgaSA9IHNob3VsZC5mb3JtYXQ7XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgaWYgZ2l2ZW4gb2JqZWN0IG1hdGNoIGBvdGhlcmAgb2JqZWN0LCB1c2luZyBzb21lIGFzc3VtcHRpb25zOlxuICAgKiBGaXJzdCBvYmplY3QgbWF0Y2hlZCBpZiB0aGV5IGFyZSBlcXVhbCxcbiAgICogSWYgYG90aGVyYCBpcyBhIHJlZ2V4cCBhbmQgZ2l2ZW4gb2JqZWN0IGlzIGEgc3RyaW5nIGNoZWNrIG9uIG1hdGNoaW5nIHdpdGggcmVnZXhwXG4gICAqIElmIGBvdGhlcmAgaXMgYSByZWdleHAgYW5kIGdpdmVuIG9iamVjdCBpcyBhbiBhcnJheSBjaGVjayBpZiBhbGwgZWxlbWVudHMgbWF0Y2hlZCByZWdleHBcbiAgICogSWYgYG90aGVyYCBpcyBhIHJlZ2V4cCBhbmQgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCBjaGVjayB2YWx1ZXMgb24gbWF0Y2hpbmcgcmVnZXhwXG4gICAqIElmIGBvdGhlcmAgaXMgYSBmdW5jdGlvbiBjaGVjayBpZiB0aGlzIGZ1bmN0aW9uIHRocm93cyBBc3NlcnRpb25FcnJvciBvbiBnaXZlbiBvYmplY3Qgb3IgcmV0dXJuIGZhbHNlIC0gaXQgd2lsbCBiZSBhc3N1bWVkIGFzIG5vdCBtYXRjaGVkXG4gICAqIElmIGBvdGhlcmAgaXMgYW4gb2JqZWN0IGNoZWNrIGlmIHRoZSBzYW1lIGtleXMgbWF0Y2hlZCB3aXRoIGFib3ZlIHJ1bGVzXG4gICAqIEFsbCBvdGhlciBjYXNlcyBmYWlsZWQuXG4gICAqXG4gICAqIFVzdWFsbHkgaXQgaXMgcmlnaHQgaWRlYSB0byBhZGQgcHJlIHR5cGUgYXNzZXJ0aW9ucywgbGlrZSBgLlN0cmluZygpYCBvciBgLk9iamVjdCgpYCB0byBiZSBzdXJlIGFzc2VydGlvbnMgd2lsbCBkbyB3aGF0IHlvdSBhcmUgZXhwZWN0aW5nLlxuICAgKiBPYmplY3QgaXRlcmF0aW9uIGhhcHBlbiBieSBrZXlzIChwcm9wZXJ0aWVzIHdpdGggZW51bWVyYWJsZTogdHJ1ZSksIHRodXMgc29tZSBvYmplY3RzIGNhbiBjYXVzZSBzbWFsbCBwYWluLiBUeXBpY2FsIGV4YW1wbGUgaXMganNcbiAgICogRXJyb3IgLSBpdCBieSBkZWZhdWx0IGhhcyAyIHByb3BlcnRpZXMgYG5hbWVgIGFuZCBgbWVzc2FnZWAsIGJ1dCB0aGV5IGJvdGggbm9uLWVudW1lcmFibGUuIEluIHRoaXMgY2FzZSBtYWtlIHN1cmUgeW91IHNwZWNpZnkgY2hlY2tpbmcgcHJvcHMgKHNlZSBleGFtcGxlcykuXG4gICAqXG4gICAqIEBuYW1lIG1hdGNoXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBtYXRjaGluZ1xuICAgKiBAcGFyYW0geyp9IG90aGVyIE9iamVjdCB0byBtYXRjaFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqICdmb29iYXInLnNob3VsZC5tYXRjaCgvXmZvby8pO1xuICAgKiAnZm9vYmFyJy5zaG91bGQubm90Lm1hdGNoKC9eYmFyLyk7XG4gICAqXG4gICAqICh7IGE6ICdmb28nLCBjOiAnYmFyZm9vJyB9KS5zaG91bGQubWF0Y2goL2ZvbyQvKTtcbiAgICpcbiAgICogWydhJywgJ2InLCAnYyddLnNob3VsZC5tYXRjaCgvW2Etel0vKTtcbiAgICpcbiAgICogKDUpLnNob3VsZC5ub3QubWF0Y2goZnVuY3Rpb24obikge1xuICAgKiAgIHJldHVybiBuIDwgMDtcbiAgICogfSk7XG4gICAqICg1KS5zaG91bGQubm90Lm1hdGNoKGZ1bmN0aW9uKGl0KSB7XG4gICAqICAgIGl0LnNob3VsZC5iZS5hbi5BcnJheSgpO1xuICAgKiB9KTtcbiAgICogKHsgYTogMTAsIGI6ICdhYmMnLCBjOiB7IGQ6IDEwIH0sIGQ6IDAgfSkuc2hvdWxkXG4gICAqIC5tYXRjaCh7IGE6IDEwLCBiOiAvYyQvLCBjOiBmdW5jdGlvbihpdCkge1xuICAgKiAgICByZXR1cm4gaXQuc2hvdWxkLmhhdmUucHJvcGVydHkoJ2QnLCAxMCk7XG4gICAqIH19KTtcbiAgICpcbiAgICogWzEwLCAnYWJjJywgeyBkOiAxMCB9LCAwXS5zaG91bGRcbiAgICogLm1hdGNoKHsgJzAnOiAxMCwgJzEnOiAvYyQvLCAnMic6IGZ1bmN0aW9uKGl0KSB7XG4gICAqICAgIHJldHVybiBpdC5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnZCcsIDEwKTtcbiAgICogfX0pO1xuICAgKlxuICAgKiB2YXIgbXlTdHJpbmcgPSAnYWJjJztcbiAgICpcbiAgICogbXlTdHJpbmcuc2hvdWxkLmJlLmEuU3RyaW5nKCkuYW5kLm1hdGNoKC9hYmMvKTtcbiAgICpcbiAgICogbXlTdHJpbmcgPSB7fTtcbiAgICpcbiAgICogbXlTdHJpbmcuc2hvdWxkLm1hdGNoKC9hYmMvKTsgLy95ZXMgdGhpcyB3aWxsIHBhc3NcbiAgICogLy9iZXR0ZXIgdG8gZG9cbiAgICogbXlTdHJpbmcuc2hvdWxkLmJlLmFuLk9iamVjdCgpLmFuZC5ub3QuZW1wdHkoKS5hbmQubWF0Y2goL2FiYy8pOy8vZml4ZWRcbiAgICpcbiAgICogKG5ldyBFcnJvcignYm9vbScpKS5zaG91bGQubWF0Y2goL2FiYy8pOy8vcGFzc2VkIGJlY2F1c2Ugbm8ga2V5c1xuICAgKiAobmV3IEVycm9yKCdib29tJykpLnNob3VsZC5ub3QubWF0Y2goeyBtZXNzYWdlOiAvYWJjLyB9KTsvL2NoZWNrIHNwZWNpZmllZCBwcm9wZXJ0eVxuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnbWF0Y2gnLCBmdW5jdGlvbihvdGhlciwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIG1hdGNoICcgKyBpKG90aGVyKSwgbWVzc2FnZTogZGVzY3JpcHRpb259O1xuXG4gICAgaWYgKCFlcWwodGhpcy5vYmosIG90aGVyKS5yZXN1bHQpIHtcbiAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIFJlZ0V4cCkgeyAvLyBzb21ldGhpbmcgLSByZWdleFxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vYmogPT0gJ3N0cmluZycpIHtcblxuICAgICAgICAgIHRoaXMuYXNzZXJ0KG90aGVyLmV4ZWModGhpcy5vYmopKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzSW5kZXhhYmxlKHRoaXMub2JqKSkge1xuICAgICAgICAgIHV0aWwuZm9yRWFjaCh0aGlzLm9iaiwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5hc3NlcnQob3RoZXIuZXhlYyhpdGVtKSk7Ly8gc2hvdWxkIHdlIHRyeSB0byBjb252ZXJ0IHRvIFN0cmluZyBhbmQgZXhlYz9cbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChudWxsICE9IHRoaXMub2JqICYmIHR5cGVvZiB0aGlzLm9iaiA9PSAnb2JqZWN0Jykge1xuXG4gICAgICAgICAgdmFyIG5vdE1hdGNoZWRQcm9wcyA9IFtdLCBtYXRjaGVkUHJvcHMgPSBbXTtcbiAgICAgICAgICB1dGlsLmZvckVhY2godGhpcy5vYmosIGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgICAgICBpZiAob3RoZXIuZXhlYyh2YWx1ZSkpIG1hdGNoZWRQcm9wcy5wdXNoKHV0aWwuZm9ybWF0UHJvcChuYW1lKSk7XG4gICAgICAgICAgICBlbHNlIG5vdE1hdGNoZWRQcm9wcy5wdXNoKHV0aWwuZm9ybWF0UHJvcChuYW1lKSArICcgKCcgKyBpKHZhbHVlKSArICcpJyk7XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICBpZiAobm90TWF0Y2hlZFByb3BzLmxlbmd0aClcbiAgICAgICAgICAgIHRoaXMucGFyYW1zLm9wZXJhdG9yICs9ICdcXG4gICAgbm90IG1hdGNoZWQgcHJvcGVydGllczogJyArIG5vdE1hdGNoZWRQcm9wcy5qb2luKCcsICcpO1xuICAgICAgICAgIGlmIChtYXRjaGVkUHJvcHMubGVuZ3RoKVxuICAgICAgICAgICAgdGhpcy5wYXJhbXMub3BlcmF0b3IgKz0gJ1xcbiAgICBtYXRjaGVkIHByb3BlcnRpZXM6ICcgKyBtYXRjaGVkUHJvcHMuam9pbignLCAnKTtcblxuICAgICAgICAgIHRoaXMuYXNzZXJ0KG5vdE1hdGNoZWRQcm9wcy5sZW5ndGggPT09IDApO1xuICAgICAgICB9IC8vIHNob3VsZCB3ZSB0cnkgdG8gY29udmVydCB0byBTdHJpbmcgYW5kIGV4ZWM/XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvdGhlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciByZXM7XG5cbiAgICAgICAgcmVzID0gb3RoZXIodGhpcy5vYmopO1xuXG4gICAgICAgIC8vaWYocmVzIGluc3RhbmNlb2YgQXNzZXJ0aW9uKSB7XG4gICAgICAgIC8vICB0aGlzLnBhcmFtcy5vcGVyYXRvciArPSAnXFxuICAgICcgKyByZXMuZ2V0TWVzc2FnZSgpO1xuICAgICAgICAvL31cblxuICAgICAgICAvL2lmIHdlIHRocm93IGV4Y2VwdGlvbiBvayAtIGl0IGlzIHVzZWQgLnNob3VsZCBpbnNpZGVcbiAgICAgICAgaWYgKHR5cGVvZiByZXMgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdGhpcy5hc3NlcnQocmVzKTsgLy8gaWYgaXQgaXMganVzdCBib29sZWFuIGZ1bmN0aW9uIGFzc2VydCBvbiBpdFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG90aGVyICE9IG51bGwgJiYgdGhpcy5vYmogIT0gbnVsbCAmJiB0eXBlb2Ygb3RoZXIgPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRoaXMub2JqID09ICdvYmplY3QnKSB7IC8vIHRyeSB0byBtYXRjaCBwcm9wZXJ0aWVzIChmb3IgT2JqZWN0IGFuZCBBcnJheSlcbiAgICAgICAgbm90TWF0Y2hlZFByb3BzID0gW107XG4gICAgICAgIG1hdGNoZWRQcm9wcyA9IFtdO1xuXG4gICAgICAgIHV0aWwuZm9yRWFjaChvdGhlciwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzaG91bGQodGhpcy5vYmopLmhhdmUucHJvcGVydHkoa2V5KS53aGljaC5tYXRjaCh2YWx1ZSk7XG4gICAgICAgICAgICBtYXRjaGVkUHJvcHMucHVzaCh1dGlsLmZvcm1hdFByb3Aoa2V5KSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgbm90TWF0Y2hlZFByb3BzLnB1c2godXRpbC5mb3JtYXRQcm9wKGtleSkgKyAnICgnICsgaSh0aGlzLm9ialtrZXldKSArICcpJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgaWYgKG5vdE1hdGNoZWRQcm9wcy5sZW5ndGgpXG4gICAgICAgICAgdGhpcy5wYXJhbXMub3BlcmF0b3IgKz0gJ1xcbiAgICBub3QgbWF0Y2hlZCBwcm9wZXJ0aWVzOiAnICsgbm90TWF0Y2hlZFByb3BzLmpvaW4oJywgJyk7XG4gICAgICAgIGlmIChtYXRjaGVkUHJvcHMubGVuZ3RoKVxuICAgICAgICAgIHRoaXMucGFyYW1zLm9wZXJhdG9yICs9ICdcXG4gICAgbWF0Y2hlZCBwcm9wZXJ0aWVzOiAnICsgbWF0Y2hlZFByb3BzLmpvaW4oJywgJyk7XG5cbiAgICAgICAgdGhpcy5hc3NlcnQobm90TWF0Y2hlZFByb3BzLmxlbmd0aCA9PT0gMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFzc2VydChmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0cyBpZiBnaXZlbiBvYmplY3QgdmFsdWVzIG9yIGFycmF5IGVsZW1lbnRzIGFsbCBtYXRjaCBgb3RoZXJgIG9iamVjdCwgdXNpbmcgc29tZSBhc3N1bXB0aW9uczpcbiAgICogRmlyc3Qgb2JqZWN0IG1hdGNoZWQgaWYgdGhleSBhcmUgZXF1YWwsXG4gICAqIElmIGBvdGhlcmAgaXMgYSByZWdleHAgLSBtYXRjaGluZyB3aXRoIHJlZ2V4cFxuICAgKiBJZiBgb3RoZXJgIGlzIGEgZnVuY3Rpb24gY2hlY2sgaWYgdGhpcyBmdW5jdGlvbiB0aHJvd3MgQXNzZXJ0aW9uRXJyb3Igb24gZ2l2ZW4gb2JqZWN0IG9yIHJldHVybiBmYWxzZSAtIGl0IHdpbGwgYmUgYXNzdW1lZCBhcyBub3QgbWF0Y2hlZFxuICAgKiBBbGwgb3RoZXIgY2FzZXMgY2hlY2sgaWYgdGhpcyBgb3RoZXJgIGVxdWFsIHRvIGVhY2ggZWxlbWVudFxuICAgKlxuICAgKiBAbmFtZSBtYXRjaEVhY2hcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIG1hdGNoaW5nXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jbWF0Y2hFdmVyeVxuICAgKiBAcGFyYW0geyp9IG90aGVyIE9iamVjdCB0byBtYXRjaFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqIFsgJ2EnLCAnYicsICdjJ10uc2hvdWxkLm1hdGNoRWFjaCgvXFx3Ky8pO1xuICAgKiBbICdhJywgJ2EnLCAnYSddLnNob3VsZC5tYXRjaEVhY2goJ2EnKTtcbiAgICpcbiAgICogWyAnYScsICdhJywgJ2EnXS5zaG91bGQubWF0Y2hFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IHZhbHVlLnNob3VsZC5iZS5lcWwoJ2EnKSB9KTtcbiAgICpcbiAgICogeyBhOiAnYScsIGI6ICdhJywgYzogJ2EnIH0uc2hvdWxkLm1hdGNoRWFjaChmdW5jdGlvbih2YWx1ZSkgeyB2YWx1ZS5zaG91bGQuYmUuZXFsKCdhJykgfSk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdtYXRjaEVhY2gnLCBmdW5jdGlvbihvdGhlciwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIG1hdGNoIGVhY2ggJyArIGkob3RoZXIpLCBtZXNzYWdlOiBkZXNjcmlwdGlvbn07XG5cbiAgICB1dGlsLmZvckVhY2godGhpcy5vYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBzaG91bGQodmFsdWUpLm1hdGNoKG90aGVyKTtcbiAgICB9LCB0aGlzKTtcbiAgfSk7XG5cbiAgLyoqXG4gICogQXNzZXJ0cyBpZiBhbnkgb2YgZ2l2ZW4gb2JqZWN0IHZhbHVlcyBvciBhcnJheSBlbGVtZW50cyBtYXRjaCBgb3RoZXJgIG9iamVjdCwgdXNpbmcgc29tZSBhc3N1bXB0aW9uczpcbiAgKiBGaXJzdCBvYmplY3QgbWF0Y2hlZCBpZiB0aGV5IGFyZSBlcXVhbCxcbiAgKiBJZiBgb3RoZXJgIGlzIGEgcmVnZXhwIC0gbWF0Y2hpbmcgd2l0aCByZWdleHBcbiAgKiBJZiBgb3RoZXJgIGlzIGEgZnVuY3Rpb24gY2hlY2sgaWYgdGhpcyBmdW5jdGlvbiB0aHJvd3MgQXNzZXJ0aW9uRXJyb3Igb24gZ2l2ZW4gb2JqZWN0IG9yIHJldHVybiBmYWxzZSAtIGl0IHdpbGwgYmUgYXNzdW1lZCBhcyBub3QgbWF0Y2hlZFxuICAqIEFsbCBvdGhlciBjYXNlcyBjaGVjayBpZiB0aGlzIGBvdGhlcmAgZXF1YWwgdG8gZWFjaCBlbGVtZW50XG4gICpcbiAgKiBAbmFtZSBtYXRjaEFueVxuICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIG1hdGNoaW5nXG4gICogQHBhcmFtIHsqfSBvdGhlciBPYmplY3QgdG8gbWF0Y2hcbiAgKiBAYWxpYXMgQXNzZXJ0aW9uI21hdGNoU29tZVxuICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgKiBAZXhhbXBsZVxuICAqIFsgJ2EnLCAnYicsICdjJ10uc2hvdWxkLm1hdGNoQW55KC9cXHcrLyk7XG4gICogWyAnYScsICdiJywgJ2MnXS5zaG91bGQubWF0Y2hBbnkoJ2EnKTtcbiAgKlxuICAqIFsgJ2EnLCAnYicsICdjJ10uc2hvdWxkLm1hdGNoQW55KGZ1bmN0aW9uKHZhbHVlKSB7IHZhbHVlLnNob3VsZC5iZS5lcWwoJ2EnKSB9KTtcbiAgKlxuICAqIHsgYTogJ2EnLCBiOiAnYicsIGM6ICdjJyB9LnNob3VsZC5tYXRjaEFueShmdW5jdGlvbih2YWx1ZSkgeyB2YWx1ZS5zaG91bGQuYmUuZXFsKCdhJykgfSk7XG4gICovXG4gIEFzc2VydGlvbi5hZGQoJ21hdGNoQW55JywgZnVuY3Rpb24ob3RoZXIsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBtYXRjaCBhbnkgJyArIGkob3RoZXIpLCBtZXNzYWdlOiBkZXNjcmlwdGlvbn07XG5cbiAgICB0aGlzLmFzc2VydCh1dGlsLnNvbWUodGhpcy5vYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBzaG91bGQodmFsdWUpLm1hdGNoKG90aGVyKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2Ygc2hvdWxkLkFzc2VydGlvbkVycm9yKSB7XG4gICAgICAgICAgLy8gQ2F1Z2h0IGFuIEFzc2VydGlvbkVycm9yLCByZXR1cm4gZmFsc2UgdG8gdGhlIGl0ZXJhdG9yXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSkpO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ21hdGNoQW55JywgJ21hdGNoU29tZScpO1xuICBBc3NlcnRpb24uYWxpYXMoJ21hdGNoRWFjaCcsICdtYXRjaEV2ZXJ5Jyk7XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQsIEFzc2VydGlvbikge1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIE5hTlxuICAgKiBAbmFtZSBOYU5cbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIG51bWJlcnNcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDEwKS5zaG91bGQubm90LmJlLk5hTigpO1xuICAgKiBOYU4uc2hvdWxkLmJlLk5hTigpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnTmFOJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgTmFOJyB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmogIT09IHRoaXMub2JqKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgbm90IGZpbml0ZSAocG9zaXRpdmUgb3IgbmVnYXRpdmUpXG4gICAqXG4gICAqIEBuYW1lIEluZmluaXR5XG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBudW1iZXJzXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICgxMCkuc2hvdWxkLm5vdC5iZS5JbmZpbml0eSgpO1xuICAgKiBOYU4uc2hvdWxkLm5vdC5iZS5JbmZpbml0eSgpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnSW5maW5pdHknLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSBJbmZpbml0eScgfTtcblxuICAgIHRoaXMuaXMuYS5OdW1iZXIoKVxuICAgICAgLmFuZC5ub3QuYS5OYU4oKVxuICAgICAgLmFuZC5hc3NlcnQoIWlzRmluaXRlKHRoaXMub2JqKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gbnVtYmVyIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGZpbmlzaGAgb3IgZXF1YWwgb25lIG9mIHRoZW0uXG4gICAqXG4gICAqIEBuYW1lIHdpdGhpblxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbnVtYmVyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgU3RhcnQgbnVtYmVyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBmaW5pc2ggRmluaXNoIG51bWJlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICgxMCkuc2hvdWxkLmJlLndpdGhpbigwLCAyMCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCd3aXRoaW4nLCBmdW5jdGlvbihzdGFydCwgZmluaXNoLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0geyBvcGVyYXRvcjogJ3RvIGJlIHdpdGhpbiAnICsgc3RhcnQgKyAnLi4nICsgZmluaXNoLCBtZXNzYWdlOiBkZXNjcmlwdGlvbiB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmogPj0gc3RhcnQgJiYgdGhpcy5vYmogPD0gZmluaXNoKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBudW1iZXIgbmVhciBzb21lIG90aGVyIGB2YWx1ZWAgd2l0aGluIGBkZWx0YWBcbiAgICpcbiAgICogQG5hbWUgYXBwcm94aW1hdGVseVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbnVtYmVyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgQ2VudGVyIG51bWJlclxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVsdGEgUmFkaXVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDkuOTkpLnNob3VsZC5iZS5hcHByb3hpbWF0ZWx5KDEwLCAwLjEpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnYXBwcm94aW1hdGVseScsIGZ1bmN0aW9uKHZhbHVlLCBkZWx0YSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSBhcHByb3hpbWF0ZWx5ICcgKyB2YWx1ZSArICcgwrEnICsgZGVsdGEsIG1lc3NhZ2U6IGRlc2NyaXB0aW9uIH07XG5cbiAgICB0aGlzLmFzc2VydChNYXRoLmFicyh0aGlzLm9iaiAtIHZhbHVlKSA8PSBkZWx0YSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gbnVtYmVyIGFib3ZlIGBuYC5cbiAgICpcbiAgICogQG5hbWUgYWJvdmVcbiAgICogQGFsaWFzIEFzc2VydGlvbiNncmVhdGVyVGhhblxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbnVtYmVyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gbiBNYXJnaW4gbnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDEwKS5zaG91bGQuYmUuYWJvdmUoMCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdhYm92ZScsIGZ1bmN0aW9uKG4sIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgYWJvdmUgJyArIG4sIG1lc3NhZ2U6IGRlc2NyaXB0aW9uIH07XG5cbiAgICB0aGlzLmFzc2VydCh0aGlzLm9iaiA+IG4pO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG51bWJlciBiZWxvdyBgbmAuXG4gICAqXG4gICAqIEBuYW1lIGJlbG93XG4gICAqIEBhbGlhcyBBc3NlcnRpb24jbGVzc1RoYW5cbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIG51bWJlcnNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gTWFyZ2luIG51bWJlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICgwKS5zaG91bGQuYmUuYmVsb3coMTApO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnYmVsb3cnLCBmdW5jdGlvbihuLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0geyBvcGVyYXRvcjogJ3RvIGJlIGJlbG93ICcgKyBuLCBtZXNzYWdlOiBkZXNjcmlwdGlvbiB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmogPCBuKTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKCdhYm92ZScsICdncmVhdGVyVGhhbicpO1xuICBBc3NlcnRpb24uYWxpYXMoJ2JlbG93JywgJ2xlc3NUaGFuJyk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBudW1iZXIgYWJvdmUgYG5gLlxuICAgKlxuICAgKiBAbmFtZSBhYm92ZU9yRXF1YWxcbiAgICogQGFsaWFzIEFzc2VydGlvbiNncmVhdGVyVGhhbk9yRXF1YWxcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIG51bWJlcnNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gTWFyZ2luIG51bWJlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICgxMCkuc2hvdWxkLmJlLmFib3ZlT3JFcXVhbCgwKTtcbiAgICogKDEwKS5zaG91bGQuYmUuYWJvdmVPckVxdWFsKDEwKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2Fib3ZlT3JFcXVhbCcsIGZ1bmN0aW9uKG4sIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgYWJvdmUgb3IgZXF1YWwnICsgbiwgbWVzc2FnZTogZGVzY3JpcHRpb24gfTtcblxuICAgIHRoaXMuYXNzZXJ0KHRoaXMub2JqID49IG4pO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG51bWJlciBiZWxvdyBgbmAuXG4gICAqXG4gICAqIEBuYW1lIGJlbG93T3JFcXVhbFxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2xlc3NUaGFuT3JFcXVhbFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbnVtYmVyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gbiBNYXJnaW4gbnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDApLnNob3VsZC5iZS5iZWxvd09yRXF1YWwoMTApO1xuICAgKiAoMCkuc2hvdWxkLmJlLmJlbG93T3JFcXVhbCgwKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2JlbG93T3JFcXVhbCcsIGZ1bmN0aW9uKG4sIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgYmVsb3cgb3IgZXF1YWwnICsgbiwgbWVzc2FnZTogZGVzY3JpcHRpb24gfTtcblxuICAgIHRoaXMuYXNzZXJ0KHRoaXMub2JqIDw9IG4pO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2Fib3ZlT3JFcXVhbCcsICdncmVhdGVyVGhhbk9yRXF1YWwnKTtcbiAgQXNzZXJ0aW9uLmFsaWFzKCdiZWxvd09yRXF1YWwnLCAnbGVzc1RoYW5PckVxdWFsJyk7XG5cbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBQcm9taXNlZEFzc2VydGlvbiA9IHJlcXVpcmUoJy4uL2Fzc2VydGlvbicpLlByb21pc2VkQXNzZXJ0aW9uO1xudmFyIEFzc2VydGlvbiA9IHJlcXVpcmUoJy4uL2Fzc2VydGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNob3VsZCkge1xuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBhIFByb21pc2VcbiAgICpcbiAgICogQG5hbWUgUHJvbWlzZVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvbWlzZXNcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogcHJvbWlzZS5zaG91bGQuYmUuUHJvbWlzZSgpXG4gICAqIChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsgcmVzb2x2ZSgxMCk7IH0pKS5zaG91bGQuYmUuYS5Qcm9taXNlKClcbiAgICogKDEwKS5zaG91bGQubm90LmJlLmEuUHJvbWlzZSgpXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdQcm9taXNlJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBwcm9taXNlJ307XG5cbiAgICB2YXIgb2JqID0gdGhpcy5vYmo7XG5cbiAgICBzaG91bGQob2JqKS5oYXZlLnByb3BlcnR5KCd0aGVuJylcbiAgICAgIC53aGljaC5pcy5hLkZ1bmN0aW9uKCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gcHJvbWlzZSB3aWxsIGJlIGZ1bGZpbGxlZC4gUmVzdWx0IG9mIGFzc2VydGlvbiBpcyBzdGlsbCAudGhlbmFibGUgYW5kIHNob3VsZCBiZSBoYW5kbGVkIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAbmFtZSBmdWxmaWxsZWRcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBwcm9taXNlc1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAvLyBkb24ndCBmb3JnZXQgdG8gaGFuZGxlIGFzeW5jIG5hdHVyZVxuICAgKiAobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7IHJlc29sdmUoMTApOyB9KSkuc2hvdWxkLmJlLmZ1bGZpbGxlZCgpO1xuICAgKlxuICAgKiAvLyB0ZXN0IGV4YW1wbGUgd2l0aCBtb2NoYSBpdCBpcyBwb3NzaWJsZSB0byByZXR1cm4gcHJvbWlzZVxuICAgKiBpdCgnaXMgYXN5bmMnLCAoKSA9PiB7XG4gICAqICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUoMTApKVxuICAgKiAgICAgIC5zaG91bGQuYmUuZnVsZmlsbGVkKCk7XG4gICAqIH0pO1xuICAgKi9cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5mdWxmaWxsZWQgPSBmdW5jdGlvbiBBc3NlcnRpb24kZnVsZmlsbGVkKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgZnVsZmlsbGVkJ307XG5cbiAgICBzaG91bGQodGhpcy5vYmopLmJlLmEuUHJvbWlzZSgpO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLm9iai50aGVuKGZ1bmN0aW9uIG5leHQkb25SZXNvbHZlKHZhbHVlKSB7XG4gICAgICBpZiAodGhhdC5uZWdhdGUpIHtcbiAgICAgICAgdGhhdC5mYWlsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSwgZnVuY3Rpb24gbmV4dCRvblJlamVjdChlcnIpIHtcbiAgICAgIGlmICghdGhhdC5uZWdhdGUpIHtcbiAgICAgICAgdGhhdC5wYXJhbXMub3BlcmF0b3IgKz0gJywgYnV0IGl0IHdhcyByZWplY3RlZCB3aXRoICcgKyBzaG91bGQuZm9ybWF0KGVycik7XG4gICAgICAgIHRoYXQuZmFpbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVycjtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZC4gUmVzdWx0IG9mIGFzc2VydGlvbiBpcyBzdGlsbCAudGhlbmFibGUgYW5kIHNob3VsZCBiZSBoYW5kbGVkIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAbmFtZSByZWplY3RlZFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvbWlzZXNcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIC8vIGRvbid0IGZvcmdldCB0byBoYW5kbGUgYXN5bmMgbmF0dXJlXG4gICAqIChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsgcmVzb2x2ZSgxMCk7IH0pKVxuICAgKiAgICAuc2hvdWxkLm5vdC5iZS5yZWplY3RlZCgpO1xuICAgKlxuICAgKiAvLyB0ZXN0IGV4YW1wbGUgd2l0aCBtb2NoYSBpdCBpcyBwb3NzaWJsZSB0byByZXR1cm4gcHJvbWlzZVxuICAgKiBpdCgnaXMgYXN5bmMnLCAoKSA9PiB7XG4gICAqICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZWplY3QobmV3IEVycm9yKCdib29tJykpKVxuICAgKiAgICAgIC5zaG91bGQuYmUucmVqZWN0ZWQoKTtcbiAgICogfSk7XG4gICAqL1xuICBBc3NlcnRpb24ucHJvdG90eXBlLnJlamVjdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSByZWplY3RlZCd9O1xuXG4gICAgc2hvdWxkKHRoaXMub2JqKS5iZS5hLlByb21pc2UoKTtcblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5vYmoudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCF0aGF0Lm5lZ2F0ZSkge1xuICAgICAgICB0aGF0LnBhcmFtcy5vcGVyYXRvciArPSAnLCBidXQgaXQgd2FzIGZ1bGZpbGxlZCc7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICB0aGF0LnBhcmFtcy5vcGVyYXRvciArPSAnIHdpdGggJyArIHNob3VsZC5mb3JtYXQodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuZmFpbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sIGZ1bmN0aW9uIG5leHQkb25FcnJvcihlcnIpIHtcbiAgICAgIGlmICh0aGF0Lm5lZ2F0ZSkge1xuICAgICAgICB0aGF0LmZhaWwoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlcnI7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBwcm9taXNlIHdpbGwgYmUgZnVsZmlsbGVkIHdpdGggc29tZSBleHBlY3RlZCB2YWx1ZSAodmFsdWUgY29tcGFyZWQgdXNpbmcgLmVxbCkuXG4gICAqIFJlc3VsdCBvZiBhc3NlcnRpb24gaXMgc3RpbGwgLnRoZW5hYmxlIGFuZCBzaG91bGQgYmUgaGFuZGxlZCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQG5hbWUgZnVsZmlsbGVkV2l0aFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvbWlzZXNcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIC8vIGRvbid0IGZvcmdldCB0byBoYW5kbGUgYXN5bmMgbmF0dXJlXG4gICAqIChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsgcmVzb2x2ZSgxMCk7IH0pKVxuICAgKiAgICAuc2hvdWxkLmJlLmZ1bGZpbGxlZFdpdGgoMTApO1xuICAgKlxuICAgKiAvLyB0ZXN0IGV4YW1wbGUgd2l0aCBtb2NoYSBpdCBpcyBwb3NzaWJsZSB0byByZXR1cm4gcHJvbWlzZVxuICAgKiBpdCgnaXMgYXN5bmMnLCAoKSA9PiB7XG4gICAqICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZXNvbHZlKDEwKSlcbiAgICogICAgICAgLnNob3VsZC5iZS5mdWxmaWxsZWRXaXRoKDEwKTtcbiAgICogfSk7XG4gICAqL1xuICBBc3NlcnRpb24ucHJvdG90eXBlLmZ1bGZpbGxlZFdpdGggPSBmdW5jdGlvbihleHBlY3RlZFZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBmdWxmaWxsZWQgd2l0aCAnICsgc2hvdWxkLmZvcm1hdChleHBlY3RlZFZhbHVlKX07XG5cbiAgICBzaG91bGQodGhpcy5vYmopLmJlLmEuUHJvbWlzZSgpO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLm9iai50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAodGhhdC5uZWdhdGUpIHtcbiAgICAgICAgdGhhdC5mYWlsKCk7XG4gICAgICB9XG4gICAgICBzaG91bGQodmFsdWUpLmVxbChleHBlY3RlZFZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LCBmdW5jdGlvbiBuZXh0JG9uRXJyb3IoZXJyKSB7XG4gICAgICBpZiAoIXRoYXQubmVnYXRlKSB7XG4gICAgICAgIHRoYXQucGFyYW1zLm9wZXJhdG9yICs9ICcsIGJ1dCBpdCB3YXMgcmVqZWN0ZWQgd2l0aCAnICsgc2hvdWxkLmZvcm1hdChlcnIpO1xuICAgICAgICB0aGF0LmZhaWwoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlcnI7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCBzb21lIHNvcnQgb2YgZXJyb3IuIEFyZ3VtZW50cyBpcyB0aGUgc2FtZSBmb3IgQXNzZXJ0aW9uI3Rocm93LlxuICAgKiBSZXN1bHQgb2YgYXNzZXJ0aW9uIGlzIHN0aWxsIC50aGVuYWJsZSBhbmQgc2hvdWxkIGJlIGhhbmRsZWQgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBuYW1lIHJlamVjdGVkV2l0aFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvbWlzZXNcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIGZhaWxlZFByb21pc2UoKSB7XG4gICAqICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgKiAgICAgcmVqZWN0KG5ldyBFcnJvcignYm9vbScpKVxuICAgKiAgIH0pXG4gICAqIH1cbiAgICogZmFpbGVkUHJvbWlzZSgpLnNob3VsZC5iZS5yZWplY3RlZFdpdGgoRXJyb3IpO1xuICAgKiBmYWlsZWRQcm9taXNlKCkuc2hvdWxkLmJlLnJlamVjdGVkV2l0aCgnYm9vbScpO1xuICAgKiBmYWlsZWRQcm9taXNlKCkuc2hvdWxkLmJlLnJlamVjdGVkV2l0aCgvYm9vbS8pO1xuICAgKiBmYWlsZWRQcm9taXNlKCkuc2hvdWxkLmJlLnJlamVjdGVkV2l0aChFcnJvciwgeyBtZXNzYWdlOiAnYm9vbScgfSk7XG4gICAqIGZhaWxlZFByb21pc2UoKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKHsgbWVzc2FnZTogJ2Jvb20nIH0pO1xuICAgKlxuICAgKiAvLyB0ZXN0IGV4YW1wbGUgd2l0aCBtb2NoYSBpdCBpcyBwb3NzaWJsZSB0byByZXR1cm4gcHJvbWlzZVxuICAgKiBpdCgnaXMgYXN5bmMnLCAoKSA9PiB7XG4gICAqICAgIHJldHVybiBmYWlsZWRQcm9taXNlKCkuc2hvdWxkLmJlLnJlamVjdGVkV2l0aCh7IG1lc3NhZ2U6ICdib29tJyB9KTtcbiAgICogfSk7XG4gICAqL1xuICBBc3NlcnRpb24ucHJvdG90eXBlLnJlamVjdGVkV2l0aCA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHByb3BlcnRpZXMpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIHJlamVjdGVkJ307XG5cbiAgICBzaG91bGQodGhpcy5vYmopLmJlLmEuUHJvbWlzZSgpO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLm9iai50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXRoYXQubmVnYXRlKSB7XG4gICAgICAgIHRoYXQuZmFpbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sIGZ1bmN0aW9uIG5leHQkb25FcnJvcihlcnIpIHtcbiAgICAgIGlmICh0aGF0Lm5lZ2F0ZSkge1xuICAgICAgICB0aGF0LmZhaWwoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVycm9yTWF0Y2hlZCA9IHRydWU7XG4gICAgICB2YXIgZXJyb3JJbmZvID0gJyc7XG5cbiAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIG1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JNYXRjaGVkID0gbWVzc2FnZSA9PT0gZXJyLm1lc3NhZ2U7XG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgZXJyb3JNYXRjaGVkID0gbWVzc2FnZS50ZXN0KGVyci5tZXNzYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JNYXRjaGVkID0gZXJyIGluc3RhbmNlb2YgbWVzc2FnZTtcbiAgICAgIH0gZWxzZSBpZiAobWVzc2FnZSAhPT0gbnVsbCAmJiB0eXBlb2YgbWVzc2FnZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzaG91bGQoZXJyKS5tYXRjaChtZXNzYWdlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2Ygc2hvdWxkLkFzc2VydGlvbkVycm9yKSB7XG4gICAgICAgICAgICBlcnJvckluZm8gPSAnOiAnICsgZS5tZXNzYWdlO1xuICAgICAgICAgICAgZXJyb3JNYXRjaGVkID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZXJyb3JNYXRjaGVkKSB7XG4gICAgICAgIGlmICggdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnIHx8IG1lc3NhZ2UgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICBlcnJvckluZm8gPSAnIHdpdGggYSBtZXNzYWdlIG1hdGNoaW5nICcgKyBzaG91bGQuZm9ybWF0KG1lc3NhZ2UpICsgXCIsIGJ1dCBnb3QgJ1wiICsgZXJyLm1lc3NhZ2UgKyBcIidcIjtcbiAgICAgICAgfSBlbHNlIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgbWVzc2FnZSkge1xuICAgICAgICAgIGVycm9ySW5mbyA9ICcgb2YgdHlwZSAnICsgdXRpbC5mdW5jdGlvbk5hbWUobWVzc2FnZSkgKyAnLCBidXQgZ290ICcgKyB1dGlsLmZ1bmN0aW9uTmFtZShlcnIuY29uc3RydWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBtZXNzYWdlICYmIHByb3BlcnRpZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzaG91bGQoZXJyKS5tYXRjaChwcm9wZXJ0aWVzKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2Ygc2hvdWxkLkFzc2VydGlvbkVycm9yKSB7XG4gICAgICAgICAgICBlcnJvckluZm8gPSAnOiAnICsgZS5tZXNzYWdlO1xuICAgICAgICAgICAgZXJyb3JNYXRjaGVkID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoYXQucGFyYW1zLm9wZXJhdG9yICs9IGVycm9ySW5mbztcblxuICAgICAgdGhhdC5hc3NlcnQoZXJyb3JNYXRjaGVkKTtcblxuICAgICAgcmV0dXJuIGVycjtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBwcm9taXNlIGFuZCB3cmFwIGl0IGluIFByb21pc2VkQXNzZXJ0aW9uLCB3aGljaCBoYXMgYWxsIHByb3BlcnRpZXMgb2YgQXNzZXJ0aW9uLlxuICAgKiBUaGF0IG1lYW5zIHlvdSBjYW4gY2hhaW4gYXMgd2l0aCB1c3VhbCBBc3NlcnRpb24uXG4gICAqIFJlc3VsdCBvZiBhc3NlcnRpb24gaXMgc3RpbGwgLnRoZW5hYmxlIGFuZCBzaG91bGQgYmUgaGFuZGxlZCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQG5hbWUgZmluYWxseVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jZXZlbnR1YWxseVxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb21pc2VzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlZEFzc2VydGlvbn0gTGlrZSBBc3NlcnRpb24sIGJ1dCAudGhlbiB0aGlzLm9iaiBpbiBBc3NlcnRpb25cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkgeyByZXNvbHZlKDEwKTsgfSkpXG4gICAqICAgIC5zaG91bGQuYmUuZXZlbnR1YWxseS5lcXVhbCgxMCk7XG4gICAqXG4gICAqIC8vIHRlc3QgZXhhbXBsZSB3aXRoIG1vY2hhIGl0IGlzIHBvc3NpYmxlIHRvIHJldHVybiBwcm9taXNlXG4gICAqIGl0KCdpcyBhc3luYycsICgpID0+IHtcbiAgICogICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZSgxMCkpXG4gICAqICAgICAgLnNob3VsZC5iZS5maW5hbGx5LmVxdWFsKDEwKTtcbiAgICogfSk7XG4gICAqL1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXNzZXJ0aW9uLnByb3RvdHlwZSwgJ2ZpbmFsbHknLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHNob3VsZCh0aGlzLm9iaikuYmUuYS5Qcm9taXNlKCk7XG5cbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlZEFzc2VydGlvbih0aGlzLm9iai50aGVuKGZ1bmN0aW9uKG9iaikge1xuICAgICAgICB2YXIgYSA9IHNob3VsZChvYmopO1xuXG4gICAgICAgIGEubmVnYXRlID0gdGhhdC5uZWdhdGU7XG4gICAgICAgIGEuYW55T25lID0gdGhhdC5hbnlPbmU7XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgICB9KSk7XG4gICAgfVxuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2ZpbmFsbHknLCAnZXZlbnR1YWxseScpO1xufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIGVxbCA9IHJlcXVpcmUoJ3Nob3VsZC1lcXVhbCcpO1xuXG52YXIgYVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNob3VsZCwgQXNzZXJ0aW9uKSB7XG4gIHZhciBpID0gc2hvdWxkLmZvcm1hdDtcbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGhhcyBzb21lIGRlc2NyaXB0b3IuICoqT24gc3VjY2VzcyBpdCBjaGFuZ2UgZ2l2ZW4gb2JqZWN0IHRvIGJlIHZhbHVlIG9mIHByb3BlcnR5KiouXG4gICAqXG4gICAqIEBuYW1lIHByb3BlcnR5V2l0aERlc2NyaXB0b3JcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcHJvcGVydHlcbiAgICogQHBhcmFtIHtPYmplY3R9IGRlc2MgRGVzY3JpcHRvciBsaWtlIHVzZWQgaW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IChub3QgcmVxdWlyZWQgdG8gYWRkIGFsbCBwcm9wZXJ0aWVzKVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiAxMCB9KS5zaG91bGQuaGF2ZS5wcm9wZXJ0eVdpdGhEZXNjcmlwdG9yKCdhJywgeyBlbnVtZXJhYmxlOiB0cnVlIH0pO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgncHJvcGVydHlXaXRoRGVzY3JpcHRvcicsIGZ1bmN0aW9uKG5hbWUsIGRlc2MpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHthY3R1YWw6IHRoaXMub2JqLCBvcGVyYXRvcjogJ3RvIGhhdmUgb3duIHByb3BlcnR5IHdpdGggZGVzY3JpcHRvciAnICsgaShkZXNjKX07XG4gICAgdmFyIG9iaiA9IHRoaXMub2JqO1xuICAgIHRoaXMuaGF2ZS5vd25Qcm9wZXJ0eShuYW1lKTtcbiAgICBzaG91bGQoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPYmplY3Qob2JqKSwgbmFtZSkpLmhhdmUucHJvcGVydGllcyhkZXNjKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc1Byb3BzQXJncygpIHtcbiAgICB2YXIgYXJncyA9IHt9O1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgYXJncy5uYW1lcyA9IGFTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbMF07XG4gICAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYXJncy5uYW1lcyA9IFthcmddO1xuICAgICAgfSBlbHNlIGlmICh1dGlsLmlzSW5kZXhhYmxlKGFyZykpIHtcbiAgICAgICAgYXJncy5uYW1lcyA9IGFyZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MubmFtZXMgPSBPYmplY3Qua2V5cyhhcmcpO1xuICAgICAgICBhcmdzLnZhbHVlcyA9IGFyZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGdpdmVuIG9iamVjdCBoYXMgZW51bWVyYWJsZSBwcm9wZXJ0eSB3aXRoIG9wdGlvbmFsbHkgdmFsdWUuICoqT24gc3VjY2VzcyBpdCBjaGFuZ2UgZ2l2ZW4gb2JqZWN0IHRvIGJlIHZhbHVlIG9mIHByb3BlcnR5KiouXG4gICAqXG4gICAqIEBuYW1lIGVudW1lcmFibGVcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcHJvcGVydHlcbiAgICogQHBhcmFtIHsqfSBbdmFsXSBPcHRpb25hbCBwcm9wZXJ0eSB2YWx1ZSB0byBjaGVja1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiAxMCB9KS5zaG91bGQuaGF2ZS5lbnVtZXJhYmxlKCdhJyk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdlbnVtZXJhYmxlJywgZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gICAgbmFtZSA9IHV0aWwuY29udmVydFByb3BlcnR5TmFtZShuYW1lKTtcblxuICAgIHRoaXMucGFyYW1zID0ge1xuICAgICAgb3BlcmF0b3I6IFwidG8gaGF2ZSBlbnVtZXJhYmxlIHByb3BlcnR5IFwiICsgdXRpbC5mb3JtYXRQcm9wKG5hbWUpICsgKGFyZ3VtZW50cy5sZW5ndGggPiAxID8gXCIgZXF1YWwgdG8gXCIgKyBpKHZhbCk6IFwiXCIpXG4gICAgfTtcblxuICAgIHZhciBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlIH07XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSBkZXNjLnZhbHVlID0gdmFsO1xuICAgIHRoaXMuaGF2ZS5wcm9wZXJ0eVdpdGhEZXNjcmlwdG9yKG5hbWUsIGRlc2MpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0cyBnaXZlbiBvYmplY3QgaGFzIGVudW1lcmFibGUgcHJvcGVydGllc1xuICAgKlxuICAgKiBAbmFtZSBlbnVtZXJhYmxlc1xuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtBcnJheXwuLi5zdHJpbmd8T2JqZWN0fSBuYW1lcyBOYW1lcyBvZiBwcm9wZXJ0eVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiAxMCwgYjogMTAgfSkuc2hvdWxkLmhhdmUuZW51bWVyYWJsZXMoJ2EnKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2VudW1lcmFibGVzJywgZnVuY3Rpb24oLypuYW1lcyovKSB7XG4gICAgdmFyIGFyZ3MgPSBwcm9jZXNzUHJvcHNBcmdzLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLnBhcmFtcyA9IHtcbiAgICAgIG9wZXJhdG9yOiBcInRvIGhhdmUgZW51bWVyYWJsZXMgXCIgKyBhcmdzLm5hbWVzLm1hcCh1dGlsLmZvcm1hdFByb3ApXG4gICAgfTtcblxuICAgIHZhciBvYmogPSB0aGlzLm9iajtcbiAgICBhcmdzLm5hbWVzLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgc2hvdWxkKG9iaikuaGF2ZS5lbnVtZXJhYmxlKG5hbWUpO1xuICAgIH0pO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0cyBnaXZlbiBvYmplY3QgaGFzIHByb3BlcnR5IHdpdGggb3B0aW9uYWxseSB2YWx1ZS4gKipPbiBzdWNjZXNzIGl0IGNoYW5nZSBnaXZlbiBvYmplY3QgdG8gYmUgdmFsdWUgb2YgcHJvcGVydHkqKi5cbiAgICpcbiAgICogQG5hbWUgcHJvcGVydHlcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcHJvcGVydHlcbiAgICogQHBhcmFtIHsqfSBbdmFsXSBPcHRpb25hbCBwcm9wZXJ0eSB2YWx1ZSB0byBjaGVja1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiAxMCB9KS5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnYScpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgncHJvcGVydHknLCBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICBuYW1lID0gdXRpbC5jb252ZXJ0UHJvcGVydHlOYW1lKG5hbWUpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIHAgPSB7fTtcbiAgICAgIHBbbmFtZV0gPSB2YWw7XG4gICAgICB0aGlzLmhhdmUucHJvcGVydGllcyhwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYXZlLnByb3BlcnRpZXMobmFtZSk7XG4gICAgfVxuICAgIHRoaXMub2JqID0gdGhpcy5vYmpbbmFtZV07XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGdpdmVuIG9iamVjdCBoYXMgcHJvcGVydGllcy4gT24gdGhpcyBtZXRob2QgYWZmZWN0IC5hbnkgbW9kaWZpZXIsIHdoaWNoIGFsbG93IHRvIGNoZWNrIG5vdCBhbGwgcHJvcGVydGllcy5cbiAgICpcbiAgICogQG5hbWUgcHJvcGVydGllc1xuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtBcnJheXwuLi5zdHJpbmd8T2JqZWN0fSBuYW1lcyBOYW1lcyBvZiBwcm9wZXJ0eVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiAxMCB9KS5zaG91bGQuaGF2ZS5wcm9wZXJ0aWVzKCdhJyk7XG4gICAqICh7IGE6IDEwLCBiOiAyMCB9KS5zaG91bGQuaGF2ZS5wcm9wZXJ0aWVzKFsgJ2EnIF0pO1xuICAgKiAoeyBhOiAxMCwgYjogMjAgfSkuc2hvdWxkLmhhdmUucHJvcGVydGllcyh7IGI6IDIwIH0pO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgncHJvcGVydGllcycsIGZ1bmN0aW9uKG5hbWVzKSB7XG4gICAgdmFyIHZhbHVlcyA9IHt9O1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgbmFtZXMgPSBhU2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkobmFtZXMpKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWVzID09ICdzdHJpbmcnIHx8IHR5cGVvZiBuYW1lcyA9PSAnc3ltYm9sJykge1xuICAgICAgICBuYW1lcyA9IFtuYW1lc107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXMgPSBuYW1lcztcbiAgICAgICAgbmFtZXMgPSBPYmplY3Qua2V5cyhuYW1lcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG9iaiA9IE9iamVjdCh0aGlzLm9iaiksIG1pc3NpbmdQcm9wZXJ0aWVzID0gW107XG5cbiAgICAvL2p1c3QgZW51bWVyYXRlIHByb3BlcnRpZXMgYW5kIGNoZWNrIGlmIHRoZXkgYWxsIHByZXNlbnRcbiAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkgbWlzc2luZ1Byb3BlcnRpZXMucHVzaCh1dGlsLmZvcm1hdFByb3AobmFtZSkpO1xuICAgIH0pO1xuXG4gICAgdmFyIHByb3BzID0gbWlzc2luZ1Byb3BlcnRpZXM7XG4gICAgaWYgKHByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcHJvcHMgPSBuYW1lcy5tYXAodXRpbC5mb3JtYXRQcm9wKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYW55T25lKSB7XG4gICAgICBwcm9wcyA9IG5hbWVzLmZpbHRlcihmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBtaXNzaW5nUHJvcGVydGllcy5pbmRleE9mKHV0aWwuZm9ybWF0UHJvcChuYW1lKSkgPCAwO1xuICAgICAgfSkubWFwKHV0aWwuZm9ybWF0UHJvcCk7XG4gICAgfVxuXG4gICAgdmFyIG9wZXJhdG9yID0gKHByb3BzLmxlbmd0aCA9PT0gMSA/XG4gICAgICAgICd0byBoYXZlIHByb3BlcnR5ICcgOiAndG8gaGF2ZSAnICsgKHRoaXMuYW55T25lID8gJ2FueSBvZiAnIDogJycpICsgJ3Byb3BlcnRpZXMgJykgKyBwcm9wcy5qb2luKCcsICcpO1xuXG4gICAgdGhpcy5wYXJhbXMgPSB7b2JqOiB0aGlzLm9iaiwgb3BlcmF0b3I6IG9wZXJhdG9yfTtcblxuICAgIC8vY2hlY2sgdGhhdCBhbGwgcHJvcGVydGllcyBwcmVzZW50ZWRcbiAgICAvL29yIGlmIHdlIHJlcXVlc3Qgb25lIG9mIHRoZW0gdGhhdCBhdCBsZWFzdCBvbmUgdGhlbSBwcmVzZW50ZWRcbiAgICB0aGlzLmFzc2VydChtaXNzaW5nUHJvcGVydGllcy5sZW5ndGggPT09IDAgfHwgKHRoaXMuYW55T25lICYmIG1pc3NpbmdQcm9wZXJ0aWVzLmxlbmd0aCAhPSBuYW1lcy5sZW5ndGgpKTtcblxuICAgIC8vIGNoZWNrIGlmIHZhbHVlcyBpbiBvYmplY3QgbWF0Y2hlZCBleHBlY3RlZFxuICAgIHZhciB2YWx1ZUNoZWNrTmFtZXMgPSBPYmplY3Qua2V5cyh2YWx1ZXMpO1xuICAgIGlmICh2YWx1ZUNoZWNrTmFtZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgd3JvbmdWYWx1ZXMgPSBbXTtcbiAgICAgIHByb3BzID0gW107XG5cbiAgICAgIC8vIG5vdyBjaGVjayB2YWx1ZXMsIGFzIHRoZXJlIHdlIGhhdmUgYWxsIHByb3BlcnRpZXNcbiAgICAgIHZhbHVlQ2hlY2tOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzW25hbWVdO1xuICAgICAgICBpZiAoIWVxbChvYmpbbmFtZV0sIHZhbHVlKS5yZXN1bHQpIHtcbiAgICAgICAgICB3cm9uZ1ZhbHVlcy5wdXNoKHV0aWwuZm9ybWF0UHJvcChuYW1lKSArICcgb2YgJyArIGkodmFsdWUpICsgJyAoZ290ICcgKyBpKG9ialtuYW1lXSkgKyAnKScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzLnB1c2godXRpbC5mb3JtYXRQcm9wKG5hbWUpICsgJyBvZiAnICsgaSh2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCh3cm9uZ1ZhbHVlcy5sZW5ndGggIT09IDAgJiYgIXRoaXMuYW55T25lKSB8fCAodGhpcy5hbnlPbmUgJiYgcHJvcHMubGVuZ3RoID09PSAwKSkge1xuICAgICAgICBwcm9wcyA9IHdyb25nVmFsdWVzO1xuICAgICAgfVxuXG4gICAgICBvcGVyYXRvciA9IChwcm9wcy5sZW5ndGggPT09IDEgP1xuICAgICAgICAndG8gaGF2ZSBwcm9wZXJ0eSAnIDogJ3RvIGhhdmUgJyArICh0aGlzLmFueU9uZSA/ICdhbnkgb2YgJyA6ICcnKSArICdwcm9wZXJ0aWVzICcpICsgcHJvcHMuam9pbignLCAnKTtcblxuICAgICAgdGhpcy5wYXJhbXMgPSB7b2JqOiB0aGlzLm9iaiwgb3BlcmF0b3I6IG9wZXJhdG9yfTtcblxuICAgICAgLy9pZiB0aGVyZSBpcyBubyBub3QgbWF0Y2hlZCB2YWx1ZXNcbiAgICAgIC8vb3IgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIG1hdGNoZWRcbiAgICAgIHRoaXMuYXNzZXJ0KHdyb25nVmFsdWVzLmxlbmd0aCA9PT0gMCB8fCAodGhpcy5hbnlPbmUgJiYgd3JvbmdWYWx1ZXMubGVuZ3RoICE9IHZhbHVlQ2hlY2tOYW1lcy5sZW5ndGgpKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGdpdmVuIG9iamVjdCBoYXMgcHJvcGVydHkgYGxlbmd0aGAgd2l0aCBnaXZlbiB2YWx1ZSBgbmBcbiAgICpcbiAgICogQG5hbWUgbGVuZ3RoXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jbGVuZ3RoT2ZcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIEV4cGVjdGVkIGxlbmd0aFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIFsxLCAyXS5zaG91bGQuaGF2ZS5sZW5ndGgoMik7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdsZW5ndGgnLCBmdW5jdGlvbihuLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMuaGF2ZS5wcm9wZXJ0eSgnbGVuZ3RoJywgbiwgZGVzY3JpcHRpb24pO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2xlbmd0aCcsICdsZW5ndGhPZicpO1xuXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGhhcyBvd24gcHJvcGVydHkuICoqT24gc3VjY2VzcyBpdCBjaGFuZ2UgZ2l2ZW4gb2JqZWN0IHRvIGJlIHZhbHVlIG9mIHByb3BlcnR5KiouXG4gICAqXG4gICAqIEBuYW1lIG93blByb3BlcnR5XG4gICAqIEBhbGlhcyBBc3NlcnRpb24jaGFzT3duUHJvcGVydHlcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiAxMCB9KS5zaG91bGQuaGF2ZS5vd25Qcm9wZXJ0eSgnYScpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnb3duUHJvcGVydHknLCBmdW5jdGlvbihuYW1lLCBkZXNjcmlwdGlvbikge1xuICAgIG5hbWUgPSB1dGlsLmNvbnZlcnRQcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgdGhpcy5wYXJhbXMgPSB7XG4gICAgICBhY3R1YWw6IHRoaXMub2JqLFxuICAgICAgb3BlcmF0b3I6ICd0byBoYXZlIG93biBwcm9wZXJ0eSAnICsgdXRpbC5mb3JtYXRQcm9wKG5hbWUpLFxuICAgICAgbWVzc2FnZTogZGVzY3JpcHRpb25cbiAgICB9O1xuXG4gICAgdGhpcy5hc3NlcnQoaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLm9iaiwgbmFtZSkpO1xuXG4gICAgdGhpcy5vYmogPSB0aGlzLm9ialtuYW1lXTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKCdvd25Qcm9wZXJ0eScsICdoYXNPd25Qcm9wZXJ0eScpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGdpdmVuIG9iamVjdCBpcyBlbXB0eS4gRm9yIHN0cmluZ3MsIGFycmF5cyBhbmQgYXJndW1lbnRzIGl0IGNoZWNrcyAubGVuZ3RoIHByb3BlcnR5LCBmb3Igb2JqZWN0cyBpdCBjaGVja3Mga2V5cy5cbiAgICpcbiAgICogQG5hbWUgZW1wdHlcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICcnLnNob3VsZC5iZS5lbXB0eSgpO1xuICAgKiBbXS5zaG91bGQuYmUuZW1wdHkoKTtcbiAgICogKHt9KS5zaG91bGQuYmUuZW1wdHkoKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2VtcHR5JywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBlbXB0eSd9O1xuXG4gICAgaWYgKHV0aWwubGVuZ3RoKHRoaXMub2JqKSAhPT0gdm9pZCAwKSB7XG4gICAgICBzaG91bGQodGhpcy5vYmopLmhhdmUucHJvcGVydHkoJ2xlbmd0aCcsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgb2JqID0gT2JqZWN0KHRoaXMub2JqKTsgLy8gd3JhcCB0byByZWZlcmVuY2UgZm9yIGJvb2xlYW5zIGFuZCBudW1iZXJzXG4gICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICBzaG91bGQodGhpcy5vYmopLm5vdC5oYXZlLm93blByb3BlcnR5KHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfSwgdHJ1ZSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGhhcyBleGFjdCBrZXlzLiBDb21wYXJlZCB0byBgcHJvcGVydGllc2AsIGBrZXlzYCBkb2VzIG5vdCBhY2NlcHQgT2JqZWN0IGFzIGEgYXJndW1lbnQuXG4gICAqXG4gICAqIEBuYW1lIGtleXNcbiAgICogQGFsaWFzIEFzc2VydGlvbiNrZXlcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7QXJyYXl8Li4uc3RyaW5nfSBba2V5c10gS2V5cyB0byBjaGVja1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiAxMCB9KS5zaG91bGQuaGF2ZS5rZXlzKCdhJyk7XG4gICAqICh7IGE6IDEwLCBiOiAyMCB9KS5zaG91bGQuaGF2ZS5rZXlzKCdhJywgJ2InKTtcbiAgICogKHsgYTogMTAsIGI6IDIwIH0pLnNob3VsZC5oYXZlLmtleXMoWyAnYScsICdiJyBdKTtcbiAgICogKHt9KS5zaG91bGQuaGF2ZS5rZXlzKCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdrZXlzJywgZnVuY3Rpb24oa2V5cykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkga2V5cyA9IGFTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2Yga2V5cyA9PT0gJ3N0cmluZycpIGtleXMgPSBba2V5c107XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkga2V5cyA9IFtdO1xuXG4gICAga2V5cyA9IGtleXMubWFwKFN0cmluZyk7XG5cbiAgICB2YXIgb2JqID0gT2JqZWN0KHRoaXMub2JqKTtcblxuICAgIC8vIGZpcnN0IGNoZWNrIGlmIHNvbWUga2V5cyBhcmUgbWlzc2luZ1xuICAgIHZhciBtaXNzaW5nS2V5cyA9IFtdO1xuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLm9iaiwga2V5KSlcbiAgICAgICAgbWlzc2luZ0tleXMucHVzaCh1dGlsLmZvcm1hdFByb3Aoa2V5KSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvLyBzZWNvbmQgY2hlY2sgZm9yIGV4dHJhIGtleXNcbiAgICB2YXIgZXh0cmFLZXlzID0gW107XG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGtleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuICAgICAgICBleHRyYUtleXMucHVzaCh1dGlsLmZvcm1hdFByb3Aoa2V5KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgdmVyYiA9IGtleXMubGVuZ3RoID09PSAwID8gJ3RvIGJlIGVtcHR5JyA6XG4gICAgJ3RvIGhhdmUgJyArIChrZXlzLmxlbmd0aCA9PT0gMSA/ICdrZXkgJyA6ICdrZXlzICcpO1xuXG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6IHZlcmIgKyBrZXlzLm1hcCh1dGlsLmZvcm1hdFByb3ApLmpvaW4oJywgJyl9O1xuXG4gICAgaWYgKG1pc3NpbmdLZXlzLmxlbmd0aCA+IDApXG4gICAgICB0aGlzLnBhcmFtcy5vcGVyYXRvciArPSAnXFxuXFx0bWlzc2luZyBrZXlzOiAnICsgbWlzc2luZ0tleXMuam9pbignLCAnKTtcblxuICAgIGlmIChleHRyYUtleXMubGVuZ3RoID4gMClcbiAgICAgIHRoaXMucGFyYW1zLm9wZXJhdG9yICs9ICdcXG5cXHRleHRyYSBrZXlzOiAnICsgZXh0cmFLZXlzLmpvaW4oJywgJyk7XG5cbiAgICB0aGlzLmFzc2VydChtaXNzaW5nS2V5cy5sZW5ndGggPT09IDAgJiYgZXh0cmFLZXlzLmxlbmd0aCA9PT0gMCk7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcyhcImtleXNcIiwgXCJrZXlcIik7XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGhhcyBuZXN0ZWQgcHJvcGVydHkgaW4gZGVwdGggYnkgcGF0aC4gKipPbiBzdWNjZXNzIGl0IGNoYW5nZSBnaXZlbiBvYmplY3QgdG8gYmUgdmFsdWUgb2YgZmluYWwgcHJvcGVydHkqKi5cbiAgICpcbiAgICogQG5hbWUgcHJvcGVydHlCeVBhdGhcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7QXJyYXl8Li4uc3RyaW5nfSBwcm9wZXJ0aWVzIFByb3BlcnRpZXMgcGF0aCB0byBzZWFyY2hcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKHsgYToge2I6IDEwfX0pLnNob3VsZC5oYXZlLnByb3BlcnR5QnlQYXRoKCdhJywgJ2InKS5lcWwoMTApO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgncHJvcGVydHlCeVBhdGgnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSBwcm9wZXJ0aWVzID0gYVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBwcm9wZXJ0aWVzID09ICdzdHJpbmcnKSBwcm9wZXJ0aWVzID0gW3Byb3BlcnRpZXNdO1xuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHByb3BlcnRpZXMgPSBbXTtcblxuICAgIHZhciBhbGxQcm9wcyA9IHByb3BlcnRpZXMubWFwKHV0aWwuZm9ybWF0UHJvcCk7XG5cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5tYXAoU3RyaW5nKTtcblxuICAgIHZhciBvYmogPSBzaG91bGQoT2JqZWN0KHRoaXMub2JqKSk7XG5cbiAgICB2YXIgZm91bmRQcm9wZXJ0aWVzID0gW107XG5cbiAgICB2YXIgY3VycmVudFByb3BlcnR5O1xuICAgIHdoaWxlIChwcm9wZXJ0aWVzLmxlbmd0aCkge1xuICAgICAgY3VycmVudFByb3BlcnR5ID0gcHJvcGVydGllcy5zaGlmdCgpO1xuICAgICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBoYXZlIHByb3BlcnR5IGJ5IHBhdGggJyArIGFsbFByb3BzLmpvaW4oJywgJykgKyAnIC0gZmFpbGVkIG9uICcgKyB1dGlsLmZvcm1hdFByb3AoY3VycmVudFByb3BlcnR5KX07XG4gICAgICBvYmogPSBvYmouaGF2ZS5wcm9wZXJ0eShjdXJyZW50UHJvcGVydHkpO1xuICAgICAgZm91bmRQcm9wZXJ0aWVzLnB1c2goY3VycmVudFByb3BlcnR5KTtcbiAgICB9XG5cbiAgICB0aGlzLnBhcmFtcyA9IHtvYmo6IHRoaXMub2JqLCBvcGVyYXRvcjogJ3RvIGhhdmUgcHJvcGVydHkgYnkgcGF0aCAnICsgYWxsUHJvcHMuam9pbignLCAnKX07XG5cbiAgICB0aGlzLm9iaiA9IG9iai5vYmo7XG4gIH0pO1xufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBzdHJpbmcgc3RhcnRzIHdpdGggcHJlZml4XG4gICAqIEBuYW1lIHN0YXJ0V2l0aFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gc3RyaW5nc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFByZWZpeFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICdhYmMnLnNob3VsZC5zdGFydFdpdGgoJ2EnKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ3N0YXJ0V2l0aCcsIGZ1bmN0aW9uKHN0ciwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBzdGFydCB3aXRoICcgKyBzaG91bGQuZm9ybWF0KHN0ciksIG1lc3NhZ2U6IGRlc2NyaXB0aW9uIH07XG5cbiAgICB0aGlzLmFzc2VydCgwID09PSB0aGlzLm9iai5pbmRleE9mKHN0cikpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIHN0cmluZyBlbmRzIHdpdGggcHJlZml4XG4gICAqIEBuYW1lIGVuZFdpdGhcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHN0cmluZ3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBQcmVmaXhcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAnYWJjYScuc2hvdWxkLmVuZFdpdGgoJ2EnKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2VuZFdpdGgnLCBmdW5jdGlvbihzdHIsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gZW5kIHdpdGggJyArIHNob3VsZC5mb3JtYXQoc3RyKSwgbWVzc2FnZTogZGVzY3JpcHRpb24gfTtcblxuICAgIHRoaXMuYXNzZXJ0KHRoaXMub2JqLmluZGV4T2Yoc3RyLCB0aGlzLm9iai5sZW5ndGggLSBzdHIubGVuZ3RoKSA+PSAwKTtcbiAgfSk7XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgbnVtYmVyXG4gICAqIEBuYW1lIE51bWJlclxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ051bWJlcicsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYSBudW1iZXInfTtcblxuICAgIHRoaXMuaGF2ZS50eXBlKCdudW1iZXInKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgYXJndW1lbnRzXG4gICAqIEBuYW1lIGFyZ3VtZW50c1xuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI0FyZ3VtZW50c1xuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2FyZ3VtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYXJndW1lbnRzJ307XG5cbiAgICB0aGlzLmhhdmUuY2xhc3MoJ0FyZ3VtZW50cycpO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2FyZ3VtZW50cycsICdBcmd1bWVudHMnKTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBoYXMgc29tZSB0eXBlIHVzaW5nIGB0eXBlb2ZgXG4gICAqIEBuYW1lIHR5cGVcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUeXBlIG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCd0eXBlJywgZnVuY3Rpb24odHlwZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGhhdmUgdHlwZSAnICsgdHlwZSwgbWVzc2FnZTogZGVzY3JpcHRpb259O1xuXG4gICAgc2hvdWxkKHR5cGVvZiB0aGlzLm9iaikuYmUuZXhhY3RseSh0eXBlKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgaW5zdGFuY2Ugb2YgYGNvbnN0cnVjdG9yYFxuICAgKiBAbmFtZSBpbnN0YW5jZW9mXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jaW5zdGFuY2VPZlxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnaW5zdGFuY2VvZicsIGZ1bmN0aW9uKGNvbnN0cnVjdG9yLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYW4gaW5zdGFuY2Ugb2YgJyArIHV0aWwuZnVuY3Rpb25OYW1lKGNvbnN0cnVjdG9yKSwgbWVzc2FnZTogZGVzY3JpcHRpb259O1xuXG4gICAgdGhpcy5hc3NlcnQoT2JqZWN0KHRoaXMub2JqKSBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yKTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKCdpbnN0YW5jZW9mJywgJ2luc3RhbmNlT2YnKTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBmdW5jdGlvblxuICAgKiBAbmFtZSBGdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ0Z1bmN0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBhIGZ1bmN0aW9uJ307XG5cbiAgICB0aGlzLmhhdmUudHlwZSgnZnVuY3Rpb24nKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgb2JqZWN0XG4gICAqIEBuYW1lIE9iamVjdFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ09iamVjdCcsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYW4gb2JqZWN0J307XG5cbiAgICB0aGlzLmlzLm5vdC5udWxsKCkuYW5kLmhhdmUudHlwZSgnb2JqZWN0Jyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIHN0cmluZ1xuICAgKiBAbmFtZSBTdHJpbmdcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdTdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGEgc3RyaW5nJ307XG5cbiAgICB0aGlzLmhhdmUudHlwZSgnc3RyaW5nJyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIGFycmF5XG4gICAqIEBuYW1lIEFycmF5XG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnQXJyYXknLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGFuIGFycmF5J307XG5cbiAgICB0aGlzLmhhdmUuY2xhc3MoJ0FycmF5Jyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIGJvb2xlYW5cbiAgICogQG5hbWUgQm9vbGVhblxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ0Jvb2xlYW4nLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGEgYm9vbGVhbid9O1xuXG4gICAgdGhpcy5oYXZlLnR5cGUoJ2Jvb2xlYW4nKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgZXJyb3JcbiAgICogQG5hbWUgRXJyb3JcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdFcnJvcicsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYW4gZXJyb3InfTtcblxuICAgIHRoaXMuaGF2ZS5pbnN0YW5jZU9mKEVycm9yKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgYSBkYXRlXG4gICAqIEBuYW1lIERhdGVcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdEYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBhIGRhdGUnfTtcblxuICAgIHRoaXMuaGF2ZS5pbnN0YW5jZU9mKERhdGUpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBudWxsXG4gICAqIEBuYW1lIG51bGxcbiAgICogQGFsaWFzIEFzc2VydGlvbiNOdWxsXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnbnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgbnVsbCd9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmogPT09IG51bGwpO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ251bGwnLCAnTnVsbCcpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGhhcyBzb21lIGludGVybmFsIFtbQ2xhc3NdXSwgdmlhIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgY2FsbFxuICAgKiBAbmFtZSBjbGFzc1xuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI0NsYXNzXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnY2xhc3MnLCBmdW5jdGlvbihjbHMpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGhhdmUgW1tDbGFzc11dICcgKyBjbHN9O1xuXG4gICAgdGhpcy5hc3NlcnQoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaXMub2JqKSA9PT0gJ1tvYmplY3QgJyArIGNscyArICddJyk7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygnY2xhc3MnLCAnQ2xhc3MnKTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyB1bmRlZmluZWRcbiAgICogQG5hbWUgdW5kZWZpbmVkXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jVW5kZWZpbmVkXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgndW5kZWZpbmVkJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSB1bmRlZmluZWQnfTtcblxuICAgIHRoaXMuYXNzZXJ0KHRoaXMub2JqID09PSB2b2lkIDApO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ3VuZGVmaW5lZCcsICdVbmRlZmluZWQnKTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBzdXBwb3J0cyBlczYgaXRlcmFibGUgcHJvdG9jb2wgKGp1c3QgY2hlY2tcbiAgICogdGhhdCBvYmplY3QgaGFzIHByb3BlcnR5IFN5bWJvbC5pdGVyYXRvciwgd2hpY2ggaXMgYSBmdW5jdGlvbilcbiAgICogQG5hbWUgaXRlcmFibGVcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGVzNlxuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnaXRlcmFibGUnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGl0ZXJhYmxlJ307XG5cbiAgICBzaG91bGQodGhpcy5vYmopLmhhdmUucHJvcGVydHkoU3ltYm9sLml0ZXJhdG9yKS53aGljaC5pcy5hLkZ1bmN0aW9uKCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IHN1cHBvcnRzIGVzNiBpdGVyYXRvciBwcm90b2NvbCAoanVzdCBjaGVja1xuICAgKiB0aGF0IG9iamVjdCBoYXMgcHJvcGVydHkgbmV4dCwgd2hpY2ggaXMgYSBmdW5jdGlvbilcbiAgICogQG5hbWUgaXRlcmF0b3JcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGVzNlxuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnaXRlcmF0b3InLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGl0ZXJhdG9yJ307XG5cbiAgICBzaG91bGQodGhpcy5vYmopLmhhdmUucHJvcGVydHkoJ25leHQnKS53aGljaC5pcy5hLkZ1bmN0aW9uKCk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIGEgZ2VuZXJhdG9yIG9iamVjdFxuICAgKiBAbmFtZSBnZW5lcmF0b3JcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGVzNlxuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnZ2VuZXJhdG9yJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBnZW5lcmF0b3InfTtcblxuICAgIHNob3VsZCh0aGlzLm9iaikuYmUuaXRlcmFibGVcbiAgICAgIC5hbmQuaXRlcmF0b3JcbiAgICAgIC5hbmQuaXQuaXMuZXF1YWwodGhpcy5vYmpbU3ltYm9sLml0ZXJhdG9yXSgpKTtcbiAgfSk7XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vKipcbiAqIE91ciBmdW5jdGlvbiBzaG91bGRcbiAqXG4gKiBAcGFyYW0geyp9IG9iaiBPYmplY3QgdG8gYXNzZXJ0XG4gKiBAcmV0dXJucyB7c2hvdWxkLkFzc2VydGlvbn0gUmV0dXJucyBuZXcgQXNzZXJ0aW9uIGZvciBiZWdpbm5pbmcgYXNzZXJ0aW9uIGNoYWluXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBzaG91bGQgPSByZXF1aXJlKCdzaG91bGQnKTtcbiAqIHNob3VsZCgnYWJjJykuYmUuYS5TdHJpbmcoKTtcbiAqL1xuZnVuY3Rpb24gc2hvdWxkKG9iaikge1xuICByZXR1cm4gKG5ldyBzaG91bGQuQXNzZXJ0aW9uKG9iaikpO1xufVxuXG5zaG91bGQuQXNzZXJ0aW9uRXJyb3IgPSByZXF1aXJlKCcuL2Fzc2VydGlvbi1lcnJvcicpO1xuc2hvdWxkLkFzc2VydGlvbiA9IHJlcXVpcmUoJy4vYXNzZXJ0aW9uJyk7XG5cbnNob3VsZC5mb3JtYXQgPSB1dGlsLmZvcm1hdDtcbnNob3VsZC50eXBlID0gcmVxdWlyZSgnc2hvdWxkLXR5cGUnKTtcbnNob3VsZC51dGlsID0gdXRpbDtcblxuLyoqXG4gKiBPYmplY3Qgd2l0aCBjb25maWd1cmF0aW9uLlxuICogSXQgY29udGFpbnMgc3VjaCBwcm9wZXJ0aWVzOlxuICogKiBgY2hlY2tQcm90b0VxbGAgYm9vbGVhbiAtIEFmZmVjdCBpZiBgLmVxbGAgd2lsbCBjaGVjayBvYmplY3RzIHByb3RvdHlwZXNcbiAqICogYHBsdXNaZXJvQW5kTWludXNaZXJvRXF1YWxgIGJvb2xlYW4gLSBBZmZlY3QgaWYgYC5lcWxgIHdpbGwgdHJlYXQgKzAgYW5kIC0wIGFzIGVxdWFsXG4gKiBBbHNvIGl0IGNhbiBjb250YWluIG9wdGlvbnMgZm9yIHNob3VsZC1mb3JtYXQuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEBzdGF0aWNcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGEgPSB7IGE6IDEwIH0sIGIgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICogYi5hID0gMTA7XG4gKlxuICogYS5zaG91bGQuYmUuZXFsKGIpO1xuICogLy9ub3QgdGhyb3dzXG4gKlxuICogc2hvdWxkLmNvbmZpZy5jaGVja1Byb3RvRXFsID0gdHJ1ZTtcbiAqIGEuc2hvdWxkLmJlLmVxbChiKTtcbiAqIC8vdGhyb3dzIEFzc2VydGlvbkVycm9yOiBleHBlY3RlZCB7IGE6IDEwIH0gdG8gZXF1YWwgeyBhOiAxMCB9IChiZWNhdXNlIEEgYW5kIEIgaGF2ZSBkaWZmZXJlbnQgcHJvdG90eXBlcylcbiAqL1xuc2hvdWxkLmNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbi8vIEV4cG9zZSBzaG91bGQgdG8gZXh0ZXJuYWwgd29ybGQuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBzaG91bGQ7XG5cbi8qKlxuICogQWxsb3cgdG8gZXh0ZW5kIGdpdmVuIHByb3RvdHlwZSB3aXRoIHNob3VsZCBwcm9wZXJ0eSB1c2luZyBnaXZlbiBuYW1lLiBUaGlzIGdldHRlciB3aWxsICoqdW53cmFwKiogYWxsIHN0YW5kYXJkIHdyYXBwZXJzIGxpa2UgYE51bWJlcmAsIGBCb29sZWFuYCwgYFN0cmluZ2AuXG4gKiBVc2luZyBgc2hvdWxkKG9iailgIGlzIHRoZSBlcXVpdmFsZW50IG9mIHVzaW5nIGBvYmouc2hvdWxkYCB3aXRoIGtub3duIGlzc3VlcyAobGlrZSBudWxscyBhbmQgbWV0aG9kIGNhbGxzIGV0YykuXG4gKlxuICogVG8gYWRkIG5ldyBhc3NlcnRpb25zLCBuZWVkIHRvIHVzZSBBc3NlcnRpb24uYWRkIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnR5TmFtZV0gTmFtZSBvZiBwcm9wZXJ0eSB0byBhZGQuIERlZmF1bHQgaXMgYCdzaG91bGQnYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvdG9dIFByb3RvdHlwZSB0byBleHRlbmQgd2l0aC4gRGVmYXVsdCBpcyBgT2JqZWN0LnByb3RvdHlwZWAuXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAcmV0dXJucyB7eyBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0b3I6IE9iamVjdCwgcHJvdG86IE9iamVjdCB9fSBEZXNjcmlwdG9yIGVub3VnaCB0byByZXR1cm4gYWxsIGJhY2tcbiAqIEBzdGF0aWNcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHByZXYgPSBzaG91bGQuZXh0ZW5kKCdtdXN0JywgT2JqZWN0LnByb3RvdHlwZSk7XG4gKlxuICogJ2FiYycubXVzdC5zdGFydFdpdGgoJ2EnKTtcbiAqXG4gKiB2YXIgc2hvdWxkID0gc2hvdWxkLm5vQ29uZmxpY3QocHJldik7XG4gKiBzaG91bGQubm90LmV4aXN0KE9iamVjdC5wcm90b3R5cGUubXVzdCk7XG4gKi9cbnNob3VsZC5leHRlbmQgPSBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIHByb3RvKSB7XG4gIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZSB8fCAnc2hvdWxkJztcbiAgcHJvdG8gPSBwcm90byB8fCBPYmplY3QucHJvdG90eXBlO1xuXG4gIHZhciBwcmV2RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIHByb3BlcnR5TmFtZSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBwcm9wZXJ0eU5hbWUsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzaG91bGQodXRpbC5pc1dyYXBwZXJUeXBlKHRoaXMpID8gdGhpcy52YWx1ZU9mKCkgOiB0aGlzKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICByZXR1cm4geyBuYW1lOiBwcm9wZXJ0eU5hbWUsIGRlc2NyaXB0b3I6IHByZXZEZXNjcmlwdG9yLCBwcm90bzogcHJvdG8gfTtcbn07XG5cbi8qKlxuICogRGVsZXRlIHByZXZpb3VzIGV4dGVuc2lvbi4gSWYgYGRlc2NgIG1pc3NpbmcgaXQgd2lsbCByZW1vdmUgZGVmYXVsdCBleHRlbnNpb24uXG4gKlxuICogQHBhcmFtIHt7IG5hbWU6IHN0cmluZywgZGVzY3JpcHRvcjogT2JqZWN0LCBwcm90bzogT2JqZWN0IH19IFtkZXNjXSBSZXR1cm5lZCBmcm9tIGBzaG91bGQuZXh0ZW5kYCBvYmplY3RcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBzaG91bGQgZnVuY3Rpb25cbiAqIEBzdGF0aWNcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHNob3VsZCA9IHJlcXVpcmUoJ3Nob3VsZCcpLm5vQ29uZmxpY3QoKTtcbiAqXG4gKiBzaG91bGQoT2JqZWN0LnByb3RvdHlwZSkubm90LmhhdmUucHJvcGVydHkoJ3Nob3VsZCcpO1xuICpcbiAqIHZhciBwcmV2ID0gc2hvdWxkLmV4dGVuZCgnbXVzdCcsIE9iamVjdC5wcm90b3R5cGUpO1xuICogJ2FiYycubXVzdC5zdGFydFdpdGgoJ2EnKTtcbiAqIHNob3VsZC5ub0NvbmZsaWN0KHByZXYpO1xuICpcbiAqIHNob3VsZChPYmplY3QucHJvdG90eXBlKS5ub3QuaGF2ZS5wcm9wZXJ0eSgnbXVzdCcpO1xuICovXG5zaG91bGQubm9Db25mbGljdCA9IGZ1bmN0aW9uKGRlc2MpIHtcbiAgZGVzYyA9IGRlc2MgfHwgc2hvdWxkLl9wcmV2U2hvdWxkO1xuXG4gIGlmIChkZXNjKSB7XG4gICAgZGVsZXRlIGRlc2MucHJvdG9bZGVzYy5uYW1lXTtcblxuICAgIGlmIChkZXNjLmRlc2NyaXB0b3IpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXNjLnByb3RvLCBkZXNjLm5hbWUsIGRlc2MuZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBzaG91bGQ7XG59O1xuXG4vKipcbiAqIFNpbXBsZSB1dGlsaXR5IGZ1bmN0aW9uIGZvciBhIGJpdCBtb3JlIGVhc2llciBzaG91bGQgYXNzZXJ0aW9uIGV4dGVuc2lvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZiBTbyBjYWxsZWQgcGx1Z2luIGZ1bmN0aW9uLiBJdCBzaG91bGQgYWNjZXB0IDIgYXJndW1lbnRzOiBgc2hvdWxkYCBmdW5jdGlvbiBhbmQgYEFzc2VydGlvbmAgY29uc3RydWN0b3JcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgc2hvdWxkYCBmdW5jdGlvblxuICogQHN0YXRpY1xuICogQGV4YW1wbGVcbiAqXG4gKiBzaG91bGQudXNlKGZ1bmN0aW9uKHNob3VsZCwgQXNzZXJ0aW9uKSB7XG4gKiAgIEFzc2VydGlvbi5hZGQoJ2Fzc2V0JywgZnVuY3Rpb24oKSB7XG4gKiAgICAgIHRoaXMucGFyYW1zID0geyBvcGVyYXRvcjogJ3RvIGJlIGFzc2V0JyB9O1xuICpcbiAqICAgICAgdGhpcy5vYmouc2hvdWxkLmhhdmUucHJvcGVydHkoJ2lkJykud2hpY2guaXMuYS5OdW1iZXIoKTtcbiAqICAgICAgdGhpcy5vYmouc2hvdWxkLmhhdmUucHJvcGVydHkoJ3BhdGgnKTtcbiAqICB9KVxuICogfSlcbiAqL1xuc2hvdWxkLnVzZSA9IGZ1bmN0aW9uKGYpIHtcbiAgZihzaG91bGQsIHNob3VsZC5Bc3NlcnRpb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnNob3VsZFxuICAudXNlKHJlcXVpcmUoJy4vZXh0L2Fzc2VydCcpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L2NoYWluJykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvYm9vbCcpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L251bWJlcicpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L2VxbCcpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L3R5cGUnKSlcbiAgLnVzZShyZXF1aXJlKCcuL2V4dC9zdHJpbmcnKSlcbiAgLnVzZShyZXF1aXJlKCcuL2V4dC9wcm9wZXJ0eScpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L2Vycm9yJykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvbWF0Y2gnKSlcbiAgLnVzZShyZXF1aXJlKCcuL2V4dC9jb250YWluJykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvcHJvbWlzZScpKTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciB0eXBlID0gcmVxdWlyZSgnc2hvdWxkLXR5cGUnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG4vKipcbiAqIENoZWNrIGlmIGdpdmVuIG9iaiBqdXN0IGEgcHJpbWl0aXZlIHR5cGUgd3JhcHBlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLmlzV3JhcHBlclR5cGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE51bWJlciB8fCBvYmogaW5zdGFuY2VvZiBTdHJpbmcgfHwgb2JqIGluc3RhbmNlb2YgQm9vbGVhbjtcbn07XG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gIGlmIChhICYmIGIpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYTtcbn07XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmV4cG9ydHMuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2gob2JqLCBmLCBjb250ZXh0KSB7XG4gIGlmIChleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob2JqKSkge1xuICAgIHJldHVybiBmb3JFYWNoKG9iaigpLCBmLCBjb250ZXh0KTtcbiAgfSBlbHNlIGlmIChleHBvcnRzLmlzR2VuZXJhdG9yT2JqZWN0KG9iaikpIHtcbiAgICB2YXIgdmFsdWUgPSBvYmoubmV4dCgpO1xuICAgIHdoaWxlICghdmFsdWUuZG9uZSkge1xuICAgICAgaWYgKGYuY2FsbChjb250ZXh0LCB2YWx1ZS52YWx1ZSwgJ3ZhbHVlJywgb2JqKSA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybjtcbiAgICAgIHZhbHVlID0gb2JqLm5leHQoKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcbiAgICAgICAgaWYgKGYuY2FsbChjb250ZXh0LCBvYmpbcHJvcF0sIHByb3AsIG9iaikgPT09IGZhbHNlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuc29tZSA9IGZ1bmN0aW9uKG9iaiwgZiwgY29udGV4dCkge1xuICB2YXIgcmVzID0gZmFsc2U7XG4gIGV4cG9ydHMuZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoZi5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIG9iaikpIHtcbiAgICAgIHJlcyA9IHRydWU7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LCBjb250ZXh0KTtcbiAgcmV0dXJuIHJlcztcbn07XG5cbmV4cG9ydHMuaXNFbXB0eU9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnRzLmlzSW5kZXhhYmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciB0ID0gdHlwZShvYmopO1xuICByZXR1cm4gKHQudHlwZSA9PT0gdHlwZS5PQkpFQ1QgJiYgdC5jbHMgPT09IHR5cGUuQVJSQVkpIHx8XG4gICAodC50eXBlID09PSB0eXBlLk9CSkVDVCAmJiB0LmNscyA9PT0gdHlwZS5CVUZGRVIpIHx8XG4gICAodC50eXBlID09PSB0eXBlLk9CSkVDVCAmJiB0LmNscyA9PT0gdHlwZS5BUkdVTUVOVFMpIHx8XG4gICAodC50eXBlID09PSB0eXBlLk9CSkVDVCAmJiB0LmNscyA9PT0gdHlwZS5BUlJBWV9CVUZGRVIpIHx8XG4gICAodC50eXBlID09PSB0eXBlLk9CSkVDVCAmJiB0LmNscyA9PT0gdHlwZS5UWVBFRF9BUlJBWSkgfHxcbiAgICh0LnR5cGUgPT09IHR5cGUuT0JKRUNUICYmIHQuY2xzID09PSB0eXBlLkRBVEFfVklFVykgfHxcbiAgICh0LnR5cGUgPT09IHR5cGUuT0JKRUNUICYmIHQuY2xzID09PSB0eXBlLlNUUklORykgfHxcbiAgICh0LnR5cGUgPT09IHR5cGUuU1RSSU5HKTtcbn07XG5cbmV4cG9ydHMubGVuZ3RoID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciB0ID0gdHlwZShvYmopO1xuICBzd2l0Y2ggKHQudHlwZSkge1xuICAgIGNhc2UgdHlwZS5TVFJJTkc6XG4gICAgICByZXR1cm4gb2JqLmxlbmd0aDtcbiAgICBjYXNlIHR5cGUuT0JKRUNUOlxuICAgICAgc3dpdGNoICh0LmNscykge1xuICAgICAgICBjYXNlIHR5cGUuQVJSQVlfQlVGRkVSOlxuICAgICAgICBjYXNlIHR5cGUuVFlQRURfQVJSQVk6XG4gICAgICAgIGNhc2UgdHlwZS5EQVRBX1ZJRVc6XG4gICAgICAgICAgcmV0dXJuIG9iai5ieXRlTGVuZ3RoO1xuXG4gICAgICAgIGNhc2UgdHlwZS5BUlJBWTpcbiAgICAgICAgY2FzZSB0eXBlLkJVRkZFUjpcbiAgICAgICAgY2FzZSB0eXBlLkFSR1VNRU5UUzpcbiAgICAgICAgY2FzZSB0eXBlLkZVTkNUSU9OOlxuICAgICAgICAgIHJldHVybiBvYmoubGVuZ3RoO1xuICAgICAgfVxuICB9XG59O1xuXG5leHBvcnRzLmNvbnZlcnRQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSA9PSAnc3ltYm9sJykge1xuICAgIHJldHVybiBuYW1lO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBTdHJpbmcobmFtZSk7XG4gIH1cbn07XG5cbmV4cG9ydHMuaXNHZW5lcmF0b3JPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKCFvYmopIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gdHlwZW9mIG9iai5uZXh0ID09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICB0eXBlb2Ygb2JqW1N5bWJvbC5pdGVyYXRvcl0gPT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgIG9ialtTeW1ib2wuaXRlcmF0b3JdKCkgPT09IG9iajtcbn07XG5cbi8vVE9ETyBmaW5kIGJldHRlciB3YXlcbmV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKHR5cGVvZiBmICE9ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gL15mdW5jdGlvblxccypcXCpcXHMqLy50ZXN0KGYudG9TdHJpbmcoKSk7XG59O1xuXG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKHZhbHVlLCBvcHRzKSB7XG4gIHJldHVybiBjb25maWcuZ2V0Rm9ybWF0dGVyKG9wdHMpLmZvcm1hdCh2YWx1ZSk7XG59O1xuXG5leHBvcnRzLmZ1bmN0aW9uTmFtZSA9IHJlcXVpcmUoJ3Nob3VsZC1mb3JtYXQnKS5Gb3JtYXR0ZXIuZnVuY3Rpb25OYW1lO1xuXG5leHBvcnRzLmZvcm1hdFByb3AgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gY29uZmlnLmdldEZvcm1hdHRlcigpLmZvcm1hdFByb3BlcnR5TmFtZShTdHJpbmcodmFsdWUpKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvcm1hdChtc2cpIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIGZvcih2YXIgaSA9IDEsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIG1zZyA9IG1zZy5yZXBsYWNlKC8lcy8sIGFyZ3NbaV0pO1xuICB9XG4gIHJldHVybiBtc2c7XG59XG4iLCJ2YXIgZ2V0VHlwZSA9IHJlcXVpcmUoJ3Nob3VsZC10eXBlJyk7XG52YXIgZm9ybWF0ID0gcmVxdWlyZSgnLi9mb3JtYXQnKTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIG1ha2VSZXN1bHQociwgcGF0aCwgcmVhc29uLCBhLCBiKSB7XG4gIHZhciBvID0ge3Jlc3VsdDogcn07XG4gIGlmKCFyKSB7XG4gICAgby5wYXRoID0gcGF0aDtcbiAgICBvLnJlYXNvbiA9IHJlYXNvbjtcbiAgICBvLmEgPSBhO1xuICAgIG8uYiA9IGI7XG4gIH1cbiAgcmV0dXJuIG87XG59XG5cbnZhciBFUVVBTFMgPSBtYWtlUmVzdWx0KHRydWUpO1xuXG5mdW5jdGlvbiB0eXBlVG9TdHJpbmcodCkge1xuICByZXR1cm4gdC50eXBlICsgKHQuY2xzID8gJygnICsgdC5jbHMgKyAodC5zdWIgPyAnICcgKyB0LnN1YiA6ICcnKSArICcpJyA6ICcnKTtcbn1cblxuXG5cbnZhciBSRUFTT04gPSB7XG4gIFBMVVNfMF9BTkRfTUlOVVNfMDogJyswIGlzIG5vdCBlcXVhbCB0byAtMCcsXG4gIERJRkZFUkVOVF9UWVBFUzogJ0EgaGFzIHR5cGUgJXMgYW5kIEIgaGFzIHR5cGUgJXMnLFxuICBOQU5fTlVNQkVSOiAnTmFOIGlzIG5vdCBlcXVhbCB0byBhbnkgbnVtYmVyJyxcbiAgRVFVQUxJVFk6ICdBIGlzIG5vdCBlcXVhbCB0byBCJyxcbiAgRVFVQUxJVFlfUFJPVE9UWVBFOiAnQSBhbmQgQiBoYXZlIGRpZmZlcmVudCBwcm90b3R5cGVzJyxcbiAgV1JBUFBFRF9WQUxVRTogJ0Egd3JhcHBlZCB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gQiB3cmFwcGVkIHZhbHVlJyxcbiAgRlVOQ1RJT05fU09VUkNFUzogJ2Z1bmN0aW9uIEEgaXMgbm90IGVxdWFsIHRvIEIgYnkgc291cmNlIGNvZGUgdmFsdWUgKHZpYSAudG9TdHJpbmcgY2FsbCknLFxuICBNSVNTSU5HX0tFWTogJyVzIGhhcyBubyBrZXkgJXMnLFxuICBDSVJDVUxBUl9WQUxVRVM6ICdBIGhhcyBjaXJjdWxhciByZWZlcmVuY2UgdGhhdCB3YXMgdmlzaXRlZCBub3QgaW4gdGhlIHNhbWUgdGltZSBhcyBCJyxcbiAgU0VUX01BUF9NSVNTSU5HX0tFWTogJ1NldC9NYXAgbWlzc2luZyBrZXknLFxuICBNQVBfVkFMVUVfRVFVQUxJVFk6ICdWYWx1ZXMgb2YgdGhlIHNhbWUga2V5IGluIEEgYW5kIEIgaXMgbm90IGVxdWFsJ1xufTtcblxuXG5mdW5jdGlvbiBlcUludGVybmFsKGEsIGIsIG9wdHMsIHN0YWNrQSwgc3RhY2tCLCBwYXRoLCBmYWlscykge1xuICB2YXIgciA9IEVRVUFMUztcblxuICBmdW5jdGlvbiByZXN1bHQoY29tcGFyaXNvbiwgcmVhc29uKSB7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIHJlYXNvbiA9IGZvcm1hdC5hcHBseShudWxsLCBbcmVhc29uXS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgICB2YXIgcmVzID0gbWFrZVJlc3VsdChjb21wYXJpc29uLCBwYXRoLCByZWFzb24sIGEsIGIpO1xuICAgIGlmKCFjb21wYXJpc29uICYmIG9wdHMuY29sbGVjdEFsbEZhaWxzKSB7XG4gICAgICBmYWlscy5wdXNoKHJlcyk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja1Byb3BlcnR5RXF1YWxpdHkocHJvcGVydHkpIHtcbiAgICByZXR1cm4gZXFJbnRlcm5hbChhW3Byb3BlcnR5XSwgYltwcm9wZXJ0eV0sIG9wdHMsIHN0YWNrQSwgc3RhY2tCLCBwYXRoLmNvbmNhdChbcHJvcGVydHldKSwgZmFpbHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBbHNvKGExLCBiMSkge1xuICAgIHJldHVybiBlcUludGVybmFsKGExLCBiMSwgb3B0cywgc3RhY2tBLCBzdGFja0IsIHBhdGgsIGZhaWxzKTtcbiAgfVxuXG4gIC8vIGVxdWFsIGEgYW5kIGIgZXhpdCBlYXJseVxuICBpZihhID09PSBiKSB7XG4gICAgLy8gY2hlY2sgZm9yICswICE9PSAtMDtcbiAgICByZXR1cm4gcmVzdWx0KGEgIT09IDAgfHwgKDEgLyBhID09IDEgLyBiKSB8fCBvcHRzLnBsdXNaZXJvQW5kTWludXNaZXJvRXF1YWwsIFJFQVNPTi5QTFVTXzBfQU5EX01JTlVTXzApO1xuICB9XG5cbiAgdmFyIGwsIHA7XG5cbiAgdmFyIHR5cGVBID0gZ2V0VHlwZShhKSxcbiAgICB0eXBlQiA9IGdldFR5cGUoYik7XG5cbiAgdmFyIGtleTtcblxuICAvLyBpZiBvYmplY3RzIGhhcyBkaWZmZXJlbnQgdHlwZXMgdGhleSBhcmUgbm90IGVxdWFsXG4gIHZhciB0eXBlRGlmZmVyZW50ID0gdHlwZUEudHlwZSAhPT0gdHlwZUIudHlwZSB8fCB0eXBlQS5jbHMgIT09IHR5cGVCLmNscztcblxuICBpZih0eXBlRGlmZmVyZW50IHx8ICgob3B0cy5jaGVja1N1YlR5cGUgJiYgdHlwZUEuc3ViICE9PSB0eXBlQi5zdWIpIHx8ICFvcHRzLmNoZWNrU3ViVHlwZSkpIHtcbiAgICByZXR1cm4gcmVzdWx0KGZhbHNlLCBSRUFTT04uRElGRkVSRU5UX1RZUEVTLCB0eXBlVG9TdHJpbmcodHlwZUEpLCB0eXBlVG9TdHJpbmcodHlwZUIpKTtcbiAgfVxuXG4gIC8vZWFybHkgY2hlY2tzIGZvciB0eXBlc1xuICBzd2l0Y2godHlwZUEudHlwZSkge1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAvLyBOYU4gIT09IE5hTlxuICAgICAgcmV0dXJuIChhICE9PSBhKSA/IHJlc3VsdChiICE9PSBiLCBSRUFTT04uTkFOX05VTUJFUilcbiAgICAgICAgOiByZXN1bHQoYSA9PT0gYiwgUkVBU09OLkVRVUFMSVRZKTtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gcmVzdWx0KGEgPT09IGIsIFJFQVNPTi5FUVVBTElUWSk7XG5cbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAvLyBmdW5jdGlvbnMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBjb2RlXG4gICAgICByID0gY2hlY2tBbHNvKGEudG9TdHJpbmcoKSwgYi50b1N0cmluZygpKTtcbiAgICAgIGlmKCFyLnJlc3VsdCkge1xuICAgICAgICByLnJlYXNvbiA9IFJFQVNPTi5GVU5DVElPTl9TT1VSQ0VTO1xuICAgICAgICBpZighb3B0cy5jb2xsZWN0QWxsRmFpbHMpIHJldHVybiByO1xuICAgICAgfVxuXG4gICAgICBicmVhazsvL2NoZWNrIHVzZXIgcHJvcGVydGllc1xuXG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIC8vIGFkZGl0aW9uYWwgY2hlY2tzIGZvciBvYmplY3QgaW5zdGFuY2VzXG4gICAgICBzd2l0Y2godHlwZUEuY2xzKSB7XG4gICAgICAgIC8vIGNoZWNrIHJlZ2V4cCBmbGFnc1xuICAgICAgICAvLyBUT0RPIGFkZCBlczYgZmxhZ3NcbiAgICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgICBwID0gWydzb3VyY2UnLCAnZ2xvYmFsJywgJ211bHRpbGluZScsICdsYXN0SW5kZXgnLCAnaWdub3JlQ2FzZSddO1xuICAgICAgICAgIHdoaWxlKHAubGVuZ3RoKSB7XG4gICAgICAgICAgICByID0gY2hlY2tQcm9wZXJ0eUVxdWFsaXR5KHAuc2hpZnQoKSk7XG4gICAgICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7Ly9jaGVjayB1c2VyIHByb3BlcnRpZXNcblxuICAgICAgICAvL2NoZWNrIGJ5IHRpbWVzdGFtcCBvbmx5ICh1c2luZyAudmFsdWVPZilcbiAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgaWYoK2EgIT09ICtiKSB7XG4gICAgICAgICAgICByID0gcmVzdWx0KGZhbHNlLCBSRUFTT04uRVFVQUxJVFkpO1xuICAgICAgICAgICAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrOy8vY2hlY2sgdXNlciBwcm9wZXJ0aWVzXG5cbiAgICAgICAgLy9wcmltaXRpdmUgdHlwZSB3cmFwcGVyc1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAvL2NoZWNrIHRoZWlyIGludGVybmFsIHZhbHVlXG4gICAgICAgICAgciA9IGNoZWNrQWxzbyhhLnZhbHVlT2YoKSwgYi52YWx1ZU9mKCkpO1xuICAgICAgICAgIGlmKCFyLnJlc3VsdCkge1xuICAgICAgICAgICAgci5yZWFzb24gPSBSRUFTT04uV1JBUFBFRF9WQUxVRTtcbiAgICAgICAgICAgIGlmKCFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrOy8vY2hlY2sgdXNlciBwcm9wZXJ0aWVzXG5cbiAgICAgICAgLy9ub2RlIGJ1ZmZlclxuICAgICAgICBjYXNlICdidWZmZXInOlxuICAgICAgICAgIC8vaWYgbGVuZ3RoIGRpZmZlcmVudCBpdCBpcyBvYnZpb3VzbHkgZGlmZmVyZW50XG4gICAgICAgICAgciA9IGNoZWNrUHJvcGVydHlFcXVhbGl0eSgnbGVuZ3RoJyk7XG4gICAgICAgICAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG5cbiAgICAgICAgICBsID0gYS5sZW5ndGg7XG4gICAgICAgICAgd2hpbGUobC0tKSB7XG4gICAgICAgICAgICByID0gY2hlY2tQcm9wZXJ0eUVxdWFsaXR5KGwpO1xuICAgICAgICAgICAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy93ZSBkbyBub3QgY2hlY2sgZm9yIHVzZXIgcHJvcGVydGllcyBiZWNhdXNlXG4gICAgICAgICAgLy9ub2RlIEJ1ZmZlciBoYXZlIHNvbWUgc3RyYW5nZSBoaWRkZW4gcHJvcGVydGllc1xuICAgICAgICAgIHJldHVybiBFUVVBTFM7XG5cbiAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgIC8vY2hlY2sgZGVmaW5lZCBwcm9wZXJ0aWVzXG4gICAgICAgICAgcCA9IFsnbmFtZScsICdtZXNzYWdlJ107XG4gICAgICAgICAgd2hpbGUocC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHIgPSBjaGVja1Byb3BlcnR5RXF1YWxpdHkocC5zaGlmdCgpKTtcbiAgICAgICAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIHJldHVybiByO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrOy8vY2hlY2sgdXNlciBwcm9wZXJ0aWVzXG5cbiAgICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICBjYXNlICdhcmd1bWVudHMnOlxuICAgICAgICBjYXNlICd0eXBlZC1hcnJheSc6XG4gICAgICAgICAgciA9IGNoZWNrUHJvcGVydHlFcXVhbGl0eSgnbGVuZ3RoJyk7XG4gICAgICAgICAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG5cbiAgICAgICAgICBicmVhazsvL2NoZWNrIHVzZXIgcHJvcGVydGllc1xuXG4gICAgICAgIGNhc2UgJ2FycmF5LWJ1ZmZlcic6XG4gICAgICAgICAgciA9IGNoZWNrUHJvcGVydHlFcXVhbGl0eSgnYnl0ZUxlbmd0aCcpO1xuICAgICAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIHJldHVybiByO1xuXG4gICAgICAgICAgYnJlYWs7Ly9jaGVjayB1c2VyIHByb3BlcnRpZXNcblxuICAgICAgICBjYXNlICdtYXAnOlxuICAgICAgICBjYXNlICdzZXQnOlxuICAgICAgICAgIHIgPSBjaGVja1Byb3BlcnR5RXF1YWxpdHkoJ3NpemUnKTtcbiAgICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcblxuICAgICAgICAgIHN0YWNrQS5wdXNoKGEpO1xuICAgICAgICAgIHN0YWNrQi5wdXNoKGIpO1xuXG4gICAgICAgICAgdmFyIGl0QSA9IGEuZW50cmllcygpO1xuICAgICAgICAgIHZhciBuZXh0QSA9IGl0QS5uZXh0KCk7XG5cbiAgICAgICAgICB3aGlsZSghbmV4dEEuZG9uZSkge1xuICAgICAgICAgICAga2V5ID0gbmV4dEEudmFsdWVbMF07XG4gICAgICAgICAgICAvL2ZpcnN0IGNoZWNrIGZvciBwcmltaXRpdmUga2V5IGlmIHdlIGNhbiBkbyBsaWdodCBjaGVja1xuICAgICAgICAgICAgLy91c2luZyAuaGFzIGFuZCAuZ2V0XG4gICAgICAgICAgICBpZihnZXRUeXBlKGtleSkudHlwZSAhPSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICBpZihiLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYodHlwZUEuY2xzID09ICdtYXAnKSB7XG4gICAgICAgICAgICAgICAgICAvL2ZvciBtYXAgd2UgYWxzbyBjaGVjayBpdHMgdmFsdWUgdG8gYmUgZXF1YWxcbiAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGIuZ2V0KGtleSk7XG4gICAgICAgICAgICAgICAgICByID0gY2hlY2tBbHNvKG5leHRBLnZhbHVlWzFdLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICBpZighci5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgci5hID0gbmV4dEEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHIuYiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICByLnJlYXNvbiA9IFJFQVNPTi5NQVBfVkFMVUVfRVFVQUxJVFk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIW9wdHMuY29sbGVjdEFsbEZhaWxzKSBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByID0gcmVzdWx0KGZhbHNlLCBSRUFTT04uU0VUX01BUF9NSVNTSU5HX0tFWSk7XG4gICAgICAgICAgICAgICAgci5hID0ga2V5O1xuICAgICAgICAgICAgICAgIHIuYiA9IGtleTtcblxuICAgICAgICAgICAgICAgIGlmKCFvcHRzLmNvbGxlY3RBbGxGYWlscykgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vaGVhdnkgY2hlY2tcbiAgICAgICAgICAgICAgLy93ZSBzZWFyY2ggYnkgaXRlcmF0b3IgZm9yIGtleSBlcXVhbGl0eSB1c2luZyBlcXVhbFxuICAgICAgICAgICAgICB2YXIgaXRCID0gYi5lbnRyaWVzKCk7XG4gICAgICAgICAgICAgIHZhciBuZXh0QiA9IGl0Qi5uZXh0KCk7XG5cbiAgICAgICAgICAgICAgd2hpbGUoIW5leHRCLmRvbmUpIHtcbiAgICAgICAgICAgICAgICAvL2ZpcnN0IGNoZWNrIGZvciBrZXlzXG4gICAgICAgICAgICAgICAgciA9IGNoZWNrQWxzbyhuZXh0QS52YWx1ZVswXSwgbmV4dEIudmFsdWVbMF0pO1xuXG4gICAgICAgICAgICAgICAgaWYoIXIucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICByLnJlYXNvbiA9IFJFQVNPTi5TRVRfTUFQX01JU1NJTkdfS0VZO1xuICAgICAgICAgICAgICAgICAgci5hID0ga2V5O1xuICAgICAgICAgICAgICAgICAgci5iID0ga2V5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZih0eXBlQS5jbHMgPT0gJ21hcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgciA9IGNoZWNrQWxzbyhuZXh0QS52YWx1ZVsxXSwgbmV4dEIudmFsdWVbMV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCFyLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHIuYSA9IG5leHRBLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgIHIuYiA9IG5leHRCLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgIHIucmVhc29uID0gUkVBU09OLk1BUF9WQUxVRV9FUVVBTElUWTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBpZighb3B0cy5jb2xsZWN0QWxsRmFpbHMpIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG5leHRCID0gaXRCLm5leHQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSBicmVhaztcblxuICAgICAgICAgICAgbmV4dEEgPSBpdEEubmV4dCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHN0YWNrQS5wb3AoKTtcbiAgICAgICAgICBzdGFja0IucG9wKCk7XG5cbiAgICAgICAgICBpZighci5yZXN1bHQpIHtcbiAgICAgICAgICAgIHIucmVhc29uID0gUkVBU09OLlNFVF9NQVBfTUlTU0lOR19FTlRSWTtcbiAgICAgICAgICAgIGlmKCFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7IC8vY2hlY2sgdXNlciBwcm9wZXJ0aWVzXG4gICAgICB9XG4gIH1cblxuICAvLyBjb21wYXJlIGRlZXAgb2JqZWN0cyBhbmQgYXJyYXlzXG4gIC8vIHN0YWNrcyBjb250YWluIHJlZmVyZW5jZXMgb25seVxuICAvL1xuXG4gIGwgPSBzdGFja0EubGVuZ3RoO1xuICB3aGlsZShsLS0pIHtcbiAgICBpZihzdGFja0FbbF0gPT0gYSkge1xuICAgICAgcmV0dXJuIHJlc3VsdChzdGFja0JbbF0gPT0gYiwgUkVBU09OLkNJUkNVTEFSX1ZBTFVFUyk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWRkIGBhYCBhbmQgYGJgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0c1xuICBzdGFja0EucHVzaChhKTtcbiAgc3RhY2tCLnB1c2goYik7XG5cbiAgZm9yKGtleSBpbiBiKSB7XG4gICAgaWYoaGFzT3duUHJvcGVydHkuY2FsbChiLCBrZXkpKSB7XG4gICAgICByID0gcmVzdWx0KGhhc093blByb3BlcnR5LmNhbGwoYSwga2V5KSwgUkVBU09OLk1JU1NJTkdfS0VZLCAnQScsIGtleSk7XG4gICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSBicmVhaztcblxuICAgICAgaWYoci5yZXN1bHQpIHtcbiAgICAgICAgciA9IGNoZWNrUHJvcGVydHlFcXVhbGl0eShrZXkpO1xuICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZihyLnJlc3VsdCB8fCBvcHRzLmNvbGxlY3RBbGxGYWlscykge1xuICAgIC8vIGVuc3VyZSBib3RoIG9iamVjdHMgaGF2ZSB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllc1xuICAgIGZvcihrZXkgaW4gYSkge1xuICAgICAgaWYoaGFzT3duUHJvcGVydHkuY2FsbChhLCBrZXkpKSB7XG4gICAgICAgIHIgPSByZXN1bHQoaGFzT3duUHJvcGVydHkuY2FsbChiLCBrZXkpLCBSRUFTT04uTUlTU0lOR19LRVksICdCJywga2V5KTtcbiAgICAgICAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhY2tBLnBvcCgpO1xuICBzdGFja0IucG9wKCk7XG5cbiAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG5cbiAgdmFyIHByb3RvdHlwZXNFcXVhbHMgPSBmYWxzZSwgY2FuQ29tcGFyZVByb3RvdHlwZXMgPSBmYWxzZTtcblxuICBpZihvcHRzLmNoZWNrUHJvdG9FcWwpIHtcbiAgICBpZihPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHsvL1RPRE8gc2hvdWxkIGkgY2hlY2sgcHJvdG90eXBlcyBmb3IgPT09IG9yIHVzZSBlcT9cbiAgICAgIHByb3RvdHlwZXNFcXVhbHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSkgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihiKTtcbiAgICAgIGNhbkNvbXBhcmVQcm90b3R5cGVzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZihjYW5Db21wYXJlUHJvdG90eXBlcyAmJiAhcHJvdG90eXBlc0VxdWFscykge1xuICAgICAgciA9IHJlc3VsdChwcm90b3R5cGVzRXF1YWxzLCBSRUFTT04uRVFVQUxJVFlfUFJPVE9UWVBFKTtcbiAgICAgIHIuc2hvd1JlYXNvbiA9IHRydWU7XG4gICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSB7XG4gICAgICAgIHJldHVybiByO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBFUVVBTFM7XG59XG5cbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgY2hlY2tQcm90b0VxbDogdHJ1ZSxcbiAgY2hlY2tTdWJUeXBlOiB0cnVlLFxuICBwbHVzWmVyb0FuZE1pbnVzWmVyb0VxdWFsOiBmYWxzZVxufTtcblxuZnVuY3Rpb24gZXEoYSwgYiwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgaWYodHlwZW9mIG9wdHMuY2hlY2tQcm90b0VxbCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0cy5jaGVja1Byb3RvRXFsID0gZGVmYXVsdE9wdGlvbnMuY2hlY2tQcm90b0VxbDtcbiAgfVxuICBpZih0eXBlb2Ygb3B0cy5jaGVja1N1YlR5cGUgIT09ICdib29sZWFuJykge1xuICAgIG9wdHMuY2hlY2tTdWJUeXBlID0gZGVmYXVsdE9wdGlvbnMuY2hlY2tTdWJUeXBlO1xuICB9XG4gIGlmKHR5cGVvZiBvcHRzLnBsdXNaZXJvQW5kTWludXNaZXJvRXF1YWwgIT09ICdib29sZWFuJykge1xuICAgIG9wdHMucGx1c1plcm9BbmRNaW51c1plcm9FcXVhbCA9IGRlZmF1bHRPcHRpb25zLnBsdXNaZXJvQW5kTWludXNaZXJvRXF1YWw7XG4gIH1cblxuICB2YXIgZmFpbHMgPSBbXTtcbiAgdmFyIHIgPSBlcUludGVybmFsKGEsIGIsIG9wdHMsIFtdLCBbXSwgW10sIGZhaWxzKTtcbiAgcmV0dXJuIG9wdHMuY29sbGVjdEFsbEZhaWxzID8gZmFpbHMgOiByO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuXG5lcS5yID0gUkVBU09OO1xuIiwidmFyIGdldFR5cGUgPSByZXF1aXJlKCdzaG91bGQtdHlwZScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZnVuY3Rpb24gZ2VuS2V5c0Z1bmMoZikge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgayA9IGYodmFsdWUpO1xuICAgIGsuc29ydCgpO1xuICAgIHJldHVybiBrO1xuICB9O1xufVxuXG5cbmZ1bmN0aW9uIEZvcm1hdHRlcihvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gIHRoaXMuc2VlbiA9IFtdO1xuICB0aGlzLmtleXMgPSBnZW5LZXlzRnVuYyhvcHRzLmtleXMgPT09IGZhbHNlID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgOiBPYmplY3Qua2V5cyk7XG5cbiAgdGhpcy5tYXhMaW5lTGVuZ3RoID0gdHlwZW9mIG9wdHMubWF4TGluZUxlbmd0aCA9PT0gJ251bWJlcicgPyBvcHRzLm1heExpbmVMZW5ndGggOiA2MDtcbiAgdGhpcy5wcm9wU2VwID0gb3B0cy5wcm9wU2VwIHx8ICcsJztcblxuICB0aGlzLmlzVVRDZGF0ZSA9ICEhb3B0cy5pc1VUQ2RhdGU7XG59XG5cbkZvcm1hdHRlci5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBGb3JtYXR0ZXIsXG5cbiAgZm9ybWF0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciB0ID0gZ2V0VHlwZSh2YWx1ZSk7XG4gICAgdmFyIG5hbWUxID0gdC50eXBlLCBuYW1lMiA9IHQudHlwZTtcbiAgICBpZih0LmNscykge1xuICAgICAgbmFtZTEgKz0gJ18nICsgdC5jbHM7XG4gICAgICBuYW1lMiArPSAnXycgKyB0LmNscztcbiAgICB9XG4gICAgaWYodC5zdWIpIHtcbiAgICAgIG5hbWUyICs9ICdfJyArIHQuc3ViO1xuICAgIH1cbiAgICB2YXIgZiA9IHRoaXNbJ19mb3JtYXRfJyArIG5hbWUyXSB8fCB0aGlzWydfZm9ybWF0XycgKyBuYW1lMV0gfHwgdGhpc1snX2Zvcm1hdF8nICsgdC50eXBlXSB8fCB0aGlzLmRlZmF1bHRGb3JtYXQ7XG4gICAgcmV0dXJuIGYuY2FsbCh0aGlzLCB2YWx1ZSkudHJpbSgpO1xuICB9LFxuXG4gIF9mb3JtYXRPYmplY3Q6IGZ1bmN0aW9uKHZhbHVlLCBvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgdmFyIG1haW5LZXlzID0gb3B0cy5rZXlzIHx8IHRoaXMua2V5cyh2YWx1ZSk7XG5cbiAgICB2YXIgbGVuID0gMDtcblxuICAgIHZhciBmb3JtYXRQcm9wZXJ0eVZhbHVlID0gb3B0cy5mb3JtYXRQcm9wZXJ0eVZhbHVlIHx8IHRoaXMuZm9ybWF0UHJvcGVydHlWYWx1ZTtcbiAgICB2YXIgZm9ybWF0UHJvcGVydHlOYW1lID0gb3B0cy5mb3JtYXRQcm9wZXJ0eU5hbWUgfHwgdGhpcy5mb3JtYXRQcm9wZXJ0eU5hbWU7XG4gICAgdmFyIGtleVZhbHVlU2VwID0gb3B0cy5rZXlWYWx1ZVNlcCB8fCAnOiAnO1xuICAgIHZhciBrZXlGaWx0ZXIgPSBvcHRzLmtleUZpbHRlciB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH07XG5cbiAgICB0aGlzLnNlZW4ucHVzaCh2YWx1ZSk7XG4gICAgdmFyIGtleXMgPSBbXTtcblxuICAgIG1haW5LZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZigha2V5RmlsdGVyKGtleSkpIHJldHVybjtcblxuICAgICAgdmFyIGZOYW1lID0gZm9ybWF0UHJvcGVydHlOYW1lLmNhbGwodGhpcywga2V5KTtcblxuICAgICAgdmFyIGYgPSAoZk5hbWUgPyBmTmFtZSArIGtleVZhbHVlU2VwIDogJycpICsgZm9ybWF0UHJvcGVydHlWYWx1ZS5jYWxsKHRoaXMsIHZhbHVlLCBrZXkpO1xuICAgICAgbGVuICs9IGYubGVuZ3RoO1xuICAgICAga2V5cy5wdXNoKGYpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuc2Vlbi5wb3AoKTtcblxuICAgIChvcHRzLmFkZGl0aW9uYWxQcm9wZXJ0aWVzIHx8IFtdKS5mb3JFYWNoKGZ1bmN0aW9uKGtleVZhbHVlKSB7XG4gICAgICB2YXIgZiA9IGtleVZhbHVlWzBdICsga2V5VmFsdWVTZXAgKyB0aGlzLmZvcm1hdChrZXlWYWx1ZVsxXSk7XG4gICAgICBsZW4gKz0gZi5sZW5ndGg7XG4gICAgICBrZXlzLnB1c2goZik7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB2YXIgcHJlZml4ID0gb3B0cy5wcmVmaXggfHwgRm9ybWF0dGVyLmNvbnN0cnVjdG9yTmFtZSh2YWx1ZSkgfHwgJyc7XG4gICAgaWYocHJlZml4Lmxlbmd0aCA+IDApIHByZWZpeCArPSAnICc7XG5cbiAgICB2YXIgbGJyYWNrZXQsIHJicmFja2V0O1xuICAgIGlmKEFycmF5LmlzQXJyYXkob3B0cy5icmFja2V0cykpIHtcbiAgICAgIGxicmFja2V0ID0gb3B0cy5icmFja2V0cyAmJiBvcHRzLmJyYWNrZXRzWzBdO1xuICAgICAgcmJyYWNrZXQgPSBvcHRzLmJyYWNrZXRzICYmIG9wdHMuYnJhY2tldHNbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxicmFja2V0ID0gJ3snO1xuICAgICAgcmJyYWNrZXQgPSAnfSc7XG4gICAgfVxuXG4gICAgdmFyIHJvb3RWYWx1ZSA9IG9wdHMudmFsdWUgfHwgJyc7XG5cbiAgICBpZihrZXlzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiByb290VmFsdWUgfHwgKHByZWZpeCArIGxicmFja2V0ICsgcmJyYWNrZXQpO1xuXG4gICAgaWYobGVuIDw9IHRoaXMubWF4TGluZUxlbmd0aCkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIGxicmFja2V0ICsgJyAnICsgKHJvb3RWYWx1ZSA/IHJvb3RWYWx1ZSArICcgJyA6ICcnKSArIGtleXMuam9pbih0aGlzLnByb3BTZXAgKyAnICcpICsgJyAnICsgcmJyYWNrZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyBsYnJhY2tldCArICdcXG4nICsgKHJvb3RWYWx1ZSA/ICcgICcgKyByb290VmFsdWUgKyAnXFxuJyA6ICcnKSArIGtleXMubWFwKHV0aWwuYWRkU3BhY2VzKS5qb2luKHRoaXMucHJvcFNlcCArICdcXG4nKSArICdcXG4nICsgcmJyYWNrZXQ7XG4gICAgfVxuICB9LFxuXG4gIGZvcm1hdE9iamVjdDogZnVuY3Rpb24odmFsdWUsIHByZWZpeCwgcHJvcHMpIHtcbiAgICBwcm9wcyA9IHByb3BzIHx8IHRoaXMua2V5cyh2YWx1ZSk7XG5cbiAgICB2YXIgbGVuID0gMDtcblxuICAgIHRoaXMuc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICBwcm9wcyA9IHByb3BzLm1hcChmdW5jdGlvbihwcm9wKSB7XG4gICAgICB2YXIgZiA9IHRoaXMuZm9ybWF0UHJvcGVydHkodmFsdWUsIHByb3ApO1xuICAgICAgbGVuICs9IGYubGVuZ3RoO1xuICAgICAgcmV0dXJuIGY7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5zZWVuLnBvcCgpO1xuXG4gICAgaWYocHJvcHMubGVuZ3RoID09PSAwKSByZXR1cm4gJ3t9JztcblxuICAgIGlmKGxlbiA8PSB0aGlzLm1heExpbmVMZW5ndGgpIHtcbiAgICAgIHJldHVybiAneyAnICsgKHByZWZpeCA/IHByZWZpeCArICcgJyA6ICcnKSArIHByb3BzLmpvaW4odGhpcy5wcm9wU2VwICsgJyAnKSArICcgfSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAneycgKyAnXFxuJyArIChwcmVmaXggPyAnICAnICsgcHJlZml4ICsgJ1xcbicgOiAnJykgKyBwcm9wcy5tYXAodXRpbC5hZGRTcGFjZXMpLmpvaW4odGhpcy5wcm9wU2VwICsgJ1xcbicpICsgJ1xcbicgKyAnfSc7XG4gICAgfVxuICB9LFxuXG4gIGZvcm1hdFByb3BlcnR5TmFtZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBuYW1lLm1hdGNoKC9eW2EtekEtWl8kXVthLXpBLVpfJDAtOV0qJC8pID8gbmFtZSA6IHRoaXMuZm9ybWF0KG5hbWUpO1xuICB9LFxuXG4gIGZvcm1hdFByb3BlcnR5OiBmdW5jdGlvbih2YWx1ZSwgcHJvcCkge1xuICAgIHZhciBkZXNjID0gRm9ybWF0dGVyLmdldFByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwgcHJvcCk7XG5cbiAgICB2YXIgcHJvcE5hbWUgPSB0aGlzLmZvcm1hdFByb3BlcnR5TmFtZShwcm9wKTtcblxuICAgIHZhciBwcm9wVmFsdWUgPSBkZXNjLmdldCAmJiBkZXNjLnNldCA/XG4gICAgICAnW0dldHRlci9TZXR0ZXJdJyA6IGRlc2MuZ2V0ID9cbiAgICAgICdbR2V0dGVyXScgOiBkZXNjLnNldCA/XG4gICAgICAnW1NldHRlcl0nIDogdGhpcy5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPj0gMCA/XG4gICAgICAnW0NpcmN1bGFyXScgOlxuICAgICAgdGhpcy5mb3JtYXQoZGVzYy52YWx1ZSk7XG5cbiAgICByZXR1cm4gcHJvcE5hbWUgKyAnOiAnICsgcHJvcFZhbHVlO1xuICB9LFxuXG4gIGZvcm1hdFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uKHZhbHVlLCBwcm9wKSB7XG4gICAgdmFyIGRlc2MgPSBGb3JtYXR0ZXIuZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBwcm9wKTtcblxuICAgIHZhciBwcm9wVmFsdWUgPSBkZXNjLmdldCAmJiBkZXNjLnNldCA/XG4gICAgICAnW0dldHRlci9TZXR0ZXJdJyA6IGRlc2MuZ2V0ID9cbiAgICAgICdbR2V0dGVyXScgOiBkZXNjLnNldCA/XG4gICAgICAnW1NldHRlcl0nIDogdGhpcy5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPj0gMCA/XG4gICAgICAnW0NpcmN1bGFyXScgOlxuICAgICAgdGhpcy5mb3JtYXQoZGVzYy52YWx1ZSk7XG5cbiAgICByZXR1cm4gcHJvcFZhbHVlO1xuICB9XG59O1xuXG5Gb3JtYXR0ZXIuYWRkID0gZnVuY3Rpb24gYWRkKHR5cGUsIGNscywgc3ViLCBmKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgZiA9IGFyZ3MucG9wKCk7XG4gIEZvcm1hdHRlci5wcm90b3R5cGVbJ19mb3JtYXRfJyArIGFyZ3Muam9pbignXycpXSA9IGY7XG59O1xuXG5Gb3JtYXR0ZXIuZm9ybWF0T2JqZWN0V2l0aFByZWZpeCA9IGZ1bmN0aW9uIGZvcm1hdE9iamVjdFdpdGhQcmVmaXgoZikge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcHJlZml4ID0gZi5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICB2YXIgcHJvcHMgPSB0aGlzLmtleXModmFsdWUpO1xuICAgIGlmKHByb3BzLmxlbmd0aCA9PSAwKSByZXR1cm4gcHJlZml4O1xuICAgIGVsc2UgcmV0dXJuIHRoaXMuZm9ybWF0T2JqZWN0KHZhbHVlLCBwcmVmaXgsIHByb3BzKTtcbiAgfTtcbn07XG5cbnZhciBmdW5jdGlvbk5hbWVSRSA9IC9eXFxzKmZ1bmN0aW9uXFxzKihcXFMqKVxccypcXCgvO1xuXG5Gb3JtYXR0ZXIuZnVuY3Rpb25OYW1lID0gZnVuY3Rpb24gZnVuY3Rpb25OYW1lKGYpIHtcbiAgaWYoZi5uYW1lKSB7XG4gICAgcmV0dXJuIGYubmFtZTtcbiAgfVxuICB2YXIgbWF0Y2hlcyA9IGYudG9TdHJpbmcoKS5tYXRjaChmdW5jdGlvbk5hbWVSRSk7XG4gIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgLy8gYGZ1bmN0aW9uTmFtZVJFYCBkb2Vzbid0IG1hdGNoIGFycm93IGZ1bmN0aW9ucy5cbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgdmFyIG5hbWUgPSBtYXRjaGVzWzFdO1xuICByZXR1cm4gbmFtZTtcbn07XG5cbkZvcm1hdHRlci5jb25zdHJ1Y3Rvck5hbWUgPSBmdW5jdGlvbihvYmopIHtcbiAgd2hpbGUgKG9iaikge1xuICAgIHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosICdjb25zdHJ1Y3RvcicpO1xuICAgIGlmIChkZXNjcmlwdG9yICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgdHlwZW9mIGRlc2NyaXB0b3IudmFsdWUgPT09ICdmdW5jdGlvbicpIHtcblxuICAgICAgICB2YXIgbmFtZSA9IEZvcm1hdHRlci5mdW5jdGlvbk5hbWUoZGVzY3JpcHRvci52YWx1ZSk7XG4gICAgICAgIGlmKG5hbWUgIT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgfVxufTtcblxuRm9ybWF0dGVyLmdldFByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUpIHtcbiAgdmFyIGRlc2M7XG4gIHRyeSB7XG4gICAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCB2YWx1ZSkgfHwge3ZhbHVlOiBvYmpbdmFsdWVdfTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZGVzYyA9IHt2YWx1ZTogZX07XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59O1xuXG5Gb3JtYXR0ZXIuZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheSA9IGZ1bmN0aW9uIGdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkobGVuZ3RoUHJvcCwgbmFtZSwgcGFkZGluZykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgbWF4ID0gdGhpcy5ieXRlQXJyYXlNYXhMZW5ndGggfHwgNTA7XG4gICAgdmFyIGxlbmd0aCA9IHZhbHVlW2xlbmd0aFByb3BdO1xuICAgIHZhciBmb3JtYXR0ZWRWYWx1ZXMgPSBbXTtcbiAgICB2YXIgbGVuID0gMDtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWF4ICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGIgPSB2YWx1ZVtpXSB8fCAwO1xuICAgICAgdmFyIHYgPSB1dGlsLnBhZDAoYi50b1N0cmluZygxNiksIHBhZGRpbmcpO1xuICAgICAgbGVuICs9IHYubGVuZ3RoO1xuICAgICAgZm9ybWF0dGVkVmFsdWVzLnB1c2godik7XG4gICAgfVxuICAgIHZhciBwcmVmaXggPSB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8IG5hbWUgfHwgJyc7XG4gICAgaWYocHJlZml4KSBwcmVmaXggKz0gJyAnO1xuXG4gICAgaWYoZm9ybWF0dGVkVmFsdWVzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBwcmVmaXggKyAnW10nO1xuXG4gICAgaWYobGVuIDw9IHRoaXMubWF4TGluZUxlbmd0aCkge1xuICAgICAgcmV0dXJuIHByZWZpeCArICdbICcgKyBmb3JtYXR0ZWRWYWx1ZXMuam9pbih0aGlzLnByb3BTZXAgKyAnICcpICsgJyAnICsgJ10nO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgJ1tcXG4nICsgZm9ybWF0dGVkVmFsdWVzLm1hcCh1dGlsLmFkZFNwYWNlcykuam9pbih0aGlzLnByb3BTZXAgKyAnXFxuJykgKyAnXFxuJyArICddJztcbiAgICB9XG4gIH07XG59O1xuXG5Gb3JtYXR0ZXIuYWRkKCd1bmRlZmluZWQnLCBmdW5jdGlvbigpIHsgcmV0dXJuICd1bmRlZmluZWQnIH0pO1xuRm9ybWF0dGVyLmFkZCgnbnVsbCcsIGZ1bmN0aW9uKCkgeyByZXR1cm4gJ251bGwnIH0pO1xuRm9ybWF0dGVyLmFkZCgnYm9vbGVhbicsIGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSA/ICd0cnVlJzogJ2ZhbHNlJyB9KTtcbkZvcm1hdHRlci5hZGQoJ3N5bWJvbCcsIGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZS50b1N0cmluZygpIH0pO1xuXG5bJ251bWJlcicsICdib29sZWFuJ10uZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gIEZvcm1hdHRlci5hZGQoJ29iamVjdCcsIG5hbWUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdE9iamVjdCh2YWx1ZSwge1xuICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IFtbJ1tbUHJpbWl0aXZlVmFsdWVdXScsIHZhbHVlLnZhbHVlT2YoKV1dXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdzdHJpbmcnLCBmdW5jdGlvbih2YWx1ZSkge1xuICB2YXIgcmVhbFZhbHVlID0gdmFsdWUudmFsdWVPZigpO1xuXG4gIHJldHVybiB0aGlzLl9mb3JtYXRPYmplY3QodmFsdWUsIHtcbiAgICBrZXlGaWx0ZXI6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgLy9za2lwIHVzZWxlc3MgaW5kZXhlZCBwcm9wZXJ0aWVzXG4gICAgICByZXR1cm4gIShrZXkubWF0Y2goL1xcZCsvKSAmJiBwYXJzZUludChrZXksIDEwKSA8IHJlYWxWYWx1ZS5sZW5ndGgpO1xuICAgIH0sXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IFtbJ1tbUHJpbWl0aXZlVmFsdWVdXScsIHJlYWxWYWx1ZV1dXG4gIH0pO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdyZWdleHAnLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fZm9ybWF0T2JqZWN0KHZhbHVlLCB7XG4gICAgdmFsdWU6IFN0cmluZyh2YWx1ZSlcbiAgfSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnbnVtYmVyJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgcmV0dXJuICctMCc7XG4gIHJldHVybiBTdHJpbmcodmFsdWUpO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ3N0cmluZycsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9mb3JtYXRPYmplY3QodmFsdWUpO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdhcmd1bWVudHMnLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fZm9ybWF0T2JqZWN0KHZhbHVlLCB7XG4gICAgcHJlZml4OiAnQXJndW1lbnRzJyxcbiAgICBmb3JtYXRQcm9wZXJ0eU5hbWU6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYoIWtleS5tYXRjaCgvXFxkKy8pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFByb3BlcnR5TmFtZShrZXkpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYnJhY2tldHM6IFsnWycsICddJ11cbiAgfSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2FycmF5JywgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX2Zvcm1hdE9iamVjdCh2YWx1ZSwge1xuICAgIGZvcm1hdFByb3BlcnR5TmFtZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZigha2V5Lm1hdGNoKC9cXGQrLykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0UHJvcGVydHlOYW1lKGtleSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBicmFja2V0czogWydbJywgJ10nXVxuICB9KTtcbn0pO1xuXG5cbmZ1bmN0aW9uIGZvcm1hdERhdGUodmFsdWUsIGlzVVRDKSB7XG4gIHZhciBwcmVmaXggPSBpc1VUQyA/ICdVVEMnIDogJyc7XG5cbiAgdmFyIGRhdGUgPSB2YWx1ZVsnZ2V0JyArIHByZWZpeCArICdGdWxsWWVhciddKCkgK1xuICAgICctJyArXG4gICAgdXRpbC5wYWQwKHZhbHVlWydnZXQnICsgcHJlZml4ICsgJ01vbnRoJ10oKSArIDEsIDIpICtcbiAgICAnLScgK1xuICAgIHV0aWwucGFkMCh2YWx1ZVsnZ2V0JyArIHByZWZpeCArICdEYXRlJ10oKSwgMik7XG5cbiAgdmFyIHRpbWUgPSB1dGlsLnBhZDAodmFsdWVbJ2dldCcgKyBwcmVmaXggKyAnSG91cnMnXSgpLCAyKSArXG4gICAgJzonICtcbiAgICB1dGlsLnBhZDAodmFsdWVbJ2dldCcgKyBwcmVmaXggKyAnTWludXRlcyddKCksIDIpICtcbiAgICAnOicgK1xuICAgIHV0aWwucGFkMCh2YWx1ZVsnZ2V0JyArIHByZWZpeCArICdTZWNvbmRzJ10oKSwgMikgK1xuICAgICcuJyArXG4gICAgdXRpbC5wYWQwKHZhbHVlWydnZXQnICsgcHJlZml4ICsgJ01pbGxpc2Vjb25kcyddKCksIDMpO1xuXG4gIHZhciB0byA9IHZhbHVlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIHZhciBhYnNUbyA9IE1hdGguYWJzKHRvKTtcbiAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihhYnNUbyAvIDYwKTtcbiAgdmFyIG1pbnV0ZXMgPSBhYnNUbyAtIGhvdXJzICogNjA7XG4gIHZhciB0ekZvcm1hdCA9ICh0byA8IDAgPyAnKycgOiAnLScpICsgdXRpbC5wYWQwKGhvdXJzLCAyKSArIHV0aWwucGFkMChtaW51dGVzLCAyKTtcblxuICByZXR1cm4gZGF0ZSArICcgJyArIHRpbWUgKyAoaXNVVEMgPyAnJyA6ICcgJyArIHR6Rm9ybWF0KTtcbn1cblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2RhdGUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fZm9ybWF0T2JqZWN0KHZhbHVlLCB7IHZhbHVlOiBmb3JtYXREYXRlKHZhbHVlLCB0aGlzLmlzVVRDZGF0ZSkgfSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnZnVuY3Rpb24nLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fZm9ybWF0T2JqZWN0KHZhbHVlLCB7XG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IFtbJ25hbWUnLCBGb3JtYXR0ZXIuZnVuY3Rpb25OYW1lKHZhbHVlKV1dXG4gIH0pO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdlcnJvcicsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9mb3JtYXRPYmplY3QodmFsdWUsIHtcbiAgICBwcmVmaXg6IHZhbHVlLm5hbWUsXG4gICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IFtbJ21lc3NhZ2UnLCB2YWx1ZS5tZXNzYWdlXV1cbiAgfSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2J1ZmZlcicsIEZvcm1hdHRlci5nZW5lcmF0ZUZ1bmN0aW9uRm9ySW5kZXhlZEFycmF5KCdsZW5ndGgnLCAnQnVmZmVyJywgMikpO1xuXG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAnYXJyYXktYnVmZmVyJywgRm9ybWF0dGVyLmdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkoJ2J5dGVMZW5ndGgnLCAnQXJyYXlCdWZmZXInLCAyKSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICd0eXBlZC1hcnJheScsICdpbnQ4JywgRm9ybWF0dGVyLmdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkoJ2xlbmd0aCcsICdJbnQ4QXJyYXknLCAyKSk7XG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAndHlwZWQtYXJyYXknLCAndWludDgnLCBGb3JtYXR0ZXIuZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheSgnbGVuZ3RoJywgJ1VpbnQ4QXJyYXknLCAyKSk7XG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAndHlwZWQtYXJyYXknLCAndWludDhjbGFtcGVkJywgRm9ybWF0dGVyLmdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkoJ2xlbmd0aCcsICdVaW50OENsYW1wZWRBcnJheScsIDIpKTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3R5cGVkLWFycmF5JywgJ2ludDE2JywgRm9ybWF0dGVyLmdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkoJ2xlbmd0aCcsICdJbnQxNkFycmF5JywgNCkpO1xuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3R5cGVkLWFycmF5JywgJ3VpbnQxNicsIEZvcm1hdHRlci5nZW5lcmF0ZUZ1bmN0aW9uRm9ySW5kZXhlZEFycmF5KCdsZW5ndGgnLCAnVWludDE2QXJyYXknLCA0KSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICd0eXBlZC1hcnJheScsICdpbnQzMicsIEZvcm1hdHRlci5nZW5lcmF0ZUZ1bmN0aW9uRm9ySW5kZXhlZEFycmF5KCdsZW5ndGgnLCAnSW50MzJBcnJheScsIDgpKTtcbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICd0eXBlZC1hcnJheScsICd1aW50MzInLCBGb3JtYXR0ZXIuZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheSgnbGVuZ3RoJywgJ1VpbnQzMkFycmF5JywgOCkpO1xuXG4vL1RPRE8gYWRkIGZsb2F0MzIgYW5kIGZsb2F0NjRcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3Byb21pc2UnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbUHJvbWlzZV0nOy8vVE9ETyBpdCBjb3VsZCBiZSBuaWNlIHRvIGluc3BlY3QgaXRzIHN0YXRlIGFuZCB2YWx1ZVxufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICd4aHInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbWE1MSHR0cFJlcXVlc3RdJzsvL1RPRE8gaXQgY291bGQgYmUgbmljZSB0byBpbnNwZWN0IGl0cyBzdGF0ZVxufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdodG1sLWVsZW1lbnQnLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUub3V0ZXJIVE1MO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdodG1sLWVsZW1lbnQnLCAnI3RleHQnLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUubm9kZVZhbHVlO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdodG1sLWVsZW1lbnQnLCAnI2RvY3VtZW50JywgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLmRvY3VtZW50RWxlbWVudC5vdXRlckhUTUw7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2hvc3QnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbSG9zdF0nO1xufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdzZXQnLCBmdW5jdGlvbih2YWx1ZSkge1xuICB2YXIgaXRlciA9IHZhbHVlLnZhbHVlcygpO1xuICB2YXIgbGVuID0gMDtcblxuICB0aGlzLnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIHByb3BzID0gW107XG5cbiAgdmFyIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgd2hpbGUoIW5leHQuZG9uZSkge1xuICAgIHZhciB2YWwgPSBuZXh0LnZhbHVlO1xuICAgIHZhciBmID0gdGhpcy5mb3JtYXQodmFsKTtcbiAgICBsZW4gKz0gZi5sZW5ndGg7XG4gICAgcHJvcHMucHVzaChmKTtcblxuICAgIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgfVxuXG4gIHRoaXMuc2Vlbi5wb3AoKTtcblxuICBpZihwcm9wcy5sZW5ndGggPT09IDApIHJldHVybiAnU2V0IHt9JztcblxuICBpZihsZW4gPD0gdGhpcy5tYXhMaW5lTGVuZ3RoKSB7XG4gICAgcmV0dXJuICdTZXQgeyAnICsgcHJvcHMuam9pbih0aGlzLnByb3BTZXAgKyAnICcpICsgJyB9JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ1NldCB7XFxuJyArIHByb3BzLm1hcCh1dGlsLmFkZFNwYWNlcykuam9pbih0aGlzLnByb3BTZXAgKyAnXFxuJykgKyAnXFxuJyArICd9JztcbiAgfVxufSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdtYXAnLCBmdW5jdGlvbih2YWx1ZSkge1xuICB2YXIgaXRlciA9IHZhbHVlLmVudHJpZXMoKTtcbiAgdmFyIGxlbiA9IDA7XG5cbiAgdGhpcy5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBwcm9wcyA9IFtdO1xuXG4gIHZhciBuZXh0ID0gaXRlci5uZXh0KCk7XG4gIHdoaWxlKCFuZXh0LmRvbmUpIHtcbiAgICB2YXIgdmFsID0gbmV4dC52YWx1ZTtcbiAgICB2YXIgZksgPSB0aGlzLmZvcm1hdCh2YWxbMF0pO1xuICAgIHZhciBmViA9IHRoaXMuZm9ybWF0KHZhbFsxXSk7XG5cbiAgICB2YXIgZjtcbiAgICBpZigoZksubGVuZ3RoICsgZlYubGVuZ3RoICsgNCkgPD0gdGhpcy5tYXhMaW5lTGVuZ3RoKSB7XG4gICAgICBmID0gZksgKyAnID0+ICcgKyBmVjtcbiAgICB9IGVsc2Uge1xuICAgICAgZiA9IGZLICsgJyA9PlxcbicgKyBmVjtcbiAgICB9XG5cbiAgICBsZW4gKz0gZksubGVuZ3RoICsgZlYubGVuZ3RoICsgNDtcbiAgICBwcm9wcy5wdXNoKGYpO1xuXG4gICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICB9XG5cbiAgdGhpcy5zZWVuLnBvcCgpO1xuXG4gIGlmKHByb3BzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICdNYXAge30nO1xuXG4gIGlmKGxlbiA8PSB0aGlzLm1heExpbmVMZW5ndGgpIHtcbiAgICByZXR1cm4gJ01hcCB7ICcgKyBwcm9wcy5qb2luKHRoaXMucHJvcFNlcCArICcgJykgKyAnIH0nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnTWFwIHtcXG4nICsgcHJvcHMubWFwKHV0aWwuYWRkU3BhY2VzKS5qb2luKHRoaXMucHJvcFNlcCArICdcXG4nKSArICdcXG4nICsgJ30nO1xuICB9XG59KTtcblxuRm9ybWF0dGVyLnByb3RvdHlwZS5kZWZhdWx0Rm9ybWF0ID0gRm9ybWF0dGVyLnByb3RvdHlwZS5fZm9ybWF0X29iamVjdDtcblxuZnVuY3Rpb24gZGVmYXVsdEZvcm1hdCh2YWx1ZSwgb3B0cykge1xuICByZXR1cm4gbmV3IEZvcm1hdHRlcihvcHRzKS5mb3JtYXQodmFsdWUpO1xufVxuXG5kZWZhdWx0Rm9ybWF0LkZvcm1hdHRlciA9IEZvcm1hdHRlcjtcbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdEZvcm1hdDtcbiIsImZ1bmN0aW9uIGFkZFNwYWNlcyh2KSB7XG4gIHJldHVybiB2LnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24odnYpIHsgcmV0dXJuICcgICcgKyB2djsgfSkuam9pbignXFxuJyk7XG59XG5cbmZ1bmN0aW9uIHBhZChzdHIsIHZhbHVlLCBmaWxsZXIpIHtcbiAgc3RyID0gU3RyaW5nKHN0cilcbiAgdmFyIGlzUmlnaHQgPSBmYWxzZTtcblxuICBpZih2YWx1ZSA8IDApIHtcbiAgICBpc1JpZ2h0ID0gdHJ1ZTtcbiAgICB2YWx1ZSA9IC12YWx1ZTtcbiAgfVxuXG4gIGlmKHN0ci5sZW5ndGggPCB2YWx1ZSkge1xuICAgIHZhciBwYWRkaW5nID0gbmV3IEFycmF5KHZhbHVlIC0gc3RyLmxlbmd0aCArIDEpLmpvaW4oZmlsbGVyKTtcbiAgICByZXR1cm4gaXNSaWdodCA/IHN0ciArIHBhZGRpbmcgOiBwYWRkaW5nICsgc3RyO1xuICB9IGVsc2V7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkU3BhY2VzOiBhZGRTcGFjZXMsXG4gIHBhZDogcGFkLFxuICBwYWQwOiBmdW5jdGlvbihzdHIsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHBhZChzdHIsIHZhbHVlLCAnMCcpO1xuICB9XG59O1xuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuXHJcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcclxuXHJcbi8qKlxyXG4gKiBTaW1wbGUgZGF0YSBmdW5jdGlvbiB0byBzdG9yZSB0eXBlIGluZm9ybWF0aW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFVzdWFsbHkgd2hhdCBpcyByZXR1cm5lZCBmcm9tIHR5cGVvZlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xzICBTYW5pdGl6ZWQgQENsYXNzIHZpYSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdWIgIElmIHR5cGUgYW5kIGNscyB0aGUgc2FtZSwgYW5kIG5lZWQgdG8gc3BlY2lmeSBzb21laG93XHJcbiAqIEBwcml2YXRlXHJcbiAqIEBleGFtcGxlXHJcbiAqXHJcbiAqIC8vZm9yIG51bGxcclxuICogbmV3IFR5cGUoJ251bGwnKTtcclxuICpcclxuICogLy9mb3IgRGF0ZVxyXG4gKiBuZXcgVHlwZSgnb2JqZWN0JywgJ2RhdGUnKTtcclxuICpcclxuICogLy9mb3IgVWludDhBcnJheVxyXG4gKlxyXG4gKiBuZXcgVHlwZSgnb2JqZWN0JywgJ3R5cGVkLWFycmF5JywgJ3VpbnQ4Jyk7XHJcbiAqL1xyXG5mdW5jdGlvbiBUeXBlKHR5cGUsIGNscywgc3ViKSB7XHJcbiAgdGhpcy50eXBlID0gdHlwZTtcclxuICB0aGlzLmNscyA9IGNscztcclxuICB0aGlzLnN1YiA9IHN1YjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZ1bmN0aW9uIHRvIHN0b3JlIHR5cGUgY2hlY2tzXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBUeXBlQ2hlY2tlcigpIHtcclxuICB0aGlzLmNoZWNrcyA9IFtdO1xyXG59XHJcblxyXG5UeXBlQ2hlY2tlci5wcm90b3R5cGUgPSB7XHJcbiAgYWRkOiBmdW5jdGlvbihmdW5jKSB7XHJcbiAgICB0aGlzLmNoZWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuXHJcbiAgYWRkVHlwZU9mOiBmdW5jdGlvbih0eXBlLCByZXMpIHtcclxuICAgIHJldHVybiB0aGlzLmFkZChmdW5jdGlvbihvYmosIHRwZU9mKSB7XHJcbiAgICAgIGlmKHRwZU9mID09PSB0eXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUeXBlKHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGFkZENsYXNzOiBmdW5jdGlvbihjbHMsIHJlcywgc3ViKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hZGQoZnVuY3Rpb24ob2JqLCB0cGVPZiwgb2JqQ2xzKSB7XHJcbiAgICAgIGlmKG9iakNscyA9PT0gY2xzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUeXBlKHR5cGVzLk9CSkVDVCwgcmVzLCBzdWIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICBnZXRUeXBlOiBmdW5jdGlvbihvYmopIHtcclxuICAgIHZhciB0eXBlT2YgPSB0eXBlb2Ygb2JqO1xyXG4gICAgdmFyIGNscyA9IHRvU3RyaW5nLmNhbGwob2JqKTtcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwLCBsID0gdGhpcy5jaGVja3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgIHZhciByZXMgPSB0aGlzLmNoZWNrc1tpXS5jYWxsKHRoaXMsIG9iaiwgdHlwZU9mLCBjbHMpO1xyXG4gICAgICBpZih0eXBlb2YgcmVzICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgfVxyXG59O1xyXG5cclxudmFyIG1haW4gPSBuZXcgVHlwZUNoZWNrZXIoKTtcclxuXHJcbi8vVE9ETyBhZGQgaXRlcmF0b3JzXHJcblxyXG5tYWluXHJcbiAgLmFkZFR5cGVPZih0eXBlcy5OVU1CRVIsIHR5cGVzLk5VTUJFUilcclxuICAuYWRkVHlwZU9mKHR5cGVzLlVOREVGSU5FRCwgdHlwZXMuVU5ERUZJTkVEKVxyXG4gIC5hZGRUeXBlT2YodHlwZXMuU1RSSU5HLCB0eXBlcy5TVFJJTkcpXHJcbiAgLmFkZFR5cGVPZih0eXBlcy5CT09MRUFOLCB0eXBlcy5CT09MRUFOKVxyXG4gIC5hZGRUeXBlT2YodHlwZXMuRlVOQ1RJT04sIHR5cGVzLkZVTkNUSU9OKVxyXG4gIC5hZGRUeXBlT2YodHlwZXMuU1lNQk9MLCB0eXBlcy5TWU1CT0wpXHJcbiAgLmFkZChmdW5jdGlvbihvYmosIHRwZU9mKSB7XHJcbiAgICBpZihvYmogPT09IG51bGwpIHJldHVybiBuZXcgVHlwZSh0eXBlcy5OVUxMKTtcclxuICB9KVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBTdHJpbmddJywgdHlwZXMuU1RSSU5HKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBCb29sZWFuXScsIHR5cGVzLkJPT0xFQU4pXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IE51bWJlcl0nLCB0eXBlcy5OVU1CRVIpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEFycmF5XScsIHR5cGVzLkFSUkFZKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBSZWdFeHBdJywgdHlwZXMuUkVHRVhQKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBFcnJvcl0nLCB0eXBlcy5FUlJPUilcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgRGF0ZV0nLCB0eXBlcy5EQVRFKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBBcmd1bWVudHNdJywgdHlwZXMuQVJHVU1FTlRTKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBNYXRoXScpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEpTT05dJylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgQXJyYXlCdWZmZXJdJywgdHlwZXMuQVJSQVlfQlVGRkVSKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBJbnQ4QXJyYXldJywgdHlwZXMuVFlQRURfQVJSQVksICdpbnQ4JylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgVWludDhBcnJheV0nLCB0eXBlcy5UWVBFRF9BUlJBWSwgJ3VpbnQ4JylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJywgdHlwZXMuVFlQRURfQVJSQVksICd1aW50OGNsYW1wZWQnKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBJbnQxNkFycmF5XScsIHR5cGVzLlRZUEVEX0FSUkFZLCAnaW50MTYnKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBVaW50MTZBcnJheV0nLCB0eXBlcy5UWVBFRF9BUlJBWSwgJ3VpbnQxNicpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEludDMyQXJyYXldJywgdHlwZXMuVFlQRURfQVJSQVksICdpbnQzMicpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFVpbnQzMkFycmF5XScsIHR5cGVzLlRZUEVEX0FSUkFZLCAndWludDMyJylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsIHR5cGVzLlRZUEVEX0FSUkFZLCAnZmxvYXQzMicpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLCB0eXBlcy5UWVBFRF9BUlJBWSwgJ2Zsb2F0NjQnKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBEYXRhVmlld10nLCB0eXBlcy5EQVRBX1ZJRVcpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IE1hcF0nLCB0eXBlcy5NQVApXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFdlYWtNYXBdJywgdHlwZXMuV0VBS19NQVApXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFNldF0nLCB0eXBlcy5TRVQpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFdlYWtTZXRdJywgdHlwZXMuV0VBS19TRVQpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFByb21pc2VdJywgdHlwZXMuUFJPTUlTRSlcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgQmxvYl0nLCB0eXBlcy5CTE9CKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBGaWxlXScsIHR5cGVzLkZJTEUpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEZpbGVMaXN0XScsIHR5cGVzLkZJTEVfTElTVClcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgWE1MSHR0cFJlcXVlc3RdJywgdHlwZXMuWEhSKVxyXG4gIC5hZGQoZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBpZigodHlwZW9mIFByb21pc2UgPT09IHR5cGVzLkZVTkNUSU9OICYmIG9iaiBpbnN0YW5jZW9mIFByb21pc2UpIHx8XHJcbiAgICAgICAgKHR5cGVvZiBvYmoudGhlbiA9PT0gdHlwZXMuRlVOQ1RJT04pKSB7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IFR5cGUodHlwZXMuT0JKRUNULCB0eXBlcy5QUk9NSVNFKTtcclxuICAgICAgICB9XHJcbiAgfSlcclxuICAuYWRkKGZ1bmN0aW9uKG9iaikge1xyXG4gICAgaWYodHlwZW9mIEJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVHlwZSh0eXBlcy5PQkpFQ1QsIHR5cGVzLkJVRkZFUik7XHJcbiAgICB9XHJcbiAgfSlcclxuICAuYWRkKGZ1bmN0aW9uKG9iaikge1xyXG4gICAgaWYodHlwZW9mIE5vZGUgIT09ICd1bmRlZmluZWQnICYmIG9iaiBpbnN0YW5jZW9mIE5vZGUpIHtcclxuICAgICAgcmV0dXJuIG5ldyBUeXBlKHR5cGVzLk9CSkVDVCwgdHlwZXMuSFRNTF9FTEVNRU5ULCBvYmoubm9kZU5hbWUpO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgLmFkZChmdW5jdGlvbihvYmopIHtcclxuICAgIC8vIHByb2JhYmx5IGF0IHRoZSBiZWdnaW5naW5nIHNob3VsZCBiZSBlbm91Z2ggdGhlc2UgY2hlY2tzXHJcbiAgICBpZihvYmouQm9vbGVhbiA9PT0gQm9vbGVhbiAmJiBvYmouTnVtYmVyID09PSBOdW1iZXIgJiYgb2JqLlN0cmluZyA9PT0gU3RyaW5nICYmIG9iai5EYXRlID09PSBEYXRlKSB7XHJcbiAgICAgIHJldHVybiBuZXcgVHlwZSh0eXBlcy5PQkpFQ1QsIHR5cGVzLkhPU1QpO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgLmFkZChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgVHlwZSh0eXBlcy5PQkpFQ1QpO1xyXG4gIH0pO1xyXG5cclxuLyoqXHJcbiAqIEdldCB0eXBlIGluZm9ybWF0aW9uIG9mIGFueXRoaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSAge2FueX0gb2JqIEFueXRoaW5nIHRoYXQgY291bGQgcmVxdWlyZSB0eXBlIGluZm9ybWF0aW9uXHJcbiAqIEByZXR1cm4ge1R5cGV9ICAgIHR5cGUgaW5mb1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0R2xvYmFsVHlwZShvYmopIHtcclxuICByZXR1cm4gbWFpbi5nZXRUeXBlKG9iaik7XHJcbn1cclxuXHJcbmdldEdsb2JhbFR5cGUuY2hlY2tlciA9IG1haW47XHJcbmdldEdsb2JhbFR5cGUuVHlwZUNoZWNrZXIgPSBUeXBlQ2hlY2tlcjtcclxuZ2V0R2xvYmFsVHlwZS5UeXBlID0gVHlwZTtcclxuXHJcbk9iamVjdC5rZXlzKHR5cGVzKS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGVOYW1lKSB7XHJcbiAgZ2V0R2xvYmFsVHlwZVt0eXBlTmFtZV0gPSB0eXBlc1t0eXBlTmFtZV07XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnZXRHbG9iYWxUeXBlO1xyXG4iLCJ2YXIgdHlwZXMgPSB7XHJcbiAgTlVNQkVSOiAnbnVtYmVyJyxcclxuICBVTkRFRklORUQ6ICd1bmRlZmluZWQnLFxyXG4gIFNUUklORzogJ3N0cmluZycsXHJcbiAgQk9PTEVBTjogJ2Jvb2xlYW4nLFxyXG4gIE9CSkVDVDogJ29iamVjdCcsXHJcbiAgRlVOQ1RJT046ICdmdW5jdGlvbicsXHJcbiAgTlVMTDogJ251bGwnLFxyXG4gIEFSUkFZOiAnYXJyYXknLFxyXG4gIFJFR0VYUDogJ3JlZ2V4cCcsXHJcbiAgREFURTogJ2RhdGUnLFxyXG4gIEVSUk9SOiAnZXJyb3InLFxyXG4gIEFSR1VNRU5UUzogJ2FyZ3VtZW50cycsXHJcbiAgU1lNQk9MOiAnc3ltYm9sJyxcclxuICBBUlJBWV9CVUZGRVI6ICdhcnJheS1idWZmZXInLFxyXG4gIFRZUEVEX0FSUkFZOiAndHlwZWQtYXJyYXknLFxyXG4gIERBVEFfVklFVzogJ2RhdGEtdmlldycsXHJcbiAgTUFQOiAnbWFwJyxcclxuICBTRVQ6ICdzZXQnLFxyXG4gIFdFQUtfU0VUOiAnd2Vhay1zZXQnLFxyXG4gIFdFQUtfTUFQOiAnd2Vhay1tYXAnLFxyXG4gIFBST01JU0U6ICdwcm9taXNlJyxcclxuXHJcbi8vIG5vZGUgYnVmZmVyXHJcbiAgQlVGRkVSOiAnYnVmZmVyJyxcclxuXHJcbi8vIGRvbSBodG1sIGVsZW1lbnRcclxuICBIVE1MX0VMRU1FTlQ6ICdodG1sLWVsZW1lbnQnLFxyXG4gIEhUTUxfRUxFTUVOVF9URVhUOiAnaHRtbC1lbGVtZW50LXRleHQnLFxyXG4gIERPQ1VNRU5UOiAnZG9jdW1lbnQnLFxyXG4gIFdJTkRPVzogJ3dpbmRvdycsXHJcbiAgRklMRTogJ2ZpbGUnLFxyXG4gIEZJTEVfTElTVDogJ2ZpbGUtbGlzdCcsXHJcbiAgQkxPQjogJ2Jsb2InLFxyXG5cclxuICBIT1NUOiAnaG9zdCcsXHJcblxyXG4gIFhIUjogJ3hocidcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdHlwZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2lzU3RyaW5nID0gcmVxdWlyZSgnbG9kYXNoL2lzU3RyaW5nJyk7XG52YXIgX2lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNQbGFpbk9iamVjdCcpO1xudmFyIF9pc0Z1bmN0aW9uID0gcmVxdWlyZSgnbG9kYXNoL2lzRnVuY3Rpb24nKTtcbnZhciBfZ2V0ID0gcmVxdWlyZSgnbG9kYXNoL2dldCcpO1xudmFyIF9zZXQgPSByZXF1aXJlKCdsb2Rhc2gvc2V0Jyk7XG52YXIgX2RlZmF1bHRzRGVlcCA9IHJlcXVpcmUoJ2xvZGFzaC9kZWZhdWx0c0RlZXAnKTtcbnZhciBfdHJpbVJpZ2h0ID0gcmVxdWlyZSgnbG9kYXNoL3RyaW1FbmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbnNwaXJhdGlvbkFyY2hpdGVjdEZhY3RvcnkoZmFjdG9yeV9jb25maWcpIHtcblxuICAgIHZhciBkZWZhdWx0X2ZhY3RvcnlfY29uZmlnID0ge1xuICAgICAgICBjb25maWdfZmlsZXM6IHt9LFxuICAgICAgICBjb25maWdfZmlsZXNfdXNlX2V4dDogJy5qcycsXG4gICAgICAgIGFwcF9jb25maWdfcGF0aDogJ2NvbmZpZycsXG4gICAgICAgIGNvbmZpZ19lbnZfZmlsZW5hbWU6ICcuZW52JyxcbiAgICAgICAgY29uZmlnX2FwcF9maWxlbmFtZTogJ2FwcCcsXG4gICAgICAgIGNvbmZpZ19wcm92aWRlcnNfcGF0aDogJ3Byb3ZpZGVycycsXG4gICAgICAgIHByb3ZpZGVyX2ZpbGVzOiB7fVxuICAgIH07XG5cbiAgICBmYWN0b3J5X2NvbmZpZyA9IF9kZWZhdWx0c0RlZXAoZmFjdG9yeV9jb25maWcgfHwge30sIGRlZmF1bHRfZmFjdG9yeV9jb25maWcpO1xuXG4gICAgcmV0dXJuIGNsYXNzIEluc3BpcmF0aW9uQXJjaGl0ZWN0IHtcblxuICAgICAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGluaXRpYWwgPSBfZGVmYXVsdHNEZWVwKGluaXRpYWwsIHtcbiAgICAgICAgICAgICAgICBhcHA6IHt9LFxuICAgICAgICAgICAgICAgIGNvbmZpZzoge30sXG4gICAgICAgICAgICAgICAgcHJvdmlkZXJzOiBbXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwID0gaW5pdGlhbC5hcHA7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IGluaXRpYWwuY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5wcm92aWRlcnMgPSBpbml0aWFsLnByb3ZpZGVycztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbG9hZENvbmZpZyhjYWxsYmFjaykge1xuXG4gICAgICAgICAgICBpZiAoX2lzU3RyaW5nKGZhY3RvcnlfY29uZmlnLmNvbmZpZ19maWxlcykpIHtcblxuICAgICAgICAgICAgICAgIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbiAgICAgICAgICAgICAgICBmcy5yZWFkZGlyKGZhY3RvcnlfY29uZmlnLmNvbmZpZ19maWxlcywgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25maWdfZmlsZXMgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGZpbGVzLmxlbmd0aDsgeCsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbeF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWdfZmlsZXNbZmlsZV0gPSByZXF1aXJlKHBhdGguam9pbihmYWN0b3J5X2NvbmZpZy5jb25maWdfZmlsZXMsIGZpbGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlQ29uZmlnRmlsZXMoY29uZmlnX2ZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX2lzUGxhaW5PYmplY3QoZmFjdG9yeV9jb25maWcuY29uZmlnX2ZpbGVzKSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMudXNlQ29uZmlnRmlsZXMoZmFjdG9yeV9jb25maWcuY29uZmlnX2ZpbGVzKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VDb25maWdGaWxlcygpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1c2VDb25maWdGaWxlcyhjb25maWdfZmlsZXMpIHtcblxuICAgICAgICAgICAgaWYgKCFjb25maWdfZmlsZXMpIHtcbiAgICAgICAgICAgICAgICBjb25maWdfZmlsZXMgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFkZHRsX2NvbmZpZyA9IHt9O1xuICAgICAgICAgICAgdmFyIGVudl9jb25maWcgPSB7fTtcbiAgICAgICAgICAgIHZhciBhcHBfY29uZmlnID0ge307XG5cbiAgICAgICAgICAgIGZvciAodmFyIGZpbGUgaW4gY29uZmlnX2ZpbGVzKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZmFjdG9yeV9jb25maWcuY29uZmlnX2ZpbGVzX3VzZV9leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IF90cmltUmlnaHQoZmlsZSwgZmFjdG9yeV9jb25maWcuY29uZmlnX2ZpbGVzX3VzZV9leHQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbmZpZ19maWxlc1tmaWxlXTtcblxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IGZhY3RvcnlfY29uZmlnLmNvbmZpZ19lbnZfZmlsZW5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZW52X2NvbmZpZyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBmYWN0b3J5X2NvbmZpZy5jb25maWdfYXBwX2ZpbGVuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcF9jb25maWcgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhZGR0bF9jb25maWdba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9jb25maWcgPSBfZGVmYXVsdHNEZWVwKHt9LCB0aGlzLmNvbmZpZywgZW52X2NvbmZpZywgYXBwX2NvbmZpZywgYWRkdGxfY29uZmlnKTtcblxuICAgICAgICAgICAgX3NldCh0aGlzLmFwcCwgZmFjdG9yeV9jb25maWcuYXBwX2NvbmZpZ19wYXRoLCAocGF0aCwgZGVmYXVsdF92YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfZ2V0KF9jb25maWcsIHBhdGgsIGRlZmF1bHRfdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkUHJvdmlkZXJzKGNhbGxiYWNrKSB7XG5cbiAgICAgICAgICAgIHZhciBsb2FkUHJvdmlkZXIgPSAocHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdmlkZXI7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoX2lzU3RyaW5nKGZhY3RvcnlfY29uZmlnLnByb3ZpZGVyX2ZpbGVzKSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbiAgICAgICAgICAgICAgICBsb2FkUHJvdmlkZXIgPSAocHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUocGF0aC5qb2luKGZhY3RvcnlfY29uZmlnLnByb3ZpZGVyX2ZpbGVzLCBwcm92aWRlcikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIGlmIChfaXNQbGFpbk9iamVjdChmYWN0b3J5X2NvbmZpZy5wcm92aWRlcl9maWxlcykpIHtcblxuICAgICAgICAgICAgICAgIGxvYWRQcm92aWRlciA9IChwcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFjdG9yeV9jb25maWcucHJvdmlkZXJfZmlsZXNbcHJvdmlkZXJdO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhZGR0bF9wcm92aWRlcnMgPSBfZ2V0KHRoaXMuYXBwLCBmYWN0b3J5X2NvbmZpZy5hcHBfY29uZmlnX3BhdGgpKGZhY3RvcnlfY29uZmlnLmNvbmZpZ19wcm92aWRlcnNfcGF0aCwgW10pO1xuXG4gICAgICAgICAgICB2YXIgcHJvdmlkZXJzID0gdGhpcy5wcm92aWRlcnMuY29uY2F0KGFkZHRsX3Byb3ZpZGVycyk7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xuXG4gICAgICAgICAgICB2YXIgbmV4dCA9IChlcnIpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgaW5kZXggPT09IHByb3ZpZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHByb3ZpZGVyID0gcHJvdmlkZXJzW2luZGV4KytdO1xuXG4gICAgICAgICAgICAgICAgaWYgKF9pc1N0cmluZyhwcm92aWRlcikpIHtcblxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlciA9IGxvYWRQcm92aWRlcihwcm92aWRlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFfaXNGdW5jdGlvbihwcm92aWRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKGBQcm92aWRlciAke2luZGV4fSBpcyBub3QgYSBmdW5jdGlvbi5gKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcih0aGlzLmFwcCwgbmV4dCk7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgICAgICBpbml0KGNhbGxiYWNrKSB7XG5cbiAgICAgICAgICAgIHZhciBmbnMgPSBbXG4gICAgICAgICAgICAgICAgKG5leHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ29uZmlnKG5leHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKG5leHQpPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRQcm92aWRlcnMobmV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcblxuICAgICAgICAgICAgdmFyIG5leHQgPSAoZXJyKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyIHx8IGluZGV4ID09PSBmbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHRoaXMuYXBwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZm4gPSBmbnNbaW5kZXgrK107XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgICAgIGZuKG5leHQpO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcblxuICAgICAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldCBmYWN0b3J5X2NvbmZpZygpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5X2NvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRpYyBnZXQgZGVmYXVsdF9mYWN0b3J5X2NvbmZpZygpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0X2ZhY3RvcnlfY29uZmlnO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeSA9IHJlcXVpcmUoJy4uL3NyYy9mYWN0b3J5Jyk7XG5cbnZhciBzaG91bGQgPSByZXF1aXJlKCdzaG91bGQnKTtcblxudmFyIF9nZXQgPSByZXF1aXJlKCdsb2Rhc2gvZ2V0Jyk7XG52YXIgX3NldCA9IHJlcXVpcmUoJ2xvZGFzaC9zZXQnKTtcblxudmFyIGdsb2JhbFRlc3RzID0gcmVxdWlyZSgnLi9nbG9iYWwtdGVzdHMnKTtcbnZhciBmYWN0b3J5VGVzdHMgPSByZXF1aXJlKCcuL2ZhY3RvcnktdGVzdHMnKTtcblxudmFyIGNvbmZpZ19maWxlcyA9IHJlcXVpcmUoJy4uL3Rlc3QvZml4dHVyZXMvc2FtcGxlLWFwcC9jb25maWcvKi5qcycsIHttb2RlOiAnaGFzaCcsIG9wdGlvbnM6IHtkb3Q6IHRydWV9fSk7XG52YXIgZW1wdHlfY29uZmlnX2ZpbGVzID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9lbXB0eS8qLmpzJywge21vZGU6ICdoYXNoJ30pO1xudmFyIHByb3ZpZGVyX2ZpbGVzID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9zYW1wbGUtYXBwL3Byb3ZpZGVycy8qLmpzJywge21vZGU6ICdoYXNoJ30pO1xudmFyIGVtcHR5X3Byb3ZpZGVyX2ZpbGVzID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9lbXB0eS8qLmpzJywge21vZGU6ICdoYXNoJ30pO1xuXG5mYWN0b3J5VGVzdHMoKTtcblxuZGVzY3JpYmUoJ2Jyb3dzZXJpZnkgdGVzdHMnLCBmdW5jdGlvbigpIHtcblxuICAgIGRlc2NyaWJlKCdkaWZmZXJlbnQgY29uZmlnIGZpbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmFjdG9yeV9jb25maWcgPSB7XG4gICAgICAgICAgICBjb25maWdfZmlsZXM6IGNvbmZpZ19maWxlc1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBJbnNwaXJhdGlvbiA9IGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeShmYWN0b3J5X2NvbmZpZyk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBydW4gdGhlIGJhc2ljIHRlc3RzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGdsb2JhbFRlc3RzKEluc3BpcmF0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBob25vciB0aGUgc2VydmVyIGNvbmZpZyBmaWxlcycsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKCk7XG5cbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hvdWxkKGluc3BpcmF0aW9uLmFwcC5jb25maWcoJ2Ffc2FtcGxlJykpLmVxdWFsKCdvbmUnKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnYl9zYW1wbGUnKSkuZXF1YWwoJ3R3bycpO1xuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdlX3NhbXBsZS5mX3NhbXBsZS5nX3NhbXBsZScpKS5lcXVhbCg1KTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnZXh0ZXJuYWwuaF9zYW1wbGUnKSkuZXF1YWwoJ2hlbGxvJyk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBvdmVyd3JpdGUgc2VydmVyIGNvbmZpZyBmaWxlcycsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBhX3NhbXBsZTogJ292ZXJ3cml0dGVuJyxcbiAgICAgICAgICAgICAgICBiX3NhbXBsZTogJ2Fsc28gb3ZlcndyaXR0ZW4nLFxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiB7XG4gICAgICAgICAgICAgICAgICAgIGhfc2FtcGxlOiAndGhpcyBpcyBhbHNvIG92ZXJ3cml0dGVuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe1xuICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5zcGlyYXRpb24uaW5pdChmdW5jdGlvbihlcnIpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnYV9zYW1wbGUnKSkuZXF1YWwoY29uZmlnLmFfc2FtcGxlKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnYl9zYW1wbGUnKSkuZXF1YWwoY29uZmlnLmJfc2FtcGxlKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnZXh0ZXJuYWwuaF9zYW1wbGUnKSkuZXF1YWwoY29uZmlnLmV4dGVybmFsLmhfc2FtcGxlKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnZXh0ZXJuYWwuaV9zYW1wbGUnKSkubm90LmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbm8gY29uZmlnIGZpbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmFjdG9yeV9jb25maWcgPSB7XG4gICAgICAgICAgICBjb25maWdfZmlsZXM6IGVtcHR5X2NvbmZpZ19maWxlc1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBJbnNwaXJhdGlvbiA9IGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeShmYWN0b3J5X2NvbmZpZyk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBydW4gdGhlIGJhc2ljIHRlc3RzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGdsb2JhbFRlc3RzKEluc3BpcmF0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIG92ZXJ3cml0ZSBlbXB0eSBzZXJ2ZXIgY29uZmlnIGZpbGVzJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGFfc2FtcGxlOiAnb3ZlcndyaXR0ZW4nLFxuICAgICAgICAgICAgICAgIGJfc2FtcGxlOiAnYWxzbyBvdmVyd3JpdHRlbicsXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgaF9zYW1wbGU6ICd0aGlzIGlzIGFsc28gb3ZlcndyaXR0ZW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbih7XG4gICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdhX3NhbXBsZScpKS5lcXVhbChjb25maWcuYV9zYW1wbGUpO1xuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdiX3NhbXBsZScpKS5lcXVhbChjb25maWcuYl9zYW1wbGUpO1xuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdleHRlcm5hbC5oX3NhbXBsZScpKS5lcXVhbChjb25maWcuZXh0ZXJuYWwuaF9zYW1wbGUpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdyZWZlcmVuY2Ugc2VydmVyIHByb3ZpZGVycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGZhY3RvcnlfY29uZmlnID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJfZmlsZXM6IHByb3ZpZGVyX2ZpbGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIEluc3BpcmF0aW9uID0gaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KGZhY3RvcnlfY29uZmlnKTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJ1biB0aGUgc2VydmVyIHByb3ZpZGVycyBiYXNlZCBvbiB0aGUgY29uZmlnJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhZGRTb21ldGhpbmdBc3luYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYWRkU29tZXRoaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5kb1NvbWV0aGluZ0Vsc2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLmRvU29tZXRoaW5nQXN5bmMoKS5zaG91bGQuZXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLmRvU29tZXRoaW5nKCkuc2hvdWxkLmVxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5kb1NvbWV0aGluZ0Vsc2UoKS5zaG91bGQuZXF1YWwoMyk7XG5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdubyBwcm92aWRlciBmaWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGZhY3RvcnlfY29uZmlnID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJfZmlsZXM6IGVtcHR5X3Byb3ZpZGVyX2ZpbGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIEluc3BpcmF0aW9uID0gaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KGZhY3RvcnlfY29uZmlnKTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJ1biB0aGUgYmFzaWMgdGVzdHMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgZ2xvYmFsVGVzdHMoSW5zcGlyYXRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHN0aWxsIHJ1biBpbml0aWFsIHByb3ZpZGVycycsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKHtcbiAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYXBwLCBkb25lKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zb21ldGhpbmdfcHJvcGVydHkgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhcHAsIGRvbmUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNvbWV0aGluZ19vdGhlcl9wcm9wZXJ0eSA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zb21ldGhpbmdfdGhpcmRfcHJvcGVydHkgPSAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmdfcHJvcGVydHkuc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmdfb3RoZXJfcHJvcGVydHkuc2hvdWxkLmVxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmdfdGhpcmRfcHJvcGVydHkuc2hvdWxkLmVxdWFsKDMpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2RpZmZlcmVudCBmYWN0b3J5IGNvbmZpZyB2YWx1ZXMgY29tYmluZWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgY29uZmlnX2Vudl9maWxlbmFtZSA9ICdsb2NhbCc7XG4gICAgICAgIHZhciBjb25maWdfYXBwX2ZpbGVuYW1lID0gJ2FwcGxpY2F0aW9uJztcbiAgICAgICAgdmFyIGNvbmZpZ19wcm92aWRlcnNfcGF0aCA9ICd0aGVzZS5hcmUubXkucHJvdmlkZXJzJztcbiAgICAgICAgdmFyIGFwcF9jb25maWdfcGF0aCA9ICdsb2NhbHMuY29uZmlnJztcblxuICAgICAgICB2YXIgZmFjdG9yeV9jb25maWcgPSB7XG4gICAgICAgICAgICBjb25maWdfZmlsZXM6IHt9LFxuICAgICAgICAgICAgY29uZmlnX2Vudl9maWxlbmFtZTogY29uZmlnX2Vudl9maWxlbmFtZSxcbiAgICAgICAgICAgIGNvbmZpZ19hcHBfZmlsZW5hbWU6IGNvbmZpZ19hcHBfZmlsZW5hbWUsXG4gICAgICAgICAgICBjb25maWdfcHJvdmlkZXJzX3BhdGg6IGNvbmZpZ19wcm92aWRlcnNfcGF0aCxcbiAgICAgICAgICAgIGFwcF9jb25maWdfcGF0aDogYXBwX2NvbmZpZ19wYXRoLFxuICAgICAgICAgICAgcHJvdmlkZXJfZmlsZXM6IHByb3ZpZGVyX2ZpbGVzXG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnlfY29uZmlnLmNvbmZpZ19maWxlc1tjb25maWdfZW52X2ZpbGVuYW1lXSA9IHtcbiAgICAgICAgICAgIGdyZWV0aW5nOiAnYWxvaGEnXG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnlfY29uZmlnLmNvbmZpZ19maWxlc1tjb25maWdfYXBwX2ZpbGVuYW1lXSA9IHtcbiAgICAgICAgICAgIGdyZWV0aW5nOiAnaGVsbG8nLFxuICAgICAgICAgICAgcGFydGluZzogJ2dvb2RieWUnXG4gICAgICAgIH07XG4gICAgICAgIF9zZXQoZmFjdG9yeV9jb25maWcuY29uZmlnX2ZpbGVzW2NvbmZpZ19hcHBfZmlsZW5hbWVdLCBjb25maWdfcHJvdmlkZXJzX3BhdGgsIFtcbiAgICAgICAgICAgICdhZGRTb21ldGhpbmcnXG4gICAgICAgIF0pO1xuXG4gICAgICAgIHZhciBJbnNwaXJhdGlvbiA9IGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeShmYWN0b3J5X2NvbmZpZyk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBob25vciB0aGUgZmFjdG9yeSBjb25maWcnLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbigpO1xuICAgICAgICAgICAgaW5zcGlyYXRpb24udGVzdCA9IHRydWU7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpZyA9IF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpO1xuICAgICAgICAgICAgICAgIHNob3VsZChjb25maWcoJ2dyZWV0aW5nJykpLmVxdWFsKCdhbG9oYScpO1xuICAgICAgICAgICAgICAgIHNob3VsZChjb25maWcoJ3BhcnRpbmcnKSkuZXF1YWwoJ2dvb2RieWUnKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuZG9Tb21ldGhpbmcoKS5zaG91bGQuZXF1YWwoMik7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHNob3VsZCA9IHJlcXVpcmUoJ3Nob3VsZCcpO1xudmFyIF9nZXQgPSByZXF1aXJlKCdsb2Rhc2gvZ2V0Jyk7XG52YXIgX3NldCA9IHJlcXVpcmUoJ2xvZGFzaC9zZXQnKTtcbnZhciBnbG9iYWxUZXN0cyA9IHJlcXVpcmUoJy4vZ2xvYmFsLXRlc3RzJyk7XG52YXIgaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5ID0gcmVxdWlyZSgnLi4vc3JjL2ZhY3RvcnknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmYWN0b3J5VGVzdHMoKSB7XG4gICAgZGVzY3JpYmUoJ2ZhY3RvcnknLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBkZXNjcmliZSgnZW1wdHkgZmFjdG9yeSBjb25maWcnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIEluc3BpcmF0aW9uID0gaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KCk7XG5cbiAgICAgICAgICAgIGdsb2JhbFRlc3RzKEluc3BpcmF0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2RpZmZlcmVudCBhcHAgY29uZmlnIHBhdGgnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGZhY3RvcnlfY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGFwcF9jb25maWdfcGF0aDogJ2xvY2Fscy5jb25maWcnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgSW5zcGlyYXRpb24gPSBpbnNwaXJhdGlvbkFyY2hpdGVjdEZhY3RvcnkoZmFjdG9yeV9jb25maWcpO1xuXG4gICAgICAgICAgICBnbG9iYWxUZXN0cyhJbnNwaXJhdGlvbik7XG5cbiAgICAgICAgICAgIGRlc2NyaWJlKCdsb2NhbHMuY29uZmlnJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gYWNjZXNzIHRoZSBjb25maWcgYXQgbG9jYWxzLmNvbmZpZycsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZXRpbmc6ICdoZWxsbydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uaW5pdChmdW5jdGlvbihlcnIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkKF9nZXQoaW5zcGlyYXRpb24uYXBwLCBmYWN0b3J5X2NvbmZpZy5hcHBfY29uZmlnX3BhdGgpKS5ub3QuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5sb2NhbHMuY29uZmlnKCdncmVldGluZycpLnNob3VsZC5lcXVhbCgnaGVsbG8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2RpZmZlcmVudCBjb25maWcgcHJvdmlkZXJzIHBhdGgnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGZhY3RvcnlfY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGNvbmZpZ19wcm92aWRlcnNfcGF0aDogJ2N1c3RvbS5wcm92aWRlcnMnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgSW5zcGlyYXRpb24gPSBpbnNwaXJhdGlvbkFyY2hpdGVjdEZhY3RvcnkoZmFjdG9yeV9jb25maWcpO1xuXG4gICAgICAgICAgICBnbG9iYWxUZXN0cyhJbnNwaXJhdGlvbik7XG5cbiAgICAgICAgICAgIGRlc2NyaWJlKCdjdXN0b20ucHJvdmlkZXJzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gdXNlIGN1c3RvbS5wcm92aWRlcnMgYXMgdGhlIGNvbmZpZyBwYXRoIHRvIGdldCBwcm92aWRlcnMnLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBfc2V0KGNvbmZpZywgJ2N1c3RvbS5wcm92aWRlcnMnLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhcHAsIGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHAuc29tZXRoaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnaGVsbG8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdjdXN0b20ucHJvdmlkZXJzJykpLm5vdC5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNvbWV0aGluZygpLnNob3VsZC5lcXVhbCgnaGVsbG8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59OyIsInZhciBzaG91bGQgPSByZXF1aXJlKCdzaG91bGQnKTtcbnZhciBfZ2V0ID0gcmVxdWlyZSgnbG9kYXNoL2dldCcpO1xudmFyIF9zZXQgPSByZXF1aXJlKCdsb2Rhc2gvc2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2xvYmFsVGVzdHMoSW5zcGlyYXRpb24pIHtcblxuICAgIHZhciBhcHBfY29uZmlnX3BhdGggPSBJbnNwaXJhdGlvbi5mYWN0b3J5X2NvbmZpZy5hcHBfY29uZmlnX3BhdGg7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBubyBpbml0aWFscycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGEgbmV3IGluc3BpcmF0aW9uIGNsYXNzLCB0aGVuIGEgbmV3IGluc3RhbmNlLCB3aXRoIGEgY29uZmlnIGZ1bmN0aW9uLicsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKCk7XG5cbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hvdWxkKF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKS5ub3QuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBhbiBpbml0aWFsIGFwcCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBhcHAgPSB7XG4gICAgICAgICAgICBuYW1lOiAnTXkgQ29vbCBBcHAnXG4gICAgICAgIH07XG5cblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG5ldyBpbnNwaXJhdGlvbiBjbGFzcywgdGhlbiBhIG5ldyBpbnN0YW5jZSB3aXRoIHRoZSBpbml0aWFsIGFwcC4nLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbih7YXBwOiBhcHB9KTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zaG91bGQuZXF1YWwoYXBwKTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnbmFtZScsIGFwcC5uYW1lKTtcblxuICAgICAgICAgICAgaW5zcGlyYXRpb24uaW5pdChmdW5jdGlvbihlcnIpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaG91bGQoX2dldChpbnNwaXJhdGlvbi5hcHAsIGFwcF9jb25maWdfcGF0aCkpLm5vdC5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYW4gaW5pdGlhbCBjb25maWcnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgYTogJ2hvbGEnLFxuICAgICAgICAgICAgYjoge1xuICAgICAgICAgICAgICAgIGM6ICdhbG9oYSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG5ldyBpbnNwaXJhdGlvbiBjbGFzcywgdGhlbiBhIG5ldyBpbnN0YW5jZS4nLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbih7Y29uZmlnOiBjb25maWd9KTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmNvbmZpZy5zaG91bGQuZXF1YWwoY29uZmlnKTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzaG91bGQoX2dldChpbnNwaXJhdGlvbi5hcHAsIGFwcF9jb25maWdfcGF0aCkpLm5vdC5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKCdhJykuc2hvdWxkLmVxdWFsKGNvbmZpZy5hKTtcbiAgICAgICAgICAgICAgICBfZ2V0KGluc3BpcmF0aW9uLmFwcCwgYXBwX2NvbmZpZ19wYXRoKSgnYi5jJykuc2hvdWxkLmVxdWFsKGNvbmZpZy5iLmMpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGFuIGluaXRpYWwgYXBwIGFuZCBhbiBpbml0aWFsIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBhcHAgPSB7XG4gICAgICAgICAgICBuYW1lOiAnTXkgQ29vbCBBcHAnXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGE6ICdob2xhJyxcbiAgICAgICAgICAgIGI6IHtcbiAgICAgICAgICAgICAgICBjOiAnYWxvaGEnXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBuZXcgaW5zcGlyYXRpb24gY2xhc3MsIHRoZW4gYSBuZXcgaW5zdGFuY2UuJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe2FwcDogYXBwLCBjb25maWc6IGNvbmZpZ30pO1xuICAgICAgICAgICAgaW5zcGlyYXRpb24uY29uZmlnLnNob3VsZC5lcXVhbChjb25maWcpO1xuICAgICAgICAgICAgaW5zcGlyYXRpb24uaW5pdChmdW5jdGlvbihlcnIpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmVxdWFsKGFwcCk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNob3VsZC5oYXZlLnByb3BlcnR5KCduYW1lJywgYXBwLm5hbWUpO1xuICAgICAgICAgICAgICAgIHNob3VsZChfZ2V0KGluc3BpcmF0aW9uLmFwcCwgYXBwX2NvbmZpZ19wYXRoKSkubm90LmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgX2dldChpbnNwaXJhdGlvbi5hcHAsIGFwcF9jb25maWdfcGF0aCkoJ2EnKS5zaG91bGQuZXF1YWwoY29uZmlnLmEpO1xuICAgICAgICAgICAgICAgIF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKCdiLmMnKS5zaG91bGQuZXF1YWwoY29uZmlnLmIuYyk7XG5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIGRlc2NyaWJlKCd3aXRoIGFuIGluaXRpYWwgc2V0IG9mIHByb3ZpZGVycycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBwcm92aWRlcnMgPSBbXG4gICAgICAgICAgICBmdW5jdGlvbihhcHAsIGRvbmUpIHtcbiAgICAgICAgICAgICAgICBhcHAuc29tZXRoaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBhcHAuc29tZXRoaW5nQXN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG5ldyBpbnNwaXJhdGlvbiBjbGFzcywgdGhlbiBhIG5ldyBpbnN0YW5jZS4nLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbih7cHJvdmlkZXJzOiBwcm92aWRlcnN9KTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLnByb3ZpZGVycy5zaG91bGQuZXF1YWwocHJvdmlkZXJzKTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNob3VsZC5oYXZlLnByb3BlcnR5KCdzb21ldGhpbmcnKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc29tZXRoaW5nKCkuc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnc29tZXRoaW5nQXN5bmMnKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc29tZXRoaW5nQXN5bmMoKS5zaG91bGQuZXF1YWwoMik7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYW4gaW5pdGlhbCBhcHAsIGFuIGluaXRpYWwgY29uZmlnLCBhbmQgYW4gaW5pdGlhbCBzZXQgb2YgcHJvdmlkZXJzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGFwcCA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdNeSBDb29sIEFwcCdcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgYTogJ2hvbGEnLFxuICAgICAgICAgICAgYjoge1xuICAgICAgICAgICAgICAgIGM6ICdhbG9oYSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgX3NldChjb25maWcsIEluc3BpcmF0aW9uLmZhY3RvcnlfY29uZmlnLmNvbmZpZ19wcm92aWRlcnNfcGF0aCwgW1xuICAgICAgICAgICAgZnVuY3Rpb24oYXBwLCBkb25lKSB7XG4gICAgICAgICAgICAgICAgYXBwLnNvbWV0aGluZ0Vsc2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgdmFyIHByb3ZpZGVycyA9IFtcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuICAgICAgICAgICAgICAgIGFwcC5zb21ldGhpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oYXBwLCBkb25lKSB7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGFwcC5zb21ldGhpbmdBc3luYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGEgbmV3IGluc3BpcmF0aW9uIGNsYXNzLCB0aGVuIGEgbmV3IGluc3RhbmNlLicsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKHthcHA6IGFwcCwgY29uZmlnOiBjb25maWcsIHByb3ZpZGVyczogcHJvdmlkZXJzfSk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5jb25maWcuc2hvdWxkLmVxdWFsKGNvbmZpZyk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zaG91bGQuZXF1YWwoYXBwKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmhhdmUucHJvcGVydHkoJ25hbWUnLCBhcHAubmFtZSk7XG4gICAgICAgICAgICAgICAgc2hvdWxkKF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKS5ub3QuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICBfZ2V0KGluc3BpcmF0aW9uLmFwcCwgYXBwX2NvbmZpZ19wYXRoKSgnYScpLnNob3VsZC5lcXVhbChjb25maWcuYSk7XG4gICAgICAgICAgICAgICAgX2dldChpbnNwaXJhdGlvbi5hcHAsIGFwcF9jb25maWdfcGF0aCkoJ2IuYycpLnNob3VsZC5lcXVhbChjb25maWcuYi5jKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmhhdmUucHJvcGVydHkoJ3NvbWV0aGluZycpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmcoKS5zaG91bGQuZXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNob3VsZC5oYXZlLnByb3BlcnR5KCdzb21ldGhpbmdBc3luYycpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmdBc3luYygpLnNob3VsZC5lcXVhbCgyKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmhhdmUucHJvcGVydHkoJ3NvbWV0aGluZ0Vsc2UnKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc29tZXRoaW5nRWxzZSgpLnNob3VsZC5lcXVhbCgzKTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYV9zYW1wbGU6ICdvbmUnXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYV9zYW1wbGU6IDEsXG4gICAgYl9zYW1wbGU6ICd0d28nLFxuICAgIGNfc2FtcGxlOiBbXG4gICAgICAgIHRydWUsIHtcbiAgICAgICAgICAgIGRfc2FtcGxlOiA0XG4gICAgICAgIH1cbiAgICBdLFxuICAgIGVfc2FtcGxlOiB7XG4gICAgICAgIGZfc2FtcGxlOiB7XG4gICAgICAgICAgICBnX3NhbXBsZTogNVxuICAgICAgICB9XG4gICAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGhfc2FtcGxlOiAnaGVsbG8nLFxuICAgIGlfc2FtcGxlOiAnZ29vZGJ5ZSdcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRTb21ldGhpbmcoYXBwLCBkb25lKSB7XG5cbiAgICBhcHAuZG9Tb21ldGhpbmcgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICByZXR1cm4gMjtcbiAgICB9O1xuICAgIGRvbmUoKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRTb21ldGhpbmdBc3luYyhhcHAsIGRvbmUpIHtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICBhcHAuZG9Tb21ldGhpbmdBc3luYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH07XG4gICAgICAgIGRvbmUoKTtcbiAgICB9LCAxMDApO1xufTtcblxuIl19
