"use strict";
exports.__esModule = true;
//Naive implementation based on wikipedia article on Wagner-Fischer Algorithm
//and text in Skiena
var jslevenshtein = require('js-levenshtein');
var metriclcs = require('metric-lcs');
/*
Performs one instance of a levenshtein distance
given two strings, and returns the distance. The
complexity of this method is O(mn), where m and n
are the lengths of the current and optimal string
*/
function levenshteinDist(a, b) {
    var table = Array(b.length + 1).fill(0).map(function () { return Array(a.length + 1).fill(0); });
    //edge cases for comparing with empty string
    for (var i = 0; i <= a.length; i += 1) {
        table[0][i] = i;
    }
    for (var j = 0; j <= b.length; j += 1) {
        table[j][0] = j;
    }
    for (var j = 1; j <= b.length; j++) {
        for (var i = 1; i <= b.length; i++) {
            var sub = a[i - 1] == b[j - 1] ? 0 : 1;
            table[j][i] = Math.min(table[j][i - 1] + 1, table[j - 1][i] + 1, table[j - 1][i - 1] + sub);
        }
    }
    return table[b.length][a.length];
}
exports.levenshteinDist = levenshteinDist;
/*
Performs one instance of a levenshtein calculation
given two strings, and returns the dynamic programming table
*/
function levenshteinTable(a, b) {
    var table = Array(b.length + 1).fill(0).map(function () { return Array(a.length + 1).fill(0); });
    //edge cases for comparing with empty string
    for (var i = 0; i <= a.length; i += 1) {
        table[0][i] = i;
    }
    for (var j = 0; j <= b.length; j += 1) {
        table[j][0] = j;
    }
    for (var j = 1; j <= b.length; j++) {
        for (var i = 1; i <= b.length; i++) {
            var sub = a[i - 1] == b[j - 1] ? 0 : 1;
            table[j][i] = Math.min(table[j][i - 1] + 1, table[j - 1][i] + 1, table[j - 1][i - 1] + sub);
        }
    }
    return table;
}
exports.levenshteinTable = levenshteinTable;
/*
recursively finds the optimum string associated with a
dynamic programming table
*/
function levenshteinString(table) {
    return "a";
}
exports.levenshteinString = levenshteinString;
var a = "this is a short sentence and this is a long sentence and this is a medium sentence Naive implementation based on wikipedia article on Wagner-Fischer Algorithm and text in Skiena pdfpdppdfad df Returns a new CharStream representing the head of the input at the current position.  Throws an exception if the CharStream isempty. asdfasdfoefjawepqoepkmvjcxnaikmlsdjfkmewa fkdfmadsf oewa f w49r23rmr p sat takes a predicate and yields a parser that consumes a* single character if the character satisfies the predicate,* otherwise it fails.fgsdgsfd sdfgsfgsfdgsdgdf=a-0g-e-34t=wr-gwreg ggg3gseg4g30w4g-irojg4gokwij43g gj 3-ko3rfw3r gjw3ij pjw3gwjg w43gjw4 g-93wjw-34g9-w43 jg4-w g-wjg-wjg4-w4gjw-3 g-94wjg-wj4-w4 gjg-jg-wjgw3g-jg rg34u 34h89t9gh0rghgrkgfgm m mdkandf pjff";
var b = "recursively finds the optimum string associated with a dynamic programming table Performs one instance of a levenshtein calculation given two strings, and returns the dynamic programming table Returns true if the input at the current position is empty. Notethat a CharStream at the end of the input contains an emptystring but that an empty string may not be the end-of-file (i.e.,isEOF is false). choice specifies an ordered choice between two parsers,* p1 and p2. The returned parser will first apply* parser p1.  If p1 succeeds, p1's Outcome is returned.* If p1 fails, p2 is applied and the Outcome of p2 is returned.** An exception is when an outcome is a critical failure,* that outcome is immediately returned.4 t0q34t9q-u4 -q=9gq3u43wu4-34g=3g39= gq3 g3g4g q4";
console.log("string length: " + a.length);
console.time("metric");
console.log("metric: " + metriclcs(a, a));
console.timeEnd("metric");
console.time("jsl");
console.log("jsl: " + jslevenshtein(a, a));
console.timeEnd("jsl");
