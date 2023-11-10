'use strict';

var expect = require('chai').expect;
var cla = require('../index.js');

describe('#command-line-arguments', function() {
    it('#Standard Test', function() {
        var result = cla.getCommandLineArguments(['person', '-firstname', '--Benjamin', '-lastname', '--Lykins', '-birthday', '--7/1/95']);
        var expected = {
          person: {
            firstname: 'Benjamin',
            lastname: 'Lykins',
            birthday: '7/1/95'
          }
        };
        expect(result).to.deep.equal(expected);
    });

    it('#Standard Test 2', function() {
        var result = cla.getCommandLineArguments(['person', '-firstname', '--Benjamin', '-lastname', '--Lykins', '-birthday', '--7/1/95',
      'dog', '-name', '--Cocoa', '-birthday', '--8/1/2007']);
        var expected = {
          person: {
            firstname: 'Benjamin',
            lastname: 'Lykins',
            birthday: '7/1/95'
          },
          dog: {
            name: 'Cocoa',
            birthday: '8/1/2007'
          }
        };
        expect(result).to.deep.equal(expected);
    });

    it('#Test Using Arrays', function(){
      var result = cla.getCommandLineArguments(['FavoriteThings', '-sports', '--basketball', '--baseball', '--football',
    '-languages', '--JavaScript', '--Python', '--HTML']);
      var expected = {
        FavoriteThings: {
          sports: ['basketball', 'baseball','football'],
          languages: ['JavaScript', 'Python', 'HTML']
        }
      };
      expect(result).to.deep.equal(expected);
    });


    it('#Empty List', function(){
      var result = cla.getCommandLineArguments([]);
      var expected = [];
      expect(result).to.deep.equal(expected);
    });


    it('#Single Level Object Test', function() {
        var result = cla.getCommandLineArguments(['lions', 'tigers','bears']);
        var expected = ['lions', 'tigers','bears'];
        expect(result).to.deep.equal(expected);
    });

    it('#Test With Numbers', function() {
        var result = cla.getCommandLineArguments(['powers_of_two', '-1','-2','-4','-8']);
        var expected = {powers_of_two: [1,2,4,8]};
        expect(result).to.deep.equal(expected);
    });

    it('#Test With Numbers 2', function() {
        var result = cla.getCommandLineArguments(['my_favorite_number', '-12']);
        var expected = {my_favorite_number: 12};
        expect(result).to.deep.equal(expected);
    });

    it('#Bad Inputs', function(){
      var result = cla.getCommandLineArguments(['person', '-firstname', '--Benjamin', '----badinput', '-lastname', '--Lykins', '-birthday', '--7/1/95']);
      var expected = {
        person: {
          firstname: 'Benjamin',
          lastname: 'Lykins',
          birthday: '7/1/95'
        }
      };
      expect(result).to.deep.equal(expected);
    });
});
