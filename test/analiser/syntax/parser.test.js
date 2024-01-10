import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Parser } from '../../../src/analiser/syntax/parser.js';
import {
    SyntaxFacts,
    SyntaxKind,
    SyntaxNode,
    SyntaxToken,
} from '../../../src/analiser/syntax/factory/index.js';
import { SourceFile } from '../../../src/analiser/syntax/nodes/index.js';

/**
 * Creates an assertion method for asserting AST nodes.
 * 
 * @param {SourceFile} ast
 */
const createASTAssertions = (ast) => {
    /**
     * Creates an assertion method for asserting AST nodes.
     * 
     * @param {SyntaxNode} node
     * @param {SyntaxNode[]} result
     */
    const flattenAST = (node, result = []) => {
        if (node) {
            result.push(node); // Visit the current node

            for (const child of node.getChildren()) {
                flattenAST(child, result);
            };
        };

        return result;
    };

    const flattenedAST = flattenAST(ast);

    let cursor = 0;

    const next = () => {
        if (cursor > flattenedAST.length) return flattenedAST[flattenedAST.length - 1];

        return flattenedAST[cursor++];
    };

    let current = next();

    /**
     * Asserts a node and moves the cursor ahead one.
     * 
     * @param {SyntaxKind} kind
     */
    const assertNode = (kind) => {
        assert.equal(kind, current.kind);
        assert(!(current instanceof SyntaxToken));
        current = next();
    };

    /**
     * Asserts a token with text and moves the cursor ahead one.
     * 
     * @param {SyntaxKind} kind
     * @param {string | undefined} text
     */
    const assertTokenText = (kind, text) => {
        assert.equal(kind, current.kind);
        assert(current instanceof SyntaxToken);
        assert.equal(text, current.text);
        current = next();
    };

    /**
     * Asserts a token and moves the cursor ahead one.
     * 
     * @param {SyntaxKind} kind
     * @param {any | undefined} value
     */
    const assertTokenValue = (kind, value) => {
        assert.equal(kind, current.kind);
        assert(current instanceof SyntaxToken);
        assert.equal(value, current.value);
        current = next();
    };

    assertNode(SyntaxKind.SourceFile);

    return {
        assertNode,
        assertTokenText,
        assertTokenValue,
    };
};

describe('Parser', () => {
    it('parses a numeric literal', () => {
        const ast = new Parser('1').parse();
        const { assertNode, assertTokenValue } = createASTAssertions(ast);

        assertNode(SyntaxKind.NumericLiteral);
        assertTokenValue(SyntaxKind.NumberToken, 1);
    });

    it('parses a boolean literal', () => {
        /** @type {[string, boolean][]} */
        const booleanTests = [
            [SyntaxKind.TrueKeyword, true],
            [SyntaxKind.FalseKeyword, false],
        ];

        for (const [kind, input] of booleanTests) {
            const ast = new Parser(`${input}`).parse();
            const { assertNode, assertTokenValue } = createASTAssertions(ast);

            assertNode(SyntaxKind.BooleanLiteral);
            assertTokenValue(kind, input);
        };
    });

    it('parses a identifier expression', () => {
        const ast = new Parser('x').parse();
        const { assertNode, assertTokenText } = createASTAssertions(ast);

        assertNode(SyntaxKind.IdentifierExpression);
        assertTokenText(SyntaxKind.IdentifierToken, 'x');
    });

    it('parses a parenthesized expression', () => {
        const ast = new Parser('(1)').parse();
        const { assertNode, assertTokenValue } = createASTAssertions(ast);

        assertNode(SyntaxKind.ParenthesizedExpression);
        assertNode(SyntaxKind.NumericLiteral);
        assertTokenValue(SyntaxKind.NumberToken, 1);
    });

    it('parses assignment expressions', () => {
        const ast = new Parser(`a = 10`).parse();
        const { assertNode, assertTokenText, assertTokenValue } = createASTAssertions(ast);

        assertNode(SyntaxKind.AssignmentExpression);
        assertTokenText(SyntaxKind.IdentifierToken, 'a');
        assertTokenText(SyntaxKind.EqualsToken, '=');
        assertNode(SyntaxKind.NumericLiteral);
        assertTokenValue(SyntaxKind.NumberToken, 10);
    });

    describe('Expressions with Operators', () => {
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

        it('parses prefix expressions', () => {
            for (const [kind, operator] of prefixOperators) {
                const ast = new Parser(`${operator}a`).parse();
                const { assertNode, assertTokenText } = createASTAssertions(ast);

                assertNode(SyntaxKind.PrefixExpression);
                assertTokenText(kind, operator);
                assertNode(SyntaxKind.IdentifierExpression);
                assertTokenText(SyntaxKind.IdentifierToken, 'a');
            };
        });

        it('parses prefix and infix expressions with the correct operator precedence', () => {
            for (const [kindP, operatorP] of prefixOperators) {
                for (const [kindI, operatorI] of infixOperators) {
                    const ast = new Parser(`${operatorP}a ${operatorI} b`).parse();
                    const { assertNode, assertTokenText } = createASTAssertions(ast);

                    if (SyntaxFacts.getPrefixOperatorPrecedence(kindP) >= SyntaxFacts.getInfixOperatorPrecedence(kindI)) {
                        assertNode(SyntaxKind.InfixExpression);
                        assertNode(SyntaxKind.PrefixExpression);
                        assertTokenText(kindP, operatorP);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'a');
                        assertTokenText(kindI, operatorI);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'b');
                    } else {
                        assertNode(SyntaxKind.PrefixExpression);
                        assertTokenText(kindP, operatorP);
                        assertNode(SyntaxKind.InfixExpression);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'a');
                        assertTokenText(kindI, operatorI);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'b');
                    };
                };
            };
        });

        it('parses infix expressions with correct operator precedence', () => {
            for (const [kindL, operatorL] of infixOperators) {
                for (const [kindR, operatorR] of infixOperators) {
                    const ast = new Parser(`a ${operatorL} b ${operatorR} c`).parse();
                    const { assertNode, assertTokenText } = createASTAssertions(ast);

                    if (SyntaxFacts.getInfixOperatorPrecedence(kindL) >= SyntaxFacts.getInfixOperatorPrecedence(kindR)) {
                        assertNode(SyntaxKind.InfixExpression);
                        assertNode(SyntaxKind.InfixExpression);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'a');
                        assertTokenText(kindL, operatorL);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'b');
                        assertTokenText(kindR, operatorR);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'c');
                    } else {
                        assertNode(SyntaxKind.InfixExpression);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'a');
                        assertTokenText(kindL, operatorL);
                        assertNode(SyntaxKind.InfixExpression);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'b');
                        assertTokenText(kindR, operatorR);
                        assertNode(SyntaxKind.IdentifierExpression);
                        assertTokenText(SyntaxKind.IdentifierToken, 'c');
                    };
                };
            };
        });
    });
});