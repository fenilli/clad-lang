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

const infixOperators = [
    [SyntaxKind.DoubleAmpersandToken, '&&'],
    [SyntaxKind.DoublePipeToken, '||'],
    [SyntaxKind.DoubleEqualToken, '=='],
    [SyntaxKind.PlusToken, '+'],
    [SyntaxKind.MinusToken, '-'],
    [SyntaxKind.AsteriskToken, '*'],
    [SyntaxKind.SlashToken, '/'],
];

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
        assert(typeof current !== 'boolean');
        assert(!(current instanceof SyntaxToken));
        assert.equal(kind, current.kind);
        current = next();
    };

    /**
     * Asserts a token and moves the cursor ahead one.
     * 
     * @param {SyntaxKind} kind
     * @param {string | undefined} text
     */
    const assertToken = (kind, text) => {
        assert(typeof current !== 'boolean');
        assert(current instanceof SyntaxToken);
        assert.equal(kind, current.kind);
        assert.equal(text, current.text);
        current = next();
    };

    assertNode(SyntaxKind.SourceFile);

    return {
        assertNode,
        assertToken,
    };
};

describe('Parser', () => {
    it('parses infix expressions with correct operator precedence', () => {
        for (const [kindL, operatorL] of infixOperators) {
            for (const [kindR, operatorR] of infixOperators) {
                const ast = new Parser(`a ${operatorL} b ${operatorR} c`).parse();
                const { assertNode, assertToken } = createASTAssertions(ast);

                if (SyntaxFacts.getInfixOperatorPrecedence(kindL) >= SyntaxFacts.getInfixOperatorPrecedence(kindR)) {
                    assertNode(SyntaxKind.InfixExpression);
                    assertNode(SyntaxKind.InfixExpression);
                    assertNode(SyntaxKind.IdentifierExpression);
                    assertToken(SyntaxKind.IdentifierToken, 'a');
                    assertToken(kindL, operatorL);
                    assertNode(SyntaxKind.IdentifierExpression);
                    assertToken(SyntaxKind.IdentifierToken, 'b');
                    assertToken(kindR, operatorR);
                    assertNode(SyntaxKind.IdentifierExpression);
                    assertToken(SyntaxKind.IdentifierToken, 'c');
                } else {
                    assertNode(SyntaxKind.InfixExpression);
                    assertNode(SyntaxKind.IdentifierExpression);
                    assertToken(SyntaxKind.IdentifierToken, 'a');
                    assertToken(kindL, operatorL);
                    assertNode(SyntaxKind.InfixExpression);
                    assertNode(SyntaxKind.IdentifierExpression);
                    assertToken(SyntaxKind.IdentifierToken, 'b');
                    assertToken(kindR, operatorR);
                    assertNode(SyntaxKind.IdentifierExpression);
                    assertToken(SyntaxKind.IdentifierToken, 'c');
                };
            }
        }
    });
});