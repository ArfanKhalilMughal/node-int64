#!/usr/bin/env node
//
// Package integrity check. This package has no compile step -- Int64.js ships
// as-is -- so "build" means proving the published artifact is coherent:
//
//   1. every path in package.json "files" actually exists,
//   2. "main" and "types" point at real files,
//   3. the module loads and behaves correctly through its public entry point.
//
// Runs in CI before publish, and again from prepublishonly as a local guard.

'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var pkg = require(path.join(root, 'package.json'));

function resolve(relative) {
  return path.join(root, relative);
}

function checkExists(relative, label) {
  if (!fs.existsSync(resolve(relative))) {
    throw new Error(label + ' "' + relative + '" does not exist');
  }
}

// 1. Everything listed in "files" is present. npm silently drops missing
// entries, which is how a tarball ends up shipping without its typings.
assert(Array.isArray(pkg.files) && pkg.files.length, 'package.json "files" must be a non-empty array');
pkg.files.forEach(function(entry) {
  checkExists(entry, 'package.json "files" entry');
});

// 2. Entry points resolve.
checkExists(pkg.main, 'package.json "main"');
checkExists(pkg.types, 'package.json "types"');

// The typings and the runtime entry must both be shipped, or consumers get a
// package that installs but cannot be imported.
[pkg.main, pkg.types].forEach(function(entry) {
  var normalized = entry.replace(/^\.\//, '');
  var covered = pkg.files.some(function(f) {
    return f === normalized || normalized.indexOf(f + '/') === 0;
  });
  assert(covered, '"' + entry + '" is not covered by package.json "files"');
});

// 3. Smoke-test the public API through the resolved "main", not a direct path,
// so a broken "main" fails here rather than in a consumer's install.
var Int64 = require(resolve(pkg.main));

var fromWords = new Int64(0xfffaffff, 0xfffff700);
assert.strictEqual(fromWords.toBuffer().toString('hex'), 'fffafffffffff700', 'hi/lo constructor');
assert.strictEqual(fromWords.toNumber(true), -0x5000000000900, 'toNumber');

var fromHex = new Int64('0x0000123450654321');
assert.strictEqual(fromHex.toOctetString(), '0000123450654321', 'hex constructor');
assert.strictEqual(fromHex.valueOf(), 0x123450654321, 'valueOf');

var fromNumber = new Int64(0x123456789);
assert.strictEqual(fromNumber + 1, 4886718346, 'numeric coercion');
assert.strictEqual('' + fromNumber, '4886718345', 'string coercion');

assert.strictEqual(new Int64(1).compare(new Int64(2)) < 0, true, 'compare');
assert.strictEqual(new Int64(1).equals(new Int64(1)), true, 'equals');

assert.strictEqual(Int64.MAX_INT, Math.pow(2, 53), 'MAX_INT');
assert.strictEqual(Int64.MIN_INT, -Math.pow(2, 53), 'MIN_INT');

console.log('OK: ' + pkg.name + '@' + pkg.version + ' package contents and public API verified');
