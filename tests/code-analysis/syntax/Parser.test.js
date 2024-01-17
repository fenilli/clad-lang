import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SyntaxTree, SyntaxKind, SyntaxFacts } from '../../../clad/code-analysis/syntax/index.js';

/**
 * @param {import('../../../clad/code-analysis/syntax/index.js').SyntaxNode} node
 * @param {import('../../../clad/code-analysis/syntax/index.js').SyntaxNode[]} result
 */
const flatten = (node, result = []) => {
    if (node) {
        result.push(node);

        for (const child of node.getChildren()) {
            flatten(child, result);
        };
    };

    return result;
};

/**
 * @param {string} input
 */
const assertTree = (input) => {
    const syntaxTree = SyntaxTree.parse(input);
    const nodes = flatten(syntaxTree.root);

    let cursor = 0;

    const next = () => {
        if (cursor > nodes.length) return nodes[nodes.length - 1];

        return nodes[cursor++];
    };

    let current = next();

    return {
        nodes,
        /**
         * @param {SyntaxKind} expectedKind
         * @param {string} expectedText
         * @param {string} [expectedValue]
         */
        token: (expectedKind, expectedText, expectedValue) => {
            const token = /** @type {import('../../../clad/code-analysis/syntax/index.js').SyntaxToken} */ (current);

            assert.equal(token.kind, expectedKind);
            assert.equal(token.text, expectedText);
            if (expectedValue) assert.equal(token.value, expectedValue);
            current = next();
        },
        /**
         * @param {SyntaxKind} expectedKind
         */
        node: (expectedKind) => {
            assert.equal(current.kind, expectedKind);
            current = next();
        },
    };
};

const unaryOperators = [
    [SyntaxKind.BangToken, '!'],
    [SyntaxKind.PlusToken, '+'],
    [SyntaxKind.MinusToken, '-'],
];

const binaryOperators = [
    [SyntaxKind.AmpersandAmpersandToken, '&&'],
    [SyntaxKind.PipePipeToken, '||'],
    [SyntaxKind.EqualsEqualsToken, '=='],
    [SyntaxKind.PlusToken, '+'],
    [SyntaxKind.MinusToken, '-'],
    [SyntaxKind.StarToken, '*'],
    [SyntaxKind.SlashToken, '/'],
];

describe('Parser Tests', () => {
    unaryOperators.forEach(([op, text]) => {
        const input = `${text}a`;
        const assert = assertTree(input);

        it(`parses unary expression <${op}>.`, () => {
            assert.node(SyntaxKind.UnaryExpression);
            assert.token(op, text);
            assert.node(SyntaxKind.NameExpression);
            assert.token(SyntaxKind.IdentifierToken, 'a');
        });
    });

    binaryOperators.forEach(([opl, textl]) => {
        binaryOperators.forEach(([opr, textr]) => {
            const input = `a ${textl} b ${textr} c`;
            const assert = assertTree(input);

            if (SyntaxFacts.getBinaryOperatorPrecedence(opl) >= SyntaxFacts.getBinaryOperatorPrecedence(opr)) {
                it(`parses binary expression <${opl}> and <${opr}> when <${opl}> has higher or equal precedence.`, () => {
                    assert.node(SyntaxKind.BinaryExpression);
                    assert.node(SyntaxKind.BinaryExpression);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'a');
                    assert.token(opl, textl);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'b');
                    assert.token(opr, textr);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'c');
                });
            } else {
                it(`parses binary expression <${opl}> and <${opr}> when <${opr}> has higher precedence.`, () => {
                    assert.node(SyntaxKind.BinaryExpression);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'a');
                    assert.token(opl, textl);
                    assert.node(SyntaxKind.BinaryExpression);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'b');
                    assert.token(opr, textr);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'c');
                });
            };
        });
    });

    unaryOperators.forEach(([opu, textu]) => {
        binaryOperators.forEach(([opb, textb]) => {
            const input = `${textu}a ${textb} b`;
            const assert = assertTree(input);

            if (SyntaxFacts.getUnaryOperatorPrecedence(opu) >= SyntaxFacts.getBinaryOperatorPrecedence(opb)) {
                it(`parses unary expression <${opu}> when its has higher or equal precedence than binary expression <${opb}>.`, () => {
                    assert.node(SyntaxKind.BinaryExpression);
                    assert.node(SyntaxKind.UnaryExpression);
                    assert.token(opu, textu);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'a');
                    assert.token(opb, textb);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'b');
                });
            } else {
                it(`parses binary expression <${opb}> when its has higher precedence than unary expression <${opu}>.`, () => {
                    assert.node(SyntaxKind.UnaryExpression);
                    assert.token(opu, textu);
                    assert.node(SyntaxKind.BinaryExpression);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'a');
                    assert.token(opb, textb);
                    assert.node(SyntaxKind.NameExpression);
                    assert.token(SyntaxKind.IdentifierToken, 'b');
                });
            };
        });
    });
});