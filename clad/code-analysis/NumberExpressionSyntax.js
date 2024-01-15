import { SyntaxKind, ExpressionSyntax } from './index.js';

export class NumberExpressionSyntax extends ExpressionSyntax {
    numberToken;

    /**
     * @param {import('./index.js').SyntaxToken} numberToken
     */
    constructor(numberToken) {
        super(SyntaxKind.NumberExpression);

        this.numberToken = numberToken;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.numberToken];
    };
};