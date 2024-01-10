import { it } from 'node:test';

import { tests, assertToken, SyntaxKind } from './utils.js';

/**
 * @type {[string, string, string[]][]}
 */
export const resultKindSpecialCases = [
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

export default () => {
    it('scans token pairs', () => {
        for (const [kindL, inputL] of tests) {
            for (const [kindR, inputR] of tests) {
                const assert = assertToken(`${inputL}${inputR}`);

                let expecteds = [kindL, kindR];
                for (const [kindLL, kindRR, kinds] of resultKindSpecialCases) {
                    if (kindLL !== kindL || kindRR !== kindR) continue;

                    expecteds = kinds;
                };

                for (const expected of expecteds) {
                    assert(expected);
                };
            };
        };
    });
};