import { it } from 'node:test';

import { assertParser, SyntaxKind } from './utils.js';

export default () => {
    it('parses a numeric literal', () => {
        const assert = assertParser('1');

        assert(SyntaxKind.NumericLiteral);
        assert(SyntaxKind.NumberToken, { value: 1 });
    });

    it('parses a boolean literal', () => {
        /** @type {[string, boolean][]} */
        const booleanTests = [
            [SyntaxKind.TrueKeyword, true],
            [SyntaxKind.FalseKeyword, false],
        ];

        for (const [kind, input] of booleanTests) {
            const assert = assertParser(`${input}`);

            assert(SyntaxKind.BooleanLiteral);
            assert(kind, { value: input });
        };
    });

    it('parses a identifier expression', () => {
        const assert = assertParser('x');

        assert(SyntaxKind.IdentifierExpression);
        assert(SyntaxKind.IdentifierToken, { text: 'x' });
    });
};