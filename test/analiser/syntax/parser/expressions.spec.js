import { it } from 'node:test';

import { assertParser, SyntaxKind, SyntaxFacts } from './utils.js';

export default () => {
    const prefixOperators = [
        [SyntaxKind.BangToken, '!'],
        [SyntaxKind.PlusToken, '+'],
        [SyntaxKind.MinusToken, '-'],
    ];

    const infixOperators = [
        [SyntaxKind.DoubleAmpersandToken, '&&'],
        [SyntaxKind.DoublePipeToken, '||'],
        [SyntaxKind.DoubleEqualToken, '=='],
        [SyntaxKind.PlusToken, '+'],
        [SyntaxKind.MinusToken, '-'],
        [SyntaxKind.AsteriskToken, '*'],
        [SyntaxKind.SlashToken, '/'],
    ];

    it('parses a parenthesized expression', () => {
        const assert = assertParser('(1)');

        assert(SyntaxKind.ParenthesizedExpression);
        assert(SyntaxKind.NumericLiteral);
        assert(SyntaxKind.NumberToken, { value: 1 });
    });

    it('parses assignment expressions', () => {
        const assert = assertParser('x = 42');

        assert(SyntaxKind.AssignmentExpression);
        assert(SyntaxKind.IdentifierToken, { text: 'x' });
        assert(SyntaxKind.EqualsToken, { text: '=' });
        assert(SyntaxKind.NumericLiteral);
        assert(SyntaxKind.NumberToken, { value: 42 });
    });

    it('parses prefix expressions', () => {
        for (const [kind, operator] of prefixOperators) {
            const assert = assertParser(`${operator}a`);

            assert(SyntaxKind.PrefixExpression);
            assert(kind, { text: operator });
            assert(SyntaxKind.IdentifierExpression);
            assert(SyntaxKind.IdentifierToken, { text: 'a' });
        };
    });

    it('parses infix expressions with correct operator precedence', () => {
        for (const [kindL, operatorL] of infixOperators) {
            for (const [kindR, operatorR] of infixOperators) {
                const assert = assertParser(`a ${operatorL} b ${operatorR} c`);

                if (SyntaxFacts.getInfixOperatorPrecedence(kindL) >= SyntaxFacts.getInfixOperatorPrecedence(kindR)) {
                    assert(SyntaxKind.InfixExpression);
                    assert(SyntaxKind.InfixExpression);
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'a' });
                    assert(kindL, { text: operatorL });
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'b' });
                    assert(kindR, { text: operatorR });
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'c' });
                } else {
                    assert(SyntaxKind.InfixExpression);
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'a' });
                    assert(kindL, { text: operatorL });
                    assert(SyntaxKind.InfixExpression);
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'b' });
                    assert(kindR, { text: operatorR });
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'c' });
                };
            };
        };
    });

    it('parses prefix and infix expressions with the correct operator precedence', () => {
        for (const [kindP, operatorP] of prefixOperators) {
            for (const [kindI, operatorI] of infixOperators) {
                const assert = assertParser(`${operatorP}a ${operatorI} b`);

                if (SyntaxFacts.getPrefixOperatorPrecedence(kindP) >= SyntaxFacts.getInfixOperatorPrecedence(kindI)) {
                    assert(SyntaxKind.InfixExpression);
                    assert(SyntaxKind.PrefixExpression);
                    assert(kindP, { text: operatorP });
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'a' });
                    assert(kindI, { text: operatorI });
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'b' });
                } else {
                    assert(SyntaxKind.PrefixExpression);
                    assert(kindP, { text: operatorP });
                    assert(SyntaxKind.InfixExpression);
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'a' });
                    assert(kindI, { text: operatorI });
                    assert(SyntaxKind.IdentifierExpression);
                    assert(SyntaxKind.IdentifierToken, { text: 'b' });
                };
            };
        };
    });
};