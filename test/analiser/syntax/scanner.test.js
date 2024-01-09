import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Scanner } from '../../../src/analiser/syntax/scanner.js';
import { SyntaxKind } from '../../../src/analiser/syntax/factory/SyntaxKind.js';

const tests = [
    [SyntaxKind.WhitespaceToken, ' '],
    [SyntaxKind.WhitespaceToken, '  '],
    [SyntaxKind.WhitespaceToken, '\r'],
    [SyntaxKind.WhitespaceToken, '\n'],
    [SyntaxKind.WhitespaceToken, '\r\n'],

    [SyntaxKind.NumberToken, '1'],
    [SyntaxKind.NumberToken, '12'],

    [SyntaxKind.IdentifierToken, 'a'],
    [SyntaxKind.IdentifierToken, 'ab'],

    [SyntaxKind.DoubleAmpersandToken, '&&'],
    [SyntaxKind.DoublePipeToken, '||'],
    [SyntaxKind.DoubleEqualToken, '=='],
    [SyntaxKind.BangEqualToken, '!='],
    [SyntaxKind.EqualsToken, '='],
    [SyntaxKind.PlusToken, '+'],
    [SyntaxKind.MinusToken, '-'],
    [SyntaxKind.AsteriskToken, '*'],
    [SyntaxKind.SlashToken, '/'],
    [SyntaxKind.BangToken, '!'],
    [SyntaxKind.OpenParenToken, '('],
    [SyntaxKind.CloseParenToken, ')'],

    [SyntaxKind.TrueKeyword, 'true'],
    [SyntaxKind.FalseKeyword, 'false'],
];

/**
 * @type {[string, string, string[]][]}
 */
const specialCases = [
    [SyntaxKind.WhitespaceToken, SyntaxKind.WhitespaceToken, [SyntaxKind.WhitespaceToken]],

    [SyntaxKind.NumberToken, SyntaxKind.NumberToken, [SyntaxKind.NumberToken]],

    [SyntaxKind.IdentifierToken, SyntaxKind.IdentifierToken, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.IdentifierToken, SyntaxKind.NumberToken, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.IdentifierToken, SyntaxKind.TrueKeyword, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.IdentifierToken, SyntaxKind.FalseKeyword, [SyntaxKind.IdentifierToken]],

    [SyntaxKind.TrueKeyword, SyntaxKind.IdentifierToken, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.TrueKeyword, SyntaxKind.NumberToken, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.TrueKeyword, SyntaxKind.TrueKeyword, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.TrueKeyword, SyntaxKind.FalseKeyword, [SyntaxKind.IdentifierToken]],

    [SyntaxKind.FalseKeyword, SyntaxKind.IdentifierToken, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.FalseKeyword, SyntaxKind.NumberToken, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.FalseKeyword, SyntaxKind.FalseKeyword, [SyntaxKind.IdentifierToken]],
    [SyntaxKind.FalseKeyword, SyntaxKind.TrueKeyword, [SyntaxKind.IdentifierToken]],

    [SyntaxKind.EqualsToken, SyntaxKind.EqualsToken, [SyntaxKind.DoubleEqualToken]],
    [SyntaxKind.EqualsToken, SyntaxKind.DoubleEqualToken, [SyntaxKind.DoubleEqualToken, SyntaxKind.EqualsToken]],

    [SyntaxKind.BangToken, SyntaxKind.EqualsToken, [SyntaxKind.BangEqualToken]],
    [SyntaxKind.BangToken, SyntaxKind.DoubleEqualToken, [SyntaxKind.BangEqualToken, SyntaxKind.EqualsToken]],
];

describe('Scanner', () => {
    it('scans all single tokens', () => {
        for (const [kind, input] of tests) {
            const scanner = new Scanner(input);
            assert.equal(kind, scanner.next().kind);
        };
    });

    it('scans all pairs tokens', () => {
        for (const [kindL, inputL] of tests) {
            for (const [kindR, inputR] of tests) {
                const scanner = new Scanner(`${inputL}${inputR}`);

                let toTest = [kindL, kindR];
                for (const [combineL, combineR, kinds] of specialCases) {
                    if (combineL !== kindL || combineR !== kindR) continue;

                    toTest = kinds;
                };

                for (const testKind of toTest) {
                    assert.equal(testKind, scanner.next().kind);
                };
            };
        };
    });
});