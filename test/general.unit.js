/*
 * Tests whether the general testing setup works
 */

/*global describe, it, expect, metrochart, d3, fixture*/

describe('metrochart general testing functionality', function () {

    'use strict';

    it('...should know about metrochart', function () {
        expect(metrochart).not.toBe(null);
    });


    it('...should have loaded the d3 library', function () {
        expect(d3).not.toBe(null);
    });


    // it('...should have loaded the test data', function () {
    //     var data;
    //     fixture.base = 'test';
    //     data = fixture.load('cityofchicago-police-data.fixture.json');
    //     expect(data).not.toBe(null);
    // });
    //
    //
    // it('...should be able to find the html fixtures', function () {
    //     var html;
    //     fixture.base = 'test';
    //     html = fixture.load('base.fixture.html');
    //     expect(html).not.toBe(null);
    // });


});
