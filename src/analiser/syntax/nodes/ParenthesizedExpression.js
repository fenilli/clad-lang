import {
    SyntaxKind,
    SyntaxNode,
} from '../factory/index.js';

/**
 * Represents a parenthesized expression in the syntax tree.
 *
 * @extends {SyntaxNode}
 */
export class ParenthesizedExpression extends SyntaxNode {
    /**
     * Creates an instance of ParenthesizedExpression.
     *
     * @param {SyntaxNode} expression - The expression syntax token.
     */
    constructor(expression) {
        super(SyntaxKind.ParenthesizedExpression, expression.pos);

        this.expression = expression;
    };

    getChildren() { return [this.expression] };
};