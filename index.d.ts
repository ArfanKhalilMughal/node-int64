// Type definitions for @zklogic/node-int64
// Reflects the runtime API implemented in Int64.js.

/// <reference types="node" />

/**
 * Wraps an 8-byte, big-endian, 2's-complement Buffer holding an int64 value.
 *
 * Int64 operates directly on the underlying buffer: if an instance is created
 * from an existing Buffer, mutating the value mutates that Buffer, and vice
 * versa.
 */
declare class Int64 {
  /** Max integer value that JS can accurately represent (2^53). */
  static readonly MAX_INT: number;

  /** Min integer value that JS can accurately represent (-2^53). */
  static readonly MIN_INT: number;

  /** The backing 8-byte store. Shared, not copied, when passed to the constructor. */
  buffer: Buffer;

  /** Byte offset of this value within `buffer`. */
  offset: number;

  /** Zero-valued Int64 backed by a fresh 8-byte buffer. */
  constructor();

  /** Existing Buffer with a byte offset. The buffer is used as-is, not copied. */
  constructor(buffer: Buffer, offset?: number);

  /** Existing Uint8Array with a byte offset. A new Buffer is constructed from it. */
  constructor(array: Uint8Array, offset?: number);

  /** Hex string, with or without a leading `0x`. */
  constructor(hex: string);

  /** Number. Throws RangeError if outside int64 range. */
  constructor(value: number);

  /** Raw bits as two 32-bit values. */
  constructor(hi: number, lo: number);

  /** Set the value from a hex string, with or without a leading `0x`. */
  setValue(hex: string): void;

  /** Set the value from a Number. Throws RangeError if outside int64 range. */
  setValue(value: number): void;

  /** Set the value from raw bits given as two 32-bit values. */
  setValue(hi: number, lo: number): void;

  /**
   * Convert to a native JS number.
   *
   * WARNING: not accurate to integer precision for large magnitudes.
   *
   * @param allowImprecise If true, no precision check is performed. If false
   * (the default), values beyond +/-2^53 are forced to +/-Infinity.
   */
  toNumber(allowImprecise?: boolean): number;

  /** Convert to a Number, returning +/-Infinity when precision would be lost. */
  valueOf(): number;

  /** @param radix Just like `Number#toString()`'s radix. Defaults to 10. */
  toString(radix?: number): string;

  /**
   * String of the buffer octets, most-significant byte first.
   *
   * @param sep Separator between octets. Defaults to '' (empty string).
   */
  toOctetString(sep?: string): string;

  /**
   * The int64's 8 bytes as a Buffer.
   *
   * @param rawBuffer If true and `offset` is 0, returns the internal buffer
   * rather than a copy. Breaks encapsulation -- only use when discarding the
   * Int64 afterwards.
   */
  toBuffer(rawBuffer?: boolean): Buffer;

  /**
   * Copy the 8 bytes into `targetBuffer` at `targetOffset`.
   *
   * @param targetOffset Defaults to 0.
   */
  copy(targetBuffer: Buffer, targetOffset?: number): void;

  /**
   * Sort-order comparison. Returns a negative number if this sorts before
   * `other`, positive if after, 0 if equal.
   */
  compare(other: Int64): number;

  /** True if this holds the same 8 bytes as `other`. */
  equals(other: Int64): boolean;

  /** Pretty output for `console.log`. */
  inspect(): string;
}

export = Int64;
