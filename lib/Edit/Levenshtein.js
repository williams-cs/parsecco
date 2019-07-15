"use strict";
exports.__esModule = true;
/*
Performs one instance of a levenshtein calculation
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
console.log(levenshteinDist("var x = 2", "let y = 3"));
console.log(levenshteinTable("var x = 2", "let y = 3"));
