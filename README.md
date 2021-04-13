# parsecco

Parsecco is a parser combinator library for Typescript. It has no dependencies!

## Installing

You can download Parsecco from [NPM](https://www.npmjs.com/package/parsecco). To install it in your NPM project:

```
$ npm install --save parsecco
```

## Documentation

This is auto-generated documentation from the [TSDoc](https://tsdoc.org) comments that preface every function. I was a little OCD about this-- every function should be well documented. If you find issues with the documentation, please open an issue.

[TSDoc documentation can be found here](https://williams-cs.github.io/parsecco/)

(todo) I plan to add tutorial documentation here in the near future. If you are familiar with the [Monadic Parser Combinators](https://www.cs.nott.ac.uk/~pszgmh/monparsing.pdf) paper by Meijer and Hutton, Parsecco is very much in that vein with a few small caveats:

1. I don't use unpronounceable names for parsers (come on, people!). If you don't like my names, too bad.
2. My `choice` combinator is an _ordered choice_ that returns the first match instead of all matches (in other words, it is `+++` and not `++` in Meijer and Hutton-speak).
3. TypeScript has no language-level support for lazy evaluation, so recursive grammar definitions need to be forward-declared. See the `recParser` family of functions; these were inspired by [FParsec](https://www.quanttec.com/fparsec/)'s approach.

## Developer Info

Contributions to Parsecco are welcome. If you would like to set up a developer environment, do the following steps:

1. Check out this repository.
2. Install development dependencies with
   ```
   $ npm install
   ```
3. Then build the library with
   ```
   $ npm run build
   ```

Please submit patches by pull request. Be sure that your patch passes all the tests (see below), and if your modification also needs testing, submit additional tests.

## TypeScript and TypeDoc versions

The current version of Parsecco is was developed and tested with TypeScript 4.2.3 and TypeDoc 0.20.34.

## Test Suite

An exhaustive test suite comes with Parsecco, and most of the dev dependencies are to the support the library's test suite. You can run the tests with:

```
$ npm test
```

You can run a specific test with

```
$ npm test -- --grep "a substring from the 'describe' or 'it' field you want to run"
```
