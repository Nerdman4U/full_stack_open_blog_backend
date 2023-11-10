[![Build Status](https://travis-ci.org/BenjaminLykins/command-line-arguments.svg?branch=master)](https://travis-ci.org/BenjaminLykins/command-line-arguments)
[![Coverage Status](https://coveralls.io/repos/github/BenjaminLykins/command-line-arguments/badge.svg?branch=master)](https://coveralls.io/github/BenjaminLykins/command-line-arguments?branch=master)
[![NPM](https://nodei.co/npm/command-line-arguments.png?mini=true)](https://npmjs.org/package/command-line-arguments)
# command-line-arguments
Simple way to serialize JavaScript objects from command line arguments

## Synopsis
You can make JSON style objects directly from command line arguments using simple notation. Dashes indicate classes,
attributes, and values.
```
$ node add-contact.js person -firstname --john -lastname --smith -age --30
```
Would serialize to
```
{
  person: {
    firstname: 'john',
    lastname: 'smith',
    age: 30
  }
}
```
## Usage
Command line arguments with no dashes are the base class(es) or attribute(s). Each dash represents another 'level'. In this example, person is the base class, firstname, lastname, and age are the attributes, and john, smith, and 30 are the values of those attributes.

Levels are determined by the number of dashes before an argument. The fewer dashes the higher the level. Arguments with no levels below them (they have no arguments with more dashes following them in the list) are values. Arguments with only one level after them are attributes. Arguments with multiple levels after them are classes.
```
//$ exampleProgram person -firstname --john -lastname --smith -age --30

var cla = require('command-line-arguments');

var params = cla.getCommandLineArguments();
console.log(params.firstname); //prints john

```

```
//$ exampleProgram2 car -tire --type ---goodyear --age ---2 -color --blue -cost --10000 -condition --good

var cla = require('command-line-arguments');

var params = cla.getCommandLineArguments();

// params = {
//  car:{
//    tire: {
//      type: 'goodyear',
//      age: 2
//    }
//    color: blue,
//    cost: 10000,
//    condition: 'good'
//  }
//}

```

##Install
```
npm install command-line-arguments --save
```

##Examples
```
//$ node addFood.js name -hotdog calories -400 primary-ingredients -bun -dog -mustard -ketchup

var cla = require('command-line-arguments');
food = cla.getCommandLineArguments();

// food =
//  {
//    name: 'hotdog',
//    calories: 400,
//    'primary-ingredients': [ 'bun', 'dog', 'mustard', 'ketchup' ]
//  };
```

Simple arrays are supported
```
//$ node nouns.js person place thing

var cla = require('command-line-arguments');
var nouns = cla.getCommandLineArguments();

// nouns = ['person', 'place', 'thing'];
```

You can pass in the parameters if you need to, or pass in no parameters and it will automatically read the command line arguments
```
//$ node program.js

var params = ['car', '-model', '--2001 Toyota Corolla', '-milage', '--219,000', '-color', '--tan' ];
var paramsParsed = cla.getCommandLineArguments(params);

// paramsParsed = {
//  car: {
//    model: '2001 Toyota Corolla',
//    milage: '219,000',
//    color: 'tan'
//  }
//}
```

##Licensing
This project is licensed under the terms of the MIT license
