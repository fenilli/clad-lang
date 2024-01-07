import { SyntaxKind } from './index.js';

/**
 * Represents a syntax token in a tree structure.
 */
export class SyntaxNode {
    /**
     * Creates a SyntaxNode.
     * 
     * @param {SyntaxKind} kind - The kind of syntax node.
     * @param {number} pos - The position of the syntax node in the source code.
     */
    constructor(kind, pos) {
        this.kind = kind;
        this.pos = pos;
    };

    /**
     * Retrieves an array of child syntax nodes.
     * 
     * @returns {SyntaxNode[]} An array of child syntax nodes.
     */
    getChildren() { return [] };
};