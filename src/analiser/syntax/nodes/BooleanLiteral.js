import {
    SyntaxKind,
    SyntaxNode,
    SyntaxToken,
} from '../factory/index.js';

/**
 * Represents a numeric literal in the syntax tree.
 *
 * @extends {SyntaxNode}
 */
export class BooleanLiteral extends SyntaxNode {
    /**
     * Creates an instance of BooleanLiteral.
     *
     * @param {SyntaxToken} bool - The boolean syntax token.
     */
    constructor(bool) {
        super(SyntaxKind.BooleanLiteral, bool.pos);

        this.bool = bool;
    };

    getChildren() { return [this.bool] };
};