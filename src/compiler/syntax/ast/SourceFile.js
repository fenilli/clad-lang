import {
    SyntaxKind,
    SyntaxNode,
} from '../index.js';

/**
 * Represents a source file in the syntax tree.
 * 
 * @extends {SyntaxNode}
 */
export class SourceFile extends SyntaxNode {
    /**
     * Creates an instance of SourceFile.
     * 
     * @param {SyntaxNode} body - The body of the source file
     */
    constructor(body) {
        super(SyntaxKind.SourceFile, body.pos);

        this.body = body;
    };

    getChildren() { return [this.body] };
};