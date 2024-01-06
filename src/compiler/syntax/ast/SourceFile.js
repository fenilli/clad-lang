import {
    SyntaxKind,
    SyntaxNode
} from '../index.js';

/**
 * Represents a SourceFile class that extends SyntaxNode.
 * 
 * @extends {SyntaxNode}
 */
export class SourceFile extends SyntaxNode {
    /**
     * Creates a SyntaxToken.
     * 
     * @param {SyntaxNode} body - The body of the source file
     */
    constructor(body) {
        super(SyntaxKind.SourceFile, body.pos);

        this.body = body;
    };

    getChildren() { return [this.body] };
};