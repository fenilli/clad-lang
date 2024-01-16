import { SyntaxKind, ExpressionSyntax } from './index.js';

export class LiteralExpressionSyntax extends ExpressionSyntax {
    literalToken;
    value;

    /**
     * @param {import('./index.js').SyntaxToken} literalToken
     * @param {any} [value]
     */
    constructor(literalToken, value) {
        super(SyntaxKind.LiteralExpression);

        this.literalToken = literalToken;
        this.value = typeof value !== 'undefined' ? value : literalToken.value;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.literalToken];
    };
};