/// <reference path="../../typings/main/ambient/node/index.d.ts"/>
/// <reference path="../../typings/main/ambient/tape/index.d.ts"/>
/// <reference path="../ts/station.ts" />

var tape = require('tape');

tape.test('The Station interface...', function(t) {

    var actual,
        expected;

    var station: Station = { lines: ['50', '51', '53', '54'], name: 'Central station' };

    actual = station.name;
    expected = 'Central station';

    t.equal(actual, expected, '...should set name correctly.');

    // notify tape that there are no more tests
    t.end();

});
