import { SyntaxKind } from './index.js';

/**
 * Represents a syntax node in a tree structure.
 */
export class SyntaxNode {
    /**
     * Creates a SyntaxNode.
     * 
     * @param {SyntaxKind} kind - The kind of syntax node.
     * @param {{ start: number, end: number, line: number, column: number }} location - The position of the syntax node in the source code.
     */
    constructor(kind, location) {
        this.kind = kind;
        this.location = location;
    };

    /**
     * Retrieves an array of child syntax nodes.
     * 
     * @returns {SyntaxNode[]} An array of child syntax nodes.
     */
    getChildren() { return [] };
};