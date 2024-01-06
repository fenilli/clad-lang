import {
    SyntaxKind,
    SyntaxNode,
} from '../index.js';

/**
 * Represents a numeric literal in the syntax tree.
 *
 * @extends {SyntaxNode}
 */
export class NumericLiteral extends SyntaxNode {
    /**
     * Creates an instance of NumericLiteral.
     *
     * @param {SyntaxNode} number - The number syntax token.
     */
    constructor(number) {
        super(SyntaxKind.NumericLiteral, number.pos);

        this.number = number;
    };

    getChildren() { return [this.number] };
};