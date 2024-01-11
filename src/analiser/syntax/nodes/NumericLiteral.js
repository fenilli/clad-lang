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
export class NumericLiteral extends SyntaxNode {
    /**
     * Creates an instance of NumericLiteral.
     *
     * @param {SyntaxToken} number - The number syntax token.
     */
    constructor(number) {
        super(SyntaxKind.NumericLiteral, number.location);

        this.number = number;
    };

    getChildren() { return [this.number] };
};