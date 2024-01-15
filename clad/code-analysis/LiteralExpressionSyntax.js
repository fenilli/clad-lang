import { SyntaxKind, ExpressionSyntax } from './index.js';

export class LiteralExpressionSyntax extends ExpressionSyntax {
    literalToken;

    /**
     * @param {import('./index.js').SyntaxToken} literalToken
     */
    constructor(literalToken) {
        super(SyntaxKind.LiteralExpression);

        this.literalToken = literalToken;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.literalToken];
    };
};