(function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
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
	    var timeout = runTimeout(cleanUpNextTick);
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
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var browser$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	/**
	 * If running on Nodejs 5.x and below, we load the transpiled code.
	 * Otherwise, we use the ES6 code.
	 * We are deprecating support for Node.js v5.x and below.
	 */
	const majorVersion = parseInt(browser$1.versions.node.split('.')[0], 10);
	if (majorVersion <= 5) {
	  const deprecate = require('depd')('node-telegram-bot-api');
	  deprecate('Node.js v5.x and below will no longer be supported in the future');
	  module.exports = require('./lib/telegram');
	} else {
	  module.exports = require('./src/telegram');
	}

	var nodeTelegramBotApi = /*#__PURE__*/Object.freeze({
		__proto__: null
	});

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	function toByteArray (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup[tmp >> 10];
	    output += lookup[(tmp >> 4) & 0x3F];
	    output += lookup[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString = {}.toString;

	var isArray = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var INSPECT_MAX_BYTES = 50;

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
	Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

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
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
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

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr
	};

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
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
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
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
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
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	Buffer.isBuffer = isBuffer;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
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
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
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

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
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
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

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
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray(buf)
	  } else {
	    return fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

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
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
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
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	/**
	 * Module dependencies.
	 */

	const EventEmitter = require('events').EventEmitter;
	const spawn = require('child_process').spawn;
	const path = require('path');
	const fs = require('fs');

	// @ts-check

	class Option {
	  /**
	   * Initialize a new `Option` with the given `flags` and `description`.
	   *
	   * @param {string} flags
	   * @param {string} description
	   * @api public
	   */

	  constructor(flags, description) {
	    this.flags = flags;
	    this.required = flags.indexOf('<') >= 0; // A value must be supplied when the option is specified.
	    this.optional = flags.indexOf('[') >= 0; // A value is optional when the option is specified.
	    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
	    this.negate = flags.indexOf('-no-') !== -1;
	    const flagParts = flags.split(/[ ,|]+/);
	    if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) this.short = flagParts.shift();
	    this.long = flagParts.shift();
	    this.description = description || '';
	    this.defaultValue = undefined;
	  }

	  /**
	   * Return option name.
	   *
	   * @return {string}
	   * @api private
	   */

	  name() {
	    return this.long.replace(/^--/, '');
	  };

	  /**
	   * Return option name, in a camelcase format that can be used
	   * as a object attribute key.
	   *
	   * @return {string}
	   * @api private
	   */

	  attributeName() {
	    return camelcase(this.name().replace(/^no-/, ''));
	  };

	  /**
	   * Check if `arg` matches the short or long flag.
	   *
	   * @param {string} arg
	   * @return {boolean}
	   * @api private
	   */

	  is(arg) {
	    return this.short === arg || this.long === arg;
	  };
	}

	/**
	 * CommanderError class
	 * @class
	 */
	class CommanderError extends Error {
	  /**
	   * Constructs the CommanderError class
	   * @param {number} exitCode suggested exit code which could be used with process.exit
	   * @param {string} code an id string representing the error
	   * @param {string} message human-readable description of the error
	   * @constructor
	   */
	  constructor(exitCode, code, message) {
	    super(message);
	    // properly capture stack trace in Node.js
	    Error.captureStackTrace(this, this.constructor);
	    this.name = this.constructor.name;
	    this.code = code;
	    this.exitCode = exitCode;
	    this.nestedError = undefined;
	  }
	}

	class Command extends EventEmitter {
	  /**
	   * Initialize a new `Command`.
	   *
	   * @param {string} [name]
	   * @api public
	   */

	  constructor(name) {
	    super();
	    this.commands = [];
	    this.options = [];
	    this.parent = null;
	    this._allowUnknownOption = false;
	    this._args = [];
	    this.rawArgs = null;
	    this._scriptPath = null;
	    this._name = name || '';
	    this._optionValues = {};
	    this._storeOptionsAsProperties = true; // backwards compatible by default
	    this._passCommandToAction = true; // backwards compatible by default
	    this._actionResults = [];
	    this._actionHandler = null;
	    this._executableHandler = false;
	    this._executableFile = null; // custom name for executable
	    this._defaultCommandName = null;
	    this._exitCallback = null;
	    this._aliases = [];

	    this._hidden = false;
	    this._helpFlags = '-h, --help';
	    this._helpDescription = 'display help for command';
	    this._helpShortFlag = '-h';
	    this._helpLongFlag = '--help';
	    this._hasImplicitHelpCommand = undefined; // Deliberately undefined, not decided whether true or false
	    this._helpCommandName = 'help';
	    this._helpCommandnameAndArgs = 'help [command]';
	    this._helpCommandDescription = 'display help for command';
	  }

	  /**
	   * Define a command.
	   *
	   * There are two styles of command: pay attention to where to put the description.
	   *
	   * Examples:
	   *
	   *      // Command implemented using action handler (description is supplied separately to `.command`)
	   *      program
	   *        .command('clone <source> [destination]')
	   *        .description('clone a repository into a newly created directory')
	   *        .action((source, destination) => {
	   *          console.log('clone command called');
	   *        });
	   *
	   *      // Command implemented using separate executable file (description is second parameter to `.command`)
	   *      program
	   *        .command('start <service>', 'start named service')
	   *        .command('stop [service]', 'stop named service, or all if no name supplied');
	   *
	   * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
	   * @param {Object|string} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
	   * @param {Object} [execOpts] - configuration options (for executable)
	   * @return {Command} returns new command for action handler, or `this` for executable command
	   * @api public
	   */

	  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
	    let desc = actionOptsOrExecDesc;
	    let opts = execOpts;
	    if (typeof desc === 'object' && desc !== null) {
	      opts = desc;
	      desc = null;
	    }
	    opts = opts || {};
	    const args = nameAndArgs.split(/ +/);
	    const cmd = this.createCommand(args.shift());

	    if (desc) {
	      cmd.description(desc);
	      cmd._executableHandler = true;
	    }
	    if (opts.isDefault) this._defaultCommandName = cmd._name;

	    cmd._hidden = !!(opts.noHelp || opts.hidden);
	    cmd._helpFlags = this._helpFlags;
	    cmd._helpDescription = this._helpDescription;
	    cmd._helpShortFlag = this._helpShortFlag;
	    cmd._helpLongFlag = this._helpLongFlag;
	    cmd._helpCommandName = this._helpCommandName;
	    cmd._helpCommandnameAndArgs = this._helpCommandnameAndArgs;
	    cmd._helpCommandDescription = this._helpCommandDescription;
	    cmd._exitCallback = this._exitCallback;
	    cmd._storeOptionsAsProperties = this._storeOptionsAsProperties;
	    cmd._passCommandToAction = this._passCommandToAction;

	    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
	    this.commands.push(cmd);
	    cmd._parseExpectedArgs(args);
	    cmd.parent = this;

	    if (desc) return this;
	    return cmd;
	  };

	  /**
	   * Factory routine to create a new unattached command.
	   *
	   * See .command() for creating an attached subcommand, which uses this routine to
	   * create the command. You can override createCommand to customise subcommands.
	   *
	   * @param {string} [name]
	   * @return {Command} new command
	   * @api public
	   */

	  createCommand(name) {
	    return new Command(name);
	  };

	  /**
	   * Add a prepared subcommand.
	   *
	   * See .command() for creating an attached subcommand which inherits settings from its parent.
	   *
	   * @param {Command} cmd - new subcommand
	   * @param {Object} [opts] - configuration options
	   * @return {Command} `this` command for chaining
	   * @api public
	   */

	  addCommand(cmd, opts) {
	    if (!cmd._name) throw new Error('Command passed to .addCommand() must have a name');

	    // To keep things simple, block automatic name generation for deeply nested executables.
	    // Fail fast and detect when adding rather than later when parsing.
	    function checkExplicitNames(commandArray) {
	      commandArray.forEach((cmd) => {
	        if (cmd._executableHandler && !cmd._executableFile) {
	          throw new Error(`Must specify executableFile for deeply nested executable: ${cmd.name()}`);
	        }
	        checkExplicitNames(cmd.commands);
	      });
	    }
	    checkExplicitNames(cmd.commands);

	    opts = opts || {};
	    if (opts.isDefault) this._defaultCommandName = cmd._name;
	    if (opts.noHelp || opts.hidden) cmd._hidden = true; // modifying passed command due to existing implementation

	    this.commands.push(cmd);
	    cmd.parent = this;
	    return this;
	  };

	  /**
	   * Define argument syntax for the command.
	   *
	   * @api public
	   */

	  arguments(desc) {
	    return this._parseExpectedArgs(desc.split(/ +/));
	  };

	  /**
	   * Override default decision whether to add implicit help command.
	   *
	   *    addHelpCommand() // force on
	   *    addHelpCommand(false); // force off
	   *    addHelpCommand('help [cmd]', 'display help for [cmd]'); // force on with custom detais
	   *
	   * @return {Command} `this` command for chaining
	   * @api public
	   */

	  addHelpCommand(enableOrNameAndArgs, description) {
	    if (enableOrNameAndArgs === false) {
	      this._hasImplicitHelpCommand = false;
	    } else {
	      this._hasImplicitHelpCommand = true;
	      if (typeof enableOrNameAndArgs === 'string') {
	        this._helpCommandName = enableOrNameAndArgs.split(' ')[0];
	        this._helpCommandnameAndArgs = enableOrNameAndArgs;
	      }
	      this._helpCommandDescription = description || this._helpCommandDescription;
	    }
	    return this;
	  };

	  /**
	   * @return {boolean}
	   * @api private
	   */

	  _lazyHasImplicitHelpCommand() {
	    if (this._hasImplicitHelpCommand === undefined) {
	      this._hasImplicitHelpCommand = this.commands.length && !this._actionHandler && !this._findCommand('help');
	    }
	    return this._hasImplicitHelpCommand;
	  };

	  /**
	   * Parse expected `args`.
	   *
	   * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
	   *
	   * @param {Array} args
	   * @return {Command} `this` command for chaining
	   * @api private
	   */

	  _parseExpectedArgs(args) {
	    if (!args.length) return;
	    args.forEach((arg) => {
	      const argDetails = {
	        required: false,
	        name: '',
	        variadic: false
	      };

	      switch (arg[0]) {
	        case '<':
	          argDetails.required = true;
	          argDetails.name = arg.slice(1, -1);
	          break;
	        case '[':
	          argDetails.name = arg.slice(1, -1);
	          break;
	      }

	      if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
	        argDetails.variadic = true;
	        argDetails.name = argDetails.name.slice(0, -3);
	      }
	      if (argDetails.name) {
	        this._args.push(argDetails);
	      }
	    });
	    this._args.forEach((arg, i) => {
	      if (arg.variadic && i < this._args.length - 1) {
	        throw new Error(`only the last argument can be variadic '${arg.name}'`);
	      }
	    });
	    return this;
	  };

	  /**
	   * Register callback to use as replacement for calling process.exit.
	   *
	   * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
	   * @return {Command} `this` command for chaining
	   * @api public
	   */

	  exitOverride(fn) {
	    if (fn) {
	      this._exitCallback = fn;
	    } else {
	      this._exitCallback = (err) => {
	        if (err.code !== 'commander.executeSubCommandAsync') {
	          throw err;
	        }
	      };
	    }
	    return this;
	  };

	  /**
	   * Call process.exit, and _exitCallback if defined.
	   *
	   * @param {number} exitCode exit code for using with process.exit
	   * @param {string} code an id string representing the error
	   * @param {string} message human-readable description of the error
	   * @return never
	   * @api private
	   */

	  _exit(exitCode, code, message) {
	    if (this._exitCallback) {
	      this._exitCallback(new CommanderError(exitCode, code, message));
	      // Expecting this line is not reached.
	    }
	    browser$1.exit(exitCode);
	  };

	  /**
	   * Register callback `fn` for the command.
	   *
	   * Examples:
	   *
	   *      program
	   *        .command('help')
	   *        .description('display verbose help')
	   *        .action(function() {
	   *           // output help here
	   *        });
	   *
	   * @param {Function} fn
	   * @return {Command} `this` command for chaining
	   * @api public
	   */

	  action(fn) {
	    const listener = (args) => {
	      // The .action callback takes an extra parameter which is the command or options.
	      const expectedArgsCount = this._args.length;
	      const actionArgs = args.slice(0, expectedArgsCount);
	      if (this._passCommandToAction) {
	        actionArgs[expectedArgsCount] = this;
	      } else {
	        actionArgs[expectedArgsCount] = this.opts();
	      }
	      // Add the extra arguments so available too.
	      if (args.length > expectedArgsCount) {
	        actionArgs.push(args.slice(expectedArgsCount));
	      }

	      const actionResult = fn.apply(this, actionArgs);
	      // Remember result in case it is async. Assume parseAsync getting called on root.
	      let rootCommand = this;
	      while (rootCommand.parent) {
	        rootCommand = rootCommand.parent;
	      }
	      rootCommand._actionResults.push(actionResult);
	    };
	    this._actionHandler = listener;
	    return this;
	  };

	  /**
	   * Internal implementation shared by .option() and .requiredOption()
	   *
	   * @param {Object} config
	   * @param {string} flags
	   * @param {string} description
	   * @param {Function|*} [fn] - custom option processing function or default vaue
	   * @param {*} [defaultValue]
	   * @return {Command} `this` command for chaining
	   * @api private
	   */

	  _optionEx(config, flags, description, fn, defaultValue) {
	    const option = new Option(flags, description);
	    const oname = option.name();
	    const name = option.attributeName();
	    option.mandatory = !!config.mandatory;

	    // default as 3rd arg
	    if (typeof fn !== 'function') {
	      if (fn instanceof RegExp) {
	        // This is a bit simplistic (especially no error messages), and probably better handled by caller using custom option processing.
	        // No longer documented in README, but still present for backwards compatibility.
	        const regex = fn;
	        fn = (val, def) => {
	          const m = regex.exec(val);
	          return m ? m[0] : def;
	        };
	      } else {
	        defaultValue = fn;
	        fn = null;
	      }
	    }

	    // preassign default value for --no-*, [optional], <required>, or plain flag if boolean value
	    if (option.negate || option.optional || option.required || typeof defaultValue === 'boolean') {
	      // when --no-foo we make sure default is true, unless a --foo option is already defined
	      if (option.negate) {
	        const positiveLongFlag = option.long.replace(/^--no-/, '--');
	        defaultValue = this._findOption(positiveLongFlag) ? this._getOptionValue(name) : true;
	      }
	      // preassign only if we have a default
	      if (defaultValue !== undefined) {
	        this._setOptionValue(name, defaultValue);
	        option.defaultValue = defaultValue;
	      }
	    }

	    // register the option
	    this.options.push(option);

	    // when it's passed assign the value
	    // and conditionally invoke the callback
	    this.on('option:' + oname, (val) => {
	      // coercion
	      if (val !== null && fn) {
	        val = fn(val, this._getOptionValue(name) === undefined ? defaultValue : this._getOptionValue(name));
	      }

	      // unassigned or boolean value
	      if (typeof this._getOptionValue(name) === 'boolean' || typeof this._getOptionValue(name) === 'undefined') {
	        // if no value, negate false, and we have a default, then use it!
	        if (val == null) {
	          this._setOptionValue(name, option.negate
	            ? false
	            : defaultValue || true);
	        } else {
	          this._setOptionValue(name, val);
	        }
	      } else if (val !== null) {
	        // reassign
	        this._setOptionValue(name, option.negate ? false : val);
	      }
	    });

	    return this;
	  };

	  /**
	   * Define option with `flags`, `description` and optional
	   * coercion `fn`.
	   *
	   * The `flags` string should contain both the short and long flags,
	   * separated by comma, a pipe or space. The following are all valid
	   * all will output this way when `--help` is used.
	   *
	   *    "-p, --pepper"
	   *    "-p|--pepper"
	   *    "-p --pepper"
	   *
	   * Examples:
	   *
	   *     // simple boolean defaulting to undefined
	   *     program.option('-p, --pepper', 'add pepper');
	   *
	   *     program.pepper
	   *     // => undefined
	   *
	   *     --pepper
	   *     program.pepper
	   *     // => true
	   *
	   *     // simple boolean defaulting to true (unless non-negated option is also defined)
	   *     program.option('-C, --no-cheese', 'remove cheese');
	   *
	   *     program.cheese
	   *     // => true
	   *
	   *     --no-cheese
	   *     program.cheese
	   *     // => false
	   *
	   *     // required argument
	   *     program.option('-C, --chdir <path>', 'change the working directory');
	   *
	   *     --chdir /tmp
	   *     program.chdir
	   *     // => "/tmp"
	   *
	   *     // optional argument
	   *     program.option('-c, --cheese [type]', 'add cheese [marble]');
	   *
	   * @param {string} flags
	   * @param {string} description
	   * @param {Function|*} [fn] - custom option processing function or default vaue
	   * @param {*} [defaultValue]
	   * @return {Command} `this` command for chaining
	   * @api public
	   */

	  option(flags, description, fn, defaultValue) {
	    return this._optionEx({}, flags, description, fn, defaultValue);
	  };

	  /*
	  * Add a required option which must have a value after parsing. This usually means
	  * the option must be specified on the command line. (Otherwise the same as .option().)
	  *
	  * The `flags` string should contain both the short and long flags, separated by comma, a pipe or space.
	  *
	  * @param {string} flags
	  * @param {string} description
	  * @param {Function|*} [fn] - custom option processing function or default vaue
	  * @param {*} [defaultValue]
	  * @return {Command} `this` command for chaining
	  * @api public
	  */

	  requiredOption(flags, description, fn, defaultValue) {
	    return this._optionEx({ mandatory: true }, flags, description, fn, defaultValue);
	  };

	  /**
	   * Allow unknown options on the command line.
	   *
	   * @param {Boolean} [arg] - if `true` or omitted, no error will be thrown
	   * for unknown options.
	   * @api public
	   */
	  allowUnknownOption(arg) {
	    this._allowUnknownOption = (arg === undefined) || arg;
	    return this;
	  };

	  /**
	    * Whether to store option values as properties on command object,
	    * or store separately (specify false). In both cases the option values can be accessed using .opts().
	    *
	    * @param {boolean} value
	    * @return {Command} `this` command for chaining
	    * @api public
	    */

	  storeOptionsAsProperties(value) {
	    this._storeOptionsAsProperties = (value === undefined) || value;
	    if (this.options.length) {
	      throw new Error('call .storeOptionsAsProperties() before adding options');
	    }
	    return this;
	  };

	  /**
	    * Whether to pass command to action handler,
	    * or just the options (specify false).
	    *
	    * @param {boolean} value
	    * @return {Command} `this` command for chaining
	    * @api public
	    */

	  passCommandToAction(value) {
	    this._passCommandToAction = (value === undefined) || value;
	    return this;
	  };

	  /**
	   * Store option value
	   *
	   * @param {string} key
	   * @param {Object} value
	   * @api private
	   */

	  _setOptionValue(key, value) {
	    if (this._storeOptionsAsProperties) {
	      this[key] = value;
	    } else {
	      this._optionValues[key] = value;
	    }
	  };

	  /**
	   * Retrieve option value
	   *
	   * @param {string} key
	   * @return {Object} value
	   * @api private
	   */

	  _getOptionValue(key) {
	    if (this._storeOptionsAsProperties) {
	      return this[key];
	    }
	    return this._optionValues[key];
	  };

	  /**
	   * Parse `argv`, setting options and invoking commands when defined.
	   *
	   * The default expectation is that the arguments are from node and have the application as argv[0]
	   * and the script being run in argv[1], with user parameters after that.
	   *
	   * Examples:
	   *
	   *      program.parse(process.argv);
	   *      program.parse(); // implicitly use process.argv and auto-detect node vs electron conventions
	   *      program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
	   *
	   * @param {string[]} [argv] - optional, defaults to process.argv
	   * @param {Object} [parseOptions] - optionally specify style of options with from: node/user/electron
	   * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
	   * @return {Command} `this` command for chaining
	   * @api public
	   */

	  parse(argv, parseOptions) {
	    if (argv !== undefined && !Array.isArray(argv)) {
	      throw new Error('first parameter to parse must be array or undefined');
	    }
	    parseOptions = parseOptions || {};

	    // Default to using process.argv
	    if (argv === undefined) {
	      argv = browser$1.argv;
	      // @ts-ignore
	      if (browser$1.versions && browser$1.versions.electron) {
	        parseOptions.from = 'electron';
	      }
	    }
	    this.rawArgs = argv.slice();

	    // make it a little easier for callers by supporting various argv conventions
	    let userArgs;
	    switch (parseOptions.from) {
	      case undefined:
	      case 'node':
	        this._scriptPath = argv[1];
	        userArgs = argv.slice(2);
	        break;
	      case 'electron':
	        // @ts-ignore
	        if (browser$1.defaultApp) {
	          this._scriptPath = argv[1];
	          userArgs = argv.slice(2);
	        } else {
	          userArgs = argv.slice(1);
	        }
	        break;
	      case 'user':
	        userArgs = argv.slice(0);
	        break;
	      default:
	        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
	    }
	    if (!this._scriptPath && browser$1.mainModule) {
	      this._scriptPath = browser$1.mainModule.filename;
	    }

	    // Guess name, used in usage in help.
	    this._name = this._name || (this._scriptPath && path.basename(this._scriptPath, path.extname(this._scriptPath)));

	    // Let's go!
	    this._parseCommand([], userArgs);

	    return this;
	  };

	  /**
	   * Parse `argv`, setting options and invoking commands when defined.
	   *
	   * Use parseAsync instead of parse if any of your action handlers are async. Returns a Promise.
	   *
	   * The default expectation is that the arguments are from node and have the application as argv[0]
	   * and the script being run in argv[1], with user parameters after that.
	   *
	   * Examples:
	   *
	   *      program.parseAsync(process.argv);
	   *      program.parseAsync(); // implicitly use process.argv and auto-detect node vs electron conventions
	   *      program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
	   *
	   * @param {string[]} [argv]
	   * @param {Object} [parseOptions]
	   * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
	   * @return {Promise}
	   * @api public
	   */

	  parseAsync(argv, parseOptions) {
	    this.parse(argv, parseOptions);
	    return Promise.all(this._actionResults).then(() => this);
	  };

	  /**
	   * Execute a sub-command executable.
	   *
	   * @api private
	   */

	  _executeSubCommand(subcommand, args) {
	    args = args.slice();
	    let launchWithNode = false; // Use node for source targets so do not need to get permissions correct, and on Windows.
	    const sourceExt = ['.js', '.ts', '.mjs'];

	    // Not checking for help first. Unlikely to have mandatory and executable, and can't robustly test for help flags in external command.
	    this._checkForMissingMandatoryOptions();

	    // Want the entry script as the reference for command name and directory for searching for other files.
	    const scriptPath = this._scriptPath;

	    let baseDir;
	    try {
	      const resolvedLink = fs.realpathSync(scriptPath);
	      baseDir = path.dirname(resolvedLink);
	    } catch (e) {
	      baseDir = '.'; // dummy, probably not going to find executable!
	    }

	    // name of the subcommand, like `pm-install`
	    let bin = path.basename(scriptPath, path.extname(scriptPath)) + '-' + subcommand._name;
	    if (subcommand._executableFile) {
	      bin = subcommand._executableFile;
	    }

	    const localBin = path.join(baseDir, bin);
	    if (fs.existsSync(localBin)) {
	      // prefer local `./<bin>` to bin in the $PATH
	      bin = localBin;
	    } else {
	      // Look for source files.
	      sourceExt.forEach((ext) => {
	        if (fs.existsSync(`${localBin}${ext}`)) {
	          bin = `${localBin}${ext}`;
	        }
	      });
	    }
	    launchWithNode = sourceExt.includes(path.extname(bin));

	    let proc;
	    if (browser$1.platform !== 'win32') {
	      if (launchWithNode) {
	        args.unshift(bin);
	        // add executable arguments to spawn
	        args = incrementNodeInspectorPort(browser$1.execArgv).concat(args);

	        proc = spawn(browser$1.argv[0], args, { stdio: 'inherit' });
	      } else {
	        proc = spawn(bin, args, { stdio: 'inherit' });
	      }
	    } else {
	      args.unshift(bin);
	      // add executable arguments to spawn
	      args = incrementNodeInspectorPort(browser$1.execArgv).concat(args);
	      proc = spawn(browser$1.execPath, args, { stdio: 'inherit' });
	    }

	    const signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
	    signals.forEach((signal) => {
	      // @ts-ignore
	      browser$1.on(signal, () => {
	        if (proc.killed === false && proc.exitCode === null) {
	          proc.kill(signal);
	        }
	      });
	    });

	    // By default terminate process when spawned process terminates.
	    // Suppressing the exit if exitCallback defined is a bit messy and of limited use, but does allow process to stay running!
	    const exitCallback = this._exitCallback;
	    if (!exitCallback) {
	      proc.on('close', browser$1.exit.bind(browser$1));
	    } else {
	      proc.on('close', () => {
	        exitCallback(new CommanderError(browser$1.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
	      });
	    }
	    proc.on('error', (err) => {
	      // @ts-ignore
	      if (err.code === 'ENOENT') {
	        const executableMissing = `'${bin}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name`;
	        throw new Error(executableMissing);
	      // @ts-ignore
	      } else if (err.code === 'EACCES') {
	        throw new Error(`'${bin}' not executable`);
	      }
	      if (!exitCallback) {
	        browser$1.exit(1);
	      } else {
	        const wrappedError = new CommanderError(1, 'commander.executeSubCommandAsync', '(error)');
	        wrappedError.nestedError = err;
	        exitCallback(wrappedError);
	      }
	    });

	    // Store the reference to the child process
	    this.runningCommand = proc;
	  };

	  /**
	   * @api private
	   */
	  _dispatchSubcommand(commandName, operands, unknown) {
	    const subCommand = this._findCommand(commandName);
	    if (!subCommand) this._helpAndError();

	    if (subCommand._executableHandler) {
	      this._executeSubCommand(subCommand, operands.concat(unknown));
	    } else {
	      subCommand._parseCommand(operands, unknown);
	    }
	  };

	  /**
	   * Process arguments in context of this command.
	   *
	   * @api private
	   */

	  _parseCommand(operands, unknown) {
	    const parsed = this.parseOptions(unknown);
	    operands = operands.concat(parsed.operands);
	    unknown = parsed.unknown;
	    this.args = operands.concat(unknown);

	    if (operands && this._findCommand(operands[0])) {
	      this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
	    } else if (this._lazyHasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
	      if (operands.length === 1) {
	        this.help();
	      } else {
	        this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
	      }
	    } else if (this._defaultCommandName) {
	      outputHelpIfRequested(this, unknown); // Run the help for default command from parent rather than passing to default command
	      this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
	    } else {
	      if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
	        // probaby missing subcommand and no handler, user needs help
	        this._helpAndError();
	      }

	      outputHelpIfRequested(this, parsed.unknown);
	      this._checkForMissingMandatoryOptions();
	      if (parsed.unknown.length > 0) {
	        this.unknownOption(parsed.unknown[0]);
	      }

	      if (this._actionHandler) {
	        const args = this.args.slice();
	        this._args.forEach((arg, i) => {
	          if (arg.required && args[i] == null) {
	            this.missingArgument(arg.name);
	          } else if (arg.variadic) {
	            args[i] = args.splice(i);
	          }
	        });

	        this._actionHandler(args);
	        this.emit('command:' + this.name(), operands, unknown);
	      } else if (operands.length) {
	        if (this._findCommand('*')) {
	          this._dispatchSubcommand('*', operands, unknown);
	        } else if (this.listenerCount('command:*')) {
	          this.emit('command:*', operands, unknown);
	        } else if (this.commands.length) {
	          this.unknownCommand();
	        }
	      } else if (this.commands.length) {
	        // This command has subcommands and nothing hooked up at this level, so display help.
	        this._helpAndError();
	      }
	    }
	  };

	  /**
	   * Find matching command.
	   *
	   * @api private
	   */
	  _findCommand(name) {
	    if (!name) return undefined;
	    return this.commands.find(cmd => cmd._name === name || cmd._aliases.includes(name));
	  };

	  /**
	   * Return an option matching `arg` if any.
	   *
	   * @param {string} arg
	   * @return {Option}
	   * @api private
	   */

	  _findOption(arg) {
	    return this.options.find(option => option.is(arg));
	  };

	  /**
	   * Display an error message if a mandatory option does not have a value.
	   * Lazy calling after checking for help flags from leaf subcommand.
	   *
	   * @api private
	   */

	  _checkForMissingMandatoryOptions() {
	    // Walk up hierarchy so can call in subcommand after checking for displaying help.
	    for (let cmd = this; cmd; cmd = cmd.parent) {
	      cmd.options.forEach((anOption) => {
	        if (anOption.mandatory && (cmd._getOptionValue(anOption.attributeName()) === undefined)) {
	          cmd.missingMandatoryOptionValue(anOption);
	        }
	      });
	    }
	  };

	  /**
	   * Parse options from `argv` removing known options,
	   * and return argv split into operands and unknown arguments.
	   *
	   * Examples:
	   *
	   *    argv => operands, unknown
	   *    --known kkk op => [op], []
	   *    op --known kkk => [op], []
	   *    sub --unknown uuu op => [sub], [--unknown uuu op]
	   *    sub -- --unknown uuu op => [sub --unknown uuu op], []
	   *
	   * @param {String[]} argv
	   * @return {{operands: String[], unknown: String[]}}
	   * @api public
	   */

	  parseOptions(argv) {
	    const operands = []; // operands, not options or values
	    const unknown = []; // first unknown option and remaining unknown args
	    let dest = operands;
	    const args = argv.slice();

	    function maybeOption(arg) {
	      return arg.length > 1 && arg[0] === '-';
	    }

	    // parse options
	    while (args.length) {
	      const arg = args.shift();

	      // literal
	      if (arg === '--') {
	        if (dest === unknown) dest.push(arg);
	        dest.push(...args);
	        break;
	      }

	      if (maybeOption(arg)) {
	        const option = this._findOption(arg);
	        // recognised option, call listener to assign value with possible custom processing
	        if (option) {
	          if (option.required) {
	            const value = args.shift();
	            if (value === undefined) this.optionMissingArgument(option);
	            this.emit(`option:${option.name()}`, value);
	          } else if (option.optional) {
	            let value = null;
	            // historical behaviour is optional value is following arg unless an option
	            if (args.length > 0 && !maybeOption(args[0])) {
	              value = args.shift();
	            }
	            this.emit(`option:${option.name()}`, value);
	          } else { // boolean flag
	            this.emit(`option:${option.name()}`);
	          }
	          continue;
	        }
	      }

	      // Look for combo options following single dash, eat first one if known.
	      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
	        const option = this._findOption(`-${arg[1]}`);
	        if (option) {
	          if (option.required || option.optional) {
	            // option with value following in same argument
	            this.emit(`option:${option.name()}`, arg.slice(2));
	          } else {
	            // boolean option, emit and put back remainder of arg for further processing
	            this.emit(`option:${option.name()}`);
	            args.unshift(`-${arg.slice(2)}`);
	          }
	          continue;
	        }
	      }

	      // Look for known long flag with value, like --foo=bar
	      if (/^--[^=]+=/.test(arg)) {
	        const index = arg.indexOf('=');
	        const option = this._findOption(arg.slice(0, index));
	        if (option && (option.required || option.optional)) {
	          this.emit(`option:${option.name()}`, arg.slice(index + 1));
	          continue;
	        }
	      }

	      // looks like an option but unknown, unknowns from here
	      if (arg.length > 1 && arg[0] === '-') {
	        dest = unknown;
	      }

	      // add arg
	      dest.push(arg);
	    }

	    return { operands, unknown };
	  };

	  /**
	   * Return an object containing options as key-value pairs
	   *
	   * @return {Object}
	   * @api public
	   */
	  opts() {
	    if (this._storeOptionsAsProperties) {
	      // Preserve original behaviour so backwards compatible when still using properties
	      const result = {};
	      const len = this.options.length;

	      for (let i = 0; i < len; i++) {
	        const key = this.options[i].attributeName();
	        result[key] = key === this._versionOptionName ? this._version : this[key];
	      }
	      return result;
	    }

	    return this._optionValues;
	  };

	  /**
	   * Argument `name` is missing.
	   *
	   * @param {string} name
	   * @api private
	   */

	  missingArgument(name) {
	    const message = `error: missing required argument '${name}'`;
	    console.error(message);
	    this._exit(1, 'commander.missingArgument', message);
	  };

	  /**
	   * `Option` is missing an argument, but received `flag` or nothing.
	   *
	   * @param {Option} option
	   * @param {string} [flag]
	   * @api private
	   */

	  optionMissingArgument(option, flag) {
	    let message;
	    if (flag) {
	      message = `error: option '${option.flags}' argument missing, got '${flag}'`;
	    } else {
	      message = `error: option '${option.flags}' argument missing`;
	    }
	    console.error(message);
	    this._exit(1, 'commander.optionMissingArgument', message);
	  };

	  /**
	   * `Option` does not have a value, and is a mandatory option.
	   *
	   * @param {Option} option
	   * @api private
	   */

	  missingMandatoryOptionValue(option) {
	    const message = `error: required option '${option.flags}' not specified`;
	    console.error(message);
	    this._exit(1, 'commander.missingMandatoryOptionValue', message);
	  };

	  /**
	   * Unknown option `flag`.
	   *
	   * @param {string} flag
	   * @api private
	   */

	  unknownOption(flag) {
	    if (this._allowUnknownOption) return;
	    const message = `error: unknown option '${flag}'`;
	    console.error(message);
	    this._exit(1, 'commander.unknownOption', message);
	  };

	  /**
	   * Unknown command.
	   *
	   * @api private
	   */

	  unknownCommand() {
	    const partCommands = [this.name()];
	    for (let parentCmd = this.parent; parentCmd; parentCmd = parentCmd.parent) {
	      partCommands.unshift(parentCmd.name());
	    }
	    const fullCommand = partCommands.join(' ');
	    const message = `error: unknown command '${this.args[0]}'. See '${fullCommand} ${this._helpLongFlag}'.`;
	    console.error(message);
	    this._exit(1, 'commander.unknownCommand', message);
	  };

	  /**
	   * Set the program version to `str`.
	   *
	   * This method auto-registers the "-V, --version" flag
	   * which will print the version number when passed.
	   *
	   * You can optionally supply the  flags and description to override the defaults.
	   *
	   * @param {string} str
	   * @param {string} [flags]
	   * @param {string} [description]
	   * @return {this | string} `this` command for chaining, or version string if no arguments
	   * @api public
	   */

	  version(str, flags, description) {
	    if (str === undefined) return this._version;
	    this._version = str;
	    flags = flags || '-V, --version';
	    description = description || 'output the version number';
	    const versionOption = new Option(flags, description);
	    this._versionOptionName = versionOption.long.substr(2) || 'version';
	    this.options.push(versionOption);
	    this.on('option:' + this._versionOptionName, () => {
	      browser$1.stdout.write(str + '\n');
	      this._exit(0, 'commander.version', str);
	    });
	    return this;
	  };

	  /**
	   * Set the description to `str`.
	   *
	   * @param {string} str
	   * @param {Object} [argsDescription]
	   * @return {string|Command}
	   * @api public
	   */

	  description(str, argsDescription) {
	    if (str === undefined && argsDescription === undefined) return this._description;
	    this._description = str;
	    this._argsDescription = argsDescription;
	    return this;
	  };

	  /**
	   * Set an alias for the command.
	   *
	   * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
	   *
	   * @param {string} [alias]
	   * @return {string|Command}
	   * @api public
	   */

	  alias(alias) {
	    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility

	    let command = this;
	    if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
	      // assume adding alias for last added executable subcommand, rather than this
	      command = this.commands[this.commands.length - 1];
	    }

	    if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

	    command._aliases.push(alias);
	    return this;
	  };

	  /**
	   * Set aliases for the command.
	   *
	   * Only the first alias is shown in the auto-generated help.
	   *
	   * @param {string[]} [aliases]
	   * @return {string[]|Command}
	   * @api public
	   */

	  aliases(aliases) {
	    // Getter for the array of aliases is the main reason for having aliases() in addition to alias().
	    if (aliases === undefined) return this._aliases;

	    aliases.forEach((alias) => this.alias(alias));
	    return this;
	  };

	  /**
	   * Set / get the command usage `str`.
	   *
	   * @param {string} [str]
	   * @return {String|Command}
	   * @api public
	   */

	  usage(str) {
	    if (str === undefined) {
	      if (this._usage) return this._usage;

	      const args = this._args.map((arg) => {
	        return humanReadableArgName(arg);
	      });
	      return '[options]' +
	        (this.commands.length ? ' [command]' : '') +
	        (this._args.length ? ' ' + args.join(' ') : '');
	    }

	    this._usage = str;
	    return this;
	  };

	  /**
	   * Get or set the name of the command
	   *
	   * @param {string} [str]
	   * @return {String|Command}
	   * @api public
	   */

	  name(str) {
	    if (str === undefined) return this._name;
	    this._name = str;
	    return this;
	  };

	  /**
	   * Return prepared commands.
	   *
	   * @return {Array}
	   * @api private
	   */

	  prepareCommands() {
	    const commandDetails = this.commands.filter((cmd) => {
	      return !cmd._hidden;
	    }).map((cmd) => {
	      const args = cmd._args.map((arg) => {
	        return humanReadableArgName(arg);
	      }).join(' ');

	      return [
	        cmd._name +
	          (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
	          (cmd.options.length ? ' [options]' : '') +
	          (args ? ' ' + args : ''),
	        cmd._description
	      ];
	    });

	    if (this._lazyHasImplicitHelpCommand()) {
	      commandDetails.push([this._helpCommandnameAndArgs, this._helpCommandDescription]);
	    }
	    return commandDetails;
	  };

	  /**
	   * Return the largest command length.
	   *
	   * @return {number}
	   * @api private
	   */

	  largestCommandLength() {
	    const commands = this.prepareCommands();
	    return commands.reduce((max, command) => {
	      return Math.max(max, command[0].length);
	    }, 0);
	  };

	  /**
	   * Return the largest option length.
	   *
	   * @return {number}
	   * @api private
	   */

	  largestOptionLength() {
	    const options = [].slice.call(this.options);
	    options.push({
	      flags: this._helpFlags
	    });

	    return options.reduce((max, option) => {
	      return Math.max(max, option.flags.length);
	    }, 0);
	  };

	  /**
	   * Return the largest arg length.
	   *
	   * @return {number}
	   * @api private
	   */

	  largestArgLength() {
	    return this._args.reduce((max, arg) => {
	      return Math.max(max, arg.name.length);
	    }, 0);
	  };

	  /**
	   * Return the pad width.
	   *
	   * @return {number}
	   * @api private
	   */

	  padWidth() {
	    let width = this.largestOptionLength();
	    if (this._argsDescription && this._args.length) {
	      if (this.largestArgLength() > width) {
	        width = this.largestArgLength();
	      }
	    }

	    if (this.commands && this.commands.length) {
	      if (this.largestCommandLength() > width) {
	        width = this.largestCommandLength();
	      }
	    }

	    return width;
	  };

	  /**
	   * Return help for options.
	   *
	   * @return {string}
	   * @api private
	   */

	  optionHelp() {
	    const width = this.padWidth();
	    const columns = browser$1.stdout.columns || 80;
	    const descriptionWidth = columns - width - 4;
	    function padOptionDetails(flags, description) {
	      return pad(flags, width) + '  ' + optionalWrap(description, descriptionWidth, width + 2);
	    }
	    // Explicit options (including version)
	    const help = this.options.map((option) => {
	      const fullDesc = option.description +
	        ((!option.negate && option.defaultValue !== undefined) ? ' (default: ' + JSON.stringify(option.defaultValue) + ')' : '');
	      return padOptionDetails(option.flags, fullDesc);
	    });

	    // Implicit help
	    const showShortHelpFlag = this._helpShortFlag && !this._findOption(this._helpShortFlag);
	    const showLongHelpFlag = !this._findOption(this._helpLongFlag);
	    if (showShortHelpFlag || showLongHelpFlag) {
	      let helpFlags = this._helpFlags;
	      if (!showShortHelpFlag) {
	        helpFlags = this._helpLongFlag;
	      } else if (!showLongHelpFlag) {
	        helpFlags = this._helpShortFlag;
	      }
	      help.push(padOptionDetails(helpFlags, this._helpDescription));
	    }

	    return help.join('\n');
	  };

	  /**
	   * Return command help documentation.
	   *
	   * @return {string}
	   * @api private
	   */

	  commandHelp() {
	    if (!this.commands.length && !this._lazyHasImplicitHelpCommand()) return '';

	    const commands = this.prepareCommands();
	    const width = this.padWidth();

	    const columns = browser$1.stdout.columns || 80;
	    const descriptionWidth = columns - width - 4;

	    return [
	      'Commands:',
	      commands.map((cmd) => {
	        const desc = cmd[1] ? '  ' + cmd[1] : '';
	        return (desc ? pad(cmd[0], width) : cmd[0]) + optionalWrap(desc, descriptionWidth, width + 2);
	      }).join('\n').replace(/^/gm, '  '),
	      ''
	    ].join('\n');
	  };

	  /**
	   * Return program help documentation.
	   *
	   * @return {string}
	   * @api public
	   */

	  helpInformation() {
	    let desc = [];
	    if (this._description) {
	      desc = [
	        this._description,
	        ''
	      ];

	      const argsDescription = this._argsDescription;
	      if (argsDescription && this._args.length) {
	        const width = this.padWidth();
	        const columns = browser$1.stdout.columns || 80;
	        const descriptionWidth = columns - width - 5;
	        desc.push('Arguments:');
	        desc.push('');
	        this._args.forEach((arg) => {
	          desc.push('  ' + pad(arg.name, width) + '  ' + wrap(argsDescription[arg.name], descriptionWidth, width + 4));
	        });
	        desc.push('');
	      }
	    }

	    let cmdName = this._name;
	    if (this._aliases[0]) {
	      cmdName = cmdName + '|' + this._aliases[0];
	    }
	    let parentCmdNames = '';
	    for (let parentCmd = this.parent; parentCmd; parentCmd = parentCmd.parent) {
	      parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
	    }
	    const usage = [
	      'Usage: ' + parentCmdNames + cmdName + ' ' + this.usage(),
	      ''
	    ];

	    let cmds = [];
	    const commandHelp = this.commandHelp();
	    if (commandHelp) cmds = [commandHelp];

	    const options = [
	      'Options:',
	      '' + this.optionHelp().replace(/^/gm, '  '),
	      ''
	    ];

	    return usage
	      .concat(desc)
	      .concat(options)
	      .concat(cmds)
	      .join('\n');
	  };

	  /**
	   * Output help information for this command.
	   *
	   * When listener(s) are available for the helpLongFlag
	   * those callbacks are invoked.
	   *
	   * @api public
	   */

	  outputHelp(cb) {
	    if (!cb) {
	      cb = (passthru) => {
	        return passthru;
	      };
	    }
	    const cbOutput = cb(this.helpInformation());
	    if (typeof cbOutput !== 'string' && !Buffer.isBuffer(cbOutput)) {
	      throw new Error('outputHelp callback must return a string or a Buffer');
	    }
	    browser$1.stdout.write(cbOutput);
	    this.emit(this._helpLongFlag);
	  };

	  /**
	   * You can pass in flags and a description to override the help
	   * flags and help description for your command.
	   *
	   * @param {string} [flags]
	   * @param {string} [description]
	   * @return {Command} `this` command for chaining
	   * @api public
	   */

	  helpOption(flags, description) {
	    this._helpFlags = flags || this._helpFlags;
	    this._helpDescription = description || this._helpDescription;

	    const splitFlags = this._helpFlags.split(/[ ,|]+/);

	    this._helpShortFlag = undefined;
	    if (splitFlags.length > 1) this._helpShortFlag = splitFlags.shift();

	    this._helpLongFlag = splitFlags.shift();

	    return this;
	  };

	  /**
	   * Output help information and exit.
	   *
	   * @param {Function} [cb]
	   * @api public
	   */

	  help(cb) {
	    this.outputHelp(cb);
	    // exitCode: preserving original behaviour which was calling process.exit()
	    // message: do not have all displayed text available so only passing placeholder.
	    this._exit(browser$1.exitCode || 0, 'commander.help', '(outputHelp)');
	  };

	  /**
	   * Output help information and exit. Display for error situations.
	   *
	   * @api private
	   */

	  _helpAndError() {
	    this.outputHelp();
	    // message: do not have all displayed text available so only passing placeholder.
	    this._exit(1, 'commander.help', '(outputHelp)');
	  };
	}
	/**
	 * Expose the root command.
	 */

	exports = module.exports = new Command();
	exports.program = exports; // More explicit access to global command.

	/**
	 * Expose classes
	 */

	exports.Command = Command;
	exports.Option = Option;
	exports.CommanderError = CommanderError;

	/**
	 * Camel-case the given `flag`
	 *
	 * @param {string} flag
	 * @return {string}
	 * @api private
	 */

	function camelcase(flag) {
	  return flag.split('-').reduce((str, word) => {
	    return str + word[0].toUpperCase() + word.slice(1);
	  });
	}

	/**
	 * Pad `str` to `width`.
	 *
	 * @param {string} str
	 * @param {number} width
	 * @return {string}
	 * @api private
	 */

	function pad(str, width) {
	  const len = Math.max(0, width - str.length);
	  return str + Array(len + 1).join(' ');
	}

	/**
	 * Wraps the given string with line breaks at the specified width while breaking
	 * words and indenting every but the first line on the left.
	 *
	 * @param {string} str
	 * @param {number} width
	 * @param {number} indent
	 * @return {string}
	 * @api private
	 */
	function wrap(str, width, indent) {
	  const regex = new RegExp('.{1,' + (width - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
	  const lines = str.match(regex) || [];
	  return lines.map((line, i) => {
	    if (line.slice(-1) === '\n') {
	      line = line.slice(0, line.length - 1);
	    }
	    return ((i > 0 && indent) ? Array(indent + 1).join(' ') : '') + line.trimRight();
	  }).join('\n');
	}

	/**
	 * Optionally wrap the given str to a max width of width characters per line
	 * while indenting with indent spaces. Do not wrap if insufficient width or
	 * string is manually formatted.
	 *
	 * @param {string} str
	 * @param {number} width
	 * @param {number} indent
	 * @return {string}
	 * @api private
	 */
	function optionalWrap(str, width, indent) {
	  // Detect manually wrapped and indented strings by searching for line breaks
	  // followed by multiple spaces/tabs.
	  if (str.match(/[\n]\s+/)) return str;
	  // Do not wrap to narrow columns (or can end up with a word per line).
	  const minWidth = 40;
	  if (width < minWidth) return str;

	  return wrap(str, width, indent);
	}

	/**
	 * Output help information if help flags specified
	 *
	 * @param {Command} cmd - command to output help for
	 * @param {Array} args - array of options to search for help flags
	 * @api private
	 */

	function outputHelpIfRequested(cmd, args) {
	  const helpOption = args.find(arg => arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
	  if (helpOption) {
	    cmd.outputHelp();
	    // (Do not have all displayed text available so only passing placeholder.)
	    cmd._exit(0, 'commander.helpDisplayed', '(outputHelp)');
	  }
	}

	/**
	 * Takes an argument and returns its human readable equivalent for help usage.
	 *
	 * @param {Object} arg
	 * @return {string}
	 * @api private
	 */

	function humanReadableArgName(arg) {
	  const nameOutput = arg.name + (arg.variadic === true ? '...' : '');

	  return arg.required
	    ? '<' + nameOutput + '>'
	    : '[' + nameOutput + ']';
	}

	/**
	 * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
	 *
	 * @param {string[]} args - array of arguments from node.execArgv
	 * @returns {string[]}
	 * @api private
	 */

	function incrementNodeInspectorPort(args) {
	  // Testing for these options:
	  //  --inspect[=[host:]port]
	  //  --inspect-brk[=[host:]port]
	  //  --inspect-port=[host:]port
	  return args.map((arg) => {
	    let result = arg;
	    if (arg.indexOf('--inspect') === 0) {
	      let debugOption;
	      let debugHost = '127.0.0.1';
	      let debugPort = '9229';
	      let match;
	      if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
	        // e.g. --inspect
	        debugOption = match[1];
	      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
	        debugOption = match[1];
	        if (/^\d+$/.test(match[3])) {
	          // e.g. --inspect=1234
	          debugPort = match[3];
	        } else {
	          // e.g. --inspect=localhost
	          debugHost = match[3];
	        }
	      } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
	        // e.g. --inspect=localhost:1234
	        debugOption = match[1];
	        debugHost = match[3];
	        debugPort = match[4];
	      }

	      if (debugOption && debugPort !== '0') {
	        result = `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
	      }
	    }
	    return result;
	  });
	}

	var commander = /*#__PURE__*/Object.freeze({
		__proto__: null
	});

	var fs_1 = {};

	var app = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	const saveChats = async (chatId) => {
	    chats.push(chatId);
	    await fs_1.promises.appendFile('chats.txt', chatId.toString() + '\n');
	};
	const loadChats = async () => {
	    return fs_1.promises
	        .readFile('chats.txt', 'utf8')
	        .then((r) => r.split(/\r?\n/))
	        .then((r) => r.filter((item) => item !== ''))
	        .then((r) => r.map((item) => parseInt(item)));
	};
	const startBot = (key) => {
	    const bot = new nodeTelegramBotApi(key, { polling: true });
	    bot.onText(/\/start/, async (msg) => {
	        const chatId = msg.chat.id;
	        if (chats.includes(chatId)) {
	            bot.sendMessage(chatId, '已经订阅小助手，无法重复订阅。');
	            return;
	        }
	        await saveChats(chatId);
	        bot.sendMessage(chatId, '小助手订阅成功。');
	    });
	    reminderLoop(bot);
	};
	const reminderLoop = (bot) => {
	    const interval = 1000 * 60 * 60 * 6; // 6 hours
	    const baseDate = new Date('2020-01-01T00:00:00.000+08:00');
	    const nextReminder = () => {
	        const now = new Date();
	        const until = (((baseDate.getTime() - now.getTime()) % interval) + interval) % interval;
	        setTimeout(() => {
	            sendReminder(bot);
	            nextReminder();
	        }, until);
	    };
	    nextReminder();
	};
	const sendReminder = (bot) => {
	    chats.map((chatId) => bot.sendPhoto(chatId, 'https://i.imgur.com/QkinmQn.jpg'));
	};
	commander.program.option('-k, --key <api_key>', 'telegram bot api key');
	commander.program.parse(process.argv);
	let APIKey = '';
	let chats = [];
	if (commander.program.key) {
	    APIKey = commander.program.key;
	}
	loadChats()
	    .then((r) => {
	    chats = r;
	    console.log(chats);
	})
	    .catch(() => console.log('Chats file not found. No chat ids loaded.'))
	    .then(() => startBot(APIKey));
	});

	var app$1 = unwrapExports(app);

	return app$1;

}());
