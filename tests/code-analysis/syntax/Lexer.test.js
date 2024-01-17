import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Lexer, SyntaxKind } from '../../../clad/code-analysis/syntax/index.js';

/**
 * @param {string} input
 */
const assertToken = (input) => {
    const lexer = new Lexer(input);

    return {
        /**
         * @param {SyntaxKind} expectedKind
         * @param {string} [expectedText]
         */
        token: (expectedKind, expectedText) => {
            const token = lexer.lex();

            assert.equal(expectedKind, token.kind);
            if (expectedText) assert.equal(expectedText, token.text);
        }
    };
};

/**
 * @return {[import('../../../clad/code-analysis/syntax/index.js').SyntaxKind, string][]}
 */
function getTests() {
    return [
        [SyntaxKind.PlusToken, '+'],
        [SyntaxKind.MinusToken, '-'],
        [SyntaxKind.StarToken, '*'],
        [SyntaxKind.SlashToken, '/'],
        [SyntaxKind.BangToken, '!'],
        [SyntaxKind.EqualsToken, '='],
        [SyntaxKind.AmpersandAmpersandToken, '&&'],
        [SyntaxKind.PipePipeToken, '||'],
        [SyntaxKind.EqualsEqualsToken, '=='],
        [SyntaxKind.BangEqualsToken, '!='],
        [SyntaxKind.OpenParenthesisToken, '('],
        [SyntaxKind.CloseParenthesisToken, ')'],

        [SyntaxKind.FalseKeyword, 'false'],
        [SyntaxKind.TrueKeyword, 'true'],

        [SyntaxKind.WhitespaceToken, ' '],
        [SyntaxKind.WhitespaceToken, '  '],
        [SyntaxKind.WhitespaceToken, '\r'],
        [SyntaxKind.WhitespaceToken, '\n'],
        [SyntaxKind.WhitespaceToken, '\r\n'],

        [SyntaxKind.IdentifierToken, 'a'],
        [SyntaxKind.IdentifierToken, 'abc'],

        [SyntaxKind.NumberToken, '1'],
        [SyntaxKind.NumberToken, '123'],
    ];
};

/**
 * @return {[
 *  import('../../../clad/code-analysis/syntax/index.js').SyntaxKind,
 *  import('../../../clad/code-analysis/syntax/index.js').SyntaxKind,
 *  import('../../../clad/code-analysis/syntax/index.js').SyntaxKind[]
 * ][]}
 */
function getSpecialPairCases() {
    return [
        [SyntaxKind.EqualsToken, SyntaxKind.EqualsToken, [SyntaxKind.EqualsEqualsToken]],
        [SyntaxKind.EqualsToken, SyntaxKind.EqualsEqualsToken, [SyntaxKind.EqualsEqualsToken, SyntaxKind.EqualsToken]],

        [SyntaxKind.BangToken, SyntaxKind.EqualsToken, [SyntaxKind.BangEqualsToken]],
        [SyntaxKind.BangToken, SyntaxKind.EqualsEqualsToken, [SyntaxKind.BangEqualsToken, SyntaxKind.EqualsToken]],

        [SyntaxKind.TrueKeyword, SyntaxKind.IdentifierToken, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.TrueKeyword, SyntaxKind.NumberToken, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.TrueKeyword, SyntaxKind.TrueKeyword, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.TrueKeyword, SyntaxKind.FalseKeyword, [SyntaxKind.IdentifierToken]],

        [SyntaxKind.FalseKeyword, SyntaxKind.IdentifierToken, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.FalseKeyword, SyntaxKind.NumberToken, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.FalseKeyword, SyntaxKind.FalseKeyword, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.FalseKeyword, SyntaxKind.TrueKeyword, [SyntaxKind.IdentifierToken]],

        [SyntaxKind.WhitespaceToken, SyntaxKind.WhitespaceToken, [SyntaxKind.WhitespaceToken]],

        [SyntaxKind.IdentifierToken, SyntaxKind.IdentifierToken, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.IdentifierToken, SyntaxKind.NumberToken, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.IdentifierToken, SyntaxKind.TrueKeyword, [SyntaxKind.IdentifierToken]],
        [SyntaxKind.IdentifierToken, SyntaxKind.FalseKeyword, [SyntaxKind.IdentifierToken]],

        [SyntaxKind.NumberToken, SyntaxKind.NumberToken, [SyntaxKind.NumberToken]],
    ];
};

describe('Lexer Tests', () => {
    getTests().forEach(([kind, text]) => {
        const input = `${text}`;

        it(`lexes <${kind}> token with input "${input.replace(/\r|\n/g, '<ESC>')}".`, () => {
            const assert = assertToken(input);

            assert.token(kind, text);
        });
    });

    getTests().forEach(([kindl, textl]) => {
        getTests().forEach(([kindr, textr]) => {
            const input = `${textl}${textr}`;

            it(`lexes <${kindl}> and <${kindr}> tokens with input "${input.replace(/\r|\n/g, '<ESC>')}".`, () => {
                const assert = assertToken(input);
                const expecteds = getSpecialPairCases().find(([kl, kr]) => kindl === kl && kindr === kr)?.[2] ?? [kindl, kindr];

                expecteds.forEach((expectedKind) => {
                    assert.token(expectedKind);
                });
            });
        });
    });
});