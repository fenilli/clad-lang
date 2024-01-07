import {
    SyntaxKind,
    SyntaxNode,
} from './index.js';

/**
 * Represents a syntax token in a tree structure.
 * 
 * @extends {SyntaxNode}
 */
export class SyntaxToken extends SyntaxNode {
    /**
     * Creates a SyntaxToken.
     * 
     * @param {SyntaxKind} kind - The kind of syntax node.
     * @param {number} pos - The position of the syntax node in the source code.
     * @param {string} [text] - The text representation of the syntax token.
     * @param {any} [value] - The value associated with the syntax token.
     */
    constructor(kind, pos, text, value) {
        super(kind, pos);

        this.text = text;
        this.value = value;
    };
};