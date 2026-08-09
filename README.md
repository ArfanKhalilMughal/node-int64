# @zklogic/node-int64

[![CI](https://github.com/ArfanKhalilMughal/node-int64/actions/workflows/ci.yml/badge.svg)](https://github.com/ArfanKhalilMughal/node-int64/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@zklogic/node-int64.svg)](https://www.npmjs.com/package/@zklogic/node-int64)

Support for representing 64-bit integers in JavaScript.

> **About this fork.** This is a maintained fork of [broofa/node-int64](https://github.com/broofa/node-int64)
> by Robert Kieffer, which was archived in December 2020. The original author
> noted that [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
> obsoletes the need for this package for new code — **if you are starting
> fresh, use `BigInt`.** This fork exists to keep the package installable, typed,
> and CI-verified for projects that still depend on the `Int64` interface.
>
> Changes over upstream v0.4.0: TypeScript typings, CI across Node 18 and 22,
> and an automated publish pipeline. The runtime behaviour of `Int64.js` is
> unchanged.

## Install

```bash
npm install @zklogic/node-int64
```

Requires Node.js >= 18. TypeScript typings are bundled — no `@types` package needed.

## Quick start

```js
// CommonJS
const Int64 = require('@zklogic/node-int64');

// TypeScript / ESM interop
import Int64 = require('@zklogic/node-int64');

const x = new Int64(0x123456789);
console.log(x.toString());       // '4886718345'
console.log(x.toOctetString());  // '0000000123456789'
console.log(x.toBuffer());       // <Buffer 00 00 00 01 23 45 67 89>
```

## Why

JavaScript Numbers are represented as [IEEE 754 double-precision floats](http://steve.hollasch.net/cgindex/coding/ieeefloat.html).
Unfortunately, this means they lose integer precision for values beyond +/- 2^53.
For projects that need to accurately handle 64-bit ints, such as
[node-thrift](https://github.com/wadey/node-thrift), a performant, Number-like
class is needed. `Int64` is that class.

## Usage

`Int64` instances look and feel much like JS-native Numbers. By way of example ...

```js
// First, let's illustrate the problem ...
> (0x123456789).toString(16)
'123456789' // <- what we expect.
> (0x123456789abcdef0).toString(16)
'123456789abcdf00' // <- Ugh!  JS doesn't do big ints. :(

// So let's create a couple Int64s using the above values ...

// Require, of course
> Int64 = require('@zklogic/node-int64')

// x's value is what we expect (the decimal value of 0x123456789)
> x = new Int64(0x123456789)
[Int64 value:4886718345 octets:00 00 00 01 23 45 67 89]

// y's value is Infinity because it's outside the range of integer
// precision.  But that's okay - it's still useful because it's internal
// representation (octets) is what we passed in
> y = new Int64('123456789abcdef0')
[Int64 value:Infinity octets:12 34 56 78 9a bc de f0]

// Let's do some math.  Int64's behave like Numbers.  (Sorry, Int64 isn't
// for doing 64-bit integer arithmetic (yet) - it's just for carrying
// around int64 values
> x + 1
4886718346
> y + 1
Infinity

// Int64 string operations ...
> 'value: ' + x
'value: 4886718345'
> 'value: ' + y
'value: Infinity'
> x.toString(2)
'100100011010001010110011110001001'
> y.toString(2)
'Infinity'

// Use JS's isFinite() method to see if the Int64 value is in the
// integer-precise range of JS values
> isFinite(x)
true
> isFinite(y)
false

// Get an octet string representation.  (Yay, y is what we put in!)
> x.toOctetString()
'0000000123456789'
> y.toOctetString()
'123456789abcdef0'

// Finally, some other ways to create Int64s ...

// Pass hi/lo words
> new Int64(0x12345678, 0x9abcdef0)
[Int64 value:Infinity octets:12 34 56 78 9a bc de f0]

// Pass a Buffer
> new Int64(Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]))
[Int64 value:Infinity octets:12 34 56 78 9a bc de f0]

// Pass a Buffer and offset
> new Int64(Buffer.from([0,0,0,0,0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]), 4)
[Int64 value:Infinity octets:12 34 56 78 9a bc de f0]

// Pull out into a buffer
> new Int64(Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0])).toBuffer()
<Buffer 12 34 56 78 9a bc de f0>

// Or copy into an existing one (at an offset)
> var buf = Buffer.alloc(1024);
> new Int64(Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0])).copy(buf, 512);
```

## TypeScript

```ts
import Int64 = require('@zklogic/node-int64');

const value = new Int64(0x123456789);
const octets: string = value.toOctetString();
```

## Development

```bash
npm install
npm run verify
```

| Script | What it does |
| --- | --- |
| `npm test` | Runs the nodeunit suite in `test.js` |
| `npm run type-check` | Compiles `index.d.ts` and its usage exercise with `tsc --noEmit` |
| `npm run build` | Verifies package contents and smoke-tests the public API |
| `npm run verify` | All three of the above |

There is no compile step — `Int64.js` ships as-is. `npm run build` instead
validates that everything the published tarball needs is present and that the
module loads correctly through its declared `main`.

## Releasing

CI runs on every push and pull request. To publish, bump the version and push
the tag — `.github/workflows/publish.yml` publishes to npm via OIDC trusted
publishing on any `v*` tag:

```bash
npm version minor
```

`preversion` runs the full verification and `postversion` pushes the commit and
tag. The publish workflow re-verifies that the tag matches `package.json`
before publishing.

## License

MIT. Copyright (c) 2012 Robert Kieffer. See [LICENSE](LICENSE).
