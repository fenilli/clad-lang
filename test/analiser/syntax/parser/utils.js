import assert from 'node:assert';

import { Parser } from '../../../../src/analiser/syntax/parser.js';
import {
    SyntaxFacts,
    SyntaxKind,
    SyntaxNode,
    SyntaxToken,
} from '../../../../src/analiser/syntax/factory/index.js';

/**
 * Creates an assertion method for asserting AST nodes.
 * 
 * @param {SyntaxNode} node
 * @param {SyntaxNode[]} result
 */
const flatten = (node, result = []) => {
    if (node) {
        result.push(node); // Visit the current node

        for (const child of node.getChildren()) {
            flatten(child, result);
        };
    };

    return result;
};

/**
 * Creates an assertion method for AST nodes.
 * 
 * @param {string} input
 */
export const assertParser = (input) => {
    const nodes = flatten(new Parser(input).parse());

    let cursor = 0;

    const next = () => {
        if (cursor > nodes.length) return nodes[nodes.length - 1];

        return nodes[cursor++];
    };

    let current = next();

    /**
     * Asserts a node and moves the cursor ahead one.
     * 
     * @param {SyntaxKind} expected
     * @param {{ text?: string, value?: any }} [value]
     */
    const assertNode = (expected, value) => {
        assert.equal(expected, current.kind);
        if (value && current instanceof SyntaxToken) {
            if (value.text) assert.equal(value.text, current.text);
            if (value.value) assert.equal(value.value, current.value);
        };
        current = next();
    };

    assertNode(SyntaxKind.SourceFile);

    return assertNode;
};

export { SyntaxFacts, SyntaxKind };