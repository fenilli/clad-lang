import assert from 'node:assert';

import { Scanner } from '../../../../src/analiser/syntax/scanner.js';
import { SyntaxKind } from '../../../../src/analiser/syntax/factory/SyntaxKind.js';

export const tests = [
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
 * Asserts if the token is of that kind.
 * 
 * @param {string} input 
 */
export const assertToken = (input) => {
    const scanner = new Scanner(input);

    /**
     * @param {SyntaxKind} expected
     */
    return (expected) => {
        assert.equal(expected, scanner.next().kind);
    };
};

export { SyntaxKind };