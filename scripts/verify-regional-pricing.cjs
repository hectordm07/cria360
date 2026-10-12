// Run after compiling the two pricing libraries to a temporary CommonJS directory.
const assert = require('node:assert/strict');
const { quoteForRate, formatPrice, validCountry } = require(process.argv[2]);
const now = Date.UTC(2026, 9, 12, 16);
const feed = { result: 'success', base_code: 'USD', time_last_update_unix: now / 1000, rates: { PEN: 3.433564, MXN: 18.406744, COP: 3206.933418, CLP: 979.008503, ARS: 1515.8766, BRL: 4.995947, EUR: 0.892629 } };
for (const [country, currency] of [['PE','PEN'],['MX','MXN'],['CO','COP'],['CL','CLP'],['AR','ARS'],['BR','BRL'],['ES','EUR']]) {
  const quote = quoteForRate(country, 'automatic', feed, now);
  assert.equal(quote.currency, currency);
  assert.equal(quote.status, 'converted');
  assert(quote.prices.granjaMonthly > 0);
  assert.notEqual(quote.prices.granjaMonthly, 29);
  console.log(country, currency, formatPrice(quote.prices.granjaMonthly, currency, country));
}
const peru = quoteForRate('PE','selected',feed,now);
assert.equal(peru.prices.granjaMonthly, 99.57);
assert.equal(peru.prices.plateQr, 30.9);
assert.equal(quoteForRate('CL','automatic',feed,now).prices.granjaMonthly, 28391);
assert.equal(quoteForRate('EC','automatic',null,now).currency, 'USD');
assert.equal(quoteForRate(null,'unknown',null,now).prices.granjaMonthly, 29);
assert.equal(validCountry(' pe '), 'PE');
assert.equal(validCountry('__proto__'), null);
assert.equal(validCountry('ZZZ'), null);
for (const bad of [null, {...feed, rates: {}}, {...feed, rates: { PEN: 0 }}, {...feed, rates: { PEN: NaN }}, {...feed, time_last_update_unix: now / 1000 - 4 * 86400}, {...feed, time_last_update_unix: now / 1000 + 86400}, {...feed, base_code:'EUR'}]) {
  const quote = quoteForRate('PE','automatic',bad,now);
  assert.equal(quote.currency,'USD');
  assert.equal(quote.status,'unavailable');
  assert.equal(quote.prices.granjaMonthly,29);
}
console.log('PASS: conversion, minor units, geo selection, and honest outage/stale fallbacks.');
