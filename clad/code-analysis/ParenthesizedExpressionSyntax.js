import { SyntaxKind, ExpressionSyntax } from './index.js';

export class ParenthesizedExpressionSyntax extends ExpressionSyntax {
    openParenthesisToken;
    expression;
    closeParenthesisToken;

    /**
     * @param {import('./index.js').SyntaxToken} openParenthesisToken
     * @param {ExpressionSyntax} expression
     * @param {import('./index.js').SyntaxToken} closeParenthesisToken
     */
    constructor(openParenthesisToken, expression, closeParenthesisToken) {
        super(SyntaxKind.ParenthesizedExpression);

        this.openParenthesisToken = openParenthesisToken;
        this.expression = expression;
        this.closeParenthesisToken = closeParenthesisToken;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.openParenthesisToken, this.expression, this.closeParenthesisToken];
    };
};