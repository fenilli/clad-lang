import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Scanner } from '../../../src/analiser/syntax/scanner.js';
import { SyntaxKind } from '../../../src/analiser/syntax/factory/SyntaxKind.js';

const assertTokenHelper = (input = '', ignore = []) => {
    const scanner = new Scanner(input);

    let current = scanner.next();
    return (expected) => {
        while (ignore.some((kind) => kind === current.kind)) {
            current = scanner.next();
        };

        assert.equal(current.kind, expected);
        current = scanner.next();
    };
};

describe('Scanner', () => {
    it('scans whitespace token', () => {
        const assertToken = assertTokenHelper(' ');
        assertToken(SyntaxKind.WhitespaceToken);
    });

    it('scans keywords tokens', () => {
        const assertToken = assertTokenHelper('true false', [SyntaxKind.WhitespaceToken]);
        assertToken(SyntaxKind.TrueKeyword);
        assertToken(SyntaxKind.FalseKeyword);
    });

    it('scans symbol tokens', () => {
        const assertToken = assertTokenHelper('!= == && || = + - * / ! ( )', [SyntaxKind.WhitespaceToken]);
        assertToken(SyntaxKind.BangEqualToken);
        assertToken(SyntaxKind.DoubleEqualToken);
        assertToken(SyntaxKind.DoubleAmpersandToken);
        assertToken(SyntaxKind.DoublePipeToken);
        assertToken(SyntaxKind.EqualsToken);
        assertToken(SyntaxKind.PlusToken);
        assertToken(SyntaxKind.MinusToken);
        assertToken(SyntaxKind.AsteriskToken);
        assertToken(SyntaxKind.SlashToken);
        assertToken(SyntaxKind.BangToken);
        assertToken(SyntaxKind.OpenParenToken);
        assertToken(SyntaxKind.CloseParenToken);
    });

    it('scans literals tokens', () => {
        const assertToken = assertTokenHelper('10 x', [SyntaxKind.WhitespaceToken]);
        assertToken(SyntaxKind.NumberToken);
        assertToken(SyntaxKind.IdentifierToken);
    });
});