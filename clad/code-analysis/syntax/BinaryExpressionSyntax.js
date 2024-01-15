import { SyntaxKind, ExpressionSyntax } from './index.js';

export class BinaryExpressionSyntax extends ExpressionSyntax {
    left;
    operatorToken;
    right;

    /**
     * @param {ExpressionSyntax} left
     * @param {import('./index.js').SyntaxToken} operatorToken
     * @param {ExpressionSyntax} right
     */
    constructor(left, operatorToken, right) {
        super(SyntaxKind.BinaryExpression);

        this.left = left;
        this.operatorToken = operatorToken;
        this.right = right;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.left, this.operatorToken, this.right];
    };
};