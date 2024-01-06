import {
    SyntaxKind,
    SyntaxNode,
    SyntaxToken,
} from '../index.js';

/**
 * Represents a infix expression in the syntax tree.
 *
 * @extends {SyntaxNode}
 */
export class InfixExpression extends SyntaxNode {
    /**
     * Creates an instance of InfixExpression.
     *
     * @param {SyntaxNode} left - The left expression node.
     * @param {SyntaxToken} operator - The operator syntax token.
     * @param {SyntaxNode} right - The right expression node.
     */
    constructor(left, operator, right) {
        super(SyntaxKind.InfixExpression, left.pos);

        this.left = left;
        this.operator = operator;
        this.right = right;
    };

    getChildren() { return [this.left, this.operator, this.right] };
};