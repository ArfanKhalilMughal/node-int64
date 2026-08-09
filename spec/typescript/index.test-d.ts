// Compile-only exercise of the public typings. Never executed -- `npm run
// type-check` fails if index.d.ts drifts from the runtime API in Int64.js.

import Int64 = require('../../index');

// Every documented constructor form.
const empty: Int64 = new Int64();
const fromNumber: Int64 = new Int64(0x123456789);
const fromHex: Int64 = new Int64('123456789abcdef0');
const fromPrefixedHex: Int64 = new Int64('0x123456789abcdef0');
const fromWords: Int64 = new Int64(0x12345678, 0x9abcdef0);
const fromBuffer: Int64 = new Int64(Buffer.alloc(8));
const fromBufferOffset: Int64 = new Int64(Buffer.alloc(16), 4);
const fromUint8Array: Int64 = new Int64(new Uint8Array(8), 0);

// Statics.
const maxInt: number = Int64.MAX_INT;
const minInt: number = Int64.MIN_INT;

// Instance fields.
const backing: Buffer = fromNumber.buffer;
const offset: number = fromNumber.offset;

// setValue overloads.
empty.setValue(1e18);
empty.setValue('0001234500654321');
empty.setValue(0xff12345, 0x654321);

// Conversions.
const asNumber: number = fromNumber.toNumber();
const asImpreciseNumber: number = fromHex.toNumber(true);
const asValue: number = fromNumber.valueOf();
const asDecimal: string = fromNumber.toString();
const asBinary: string = fromNumber.toString(2);
const octets: string = fromHex.toOctetString();
const spacedOctets: string = fromHex.toOctetString(' ');
const asBuffer: Buffer = fromHex.toBuffer();
const asRawBuffer: Buffer = fromHex.toBuffer(true);
const pretty: string = fromHex.inspect();

// Buffer copying.
fromHex.copy(Buffer.alloc(1024));
fromHex.copy(Buffer.alloc(1024), 512);

// Comparison.
const ordering: number = fromWords.compare(fromHex);
const isEqual: boolean = fromWords.equals(fromHex);

// Arithmetic/string coercion goes through valueOf/toString.
const coerced: number = Number(fromNumber) + 1;
const interpolated: string = `value: ${fromNumber}`;

// Reference the bindings so noUnusedLocals-style checks stay quiet and the
// compiler is forced to resolve each type above.
export const checked = {
  empty,
  fromNumber,
  fromHex,
  fromPrefixedHex,
  fromWords,
  fromBuffer,
  fromBufferOffset,
  fromUint8Array,
  maxInt,
  minInt,
  backing,
  offset,
  asNumber,
  asImpreciseNumber,
  asValue,
  asDecimal,
  asBinary,
  octets,
  spacedOctets,
  asBuffer,
  asRawBuffer,
  pretty,
  ordering,
  isEqual,
  coerced,
  interpolated,
};
