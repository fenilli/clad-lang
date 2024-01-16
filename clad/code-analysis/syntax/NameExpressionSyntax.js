import { SyntaxKind, ExpressionSyntax } from './index.js';

export class NameExpressionSyntax extends ExpressionSyntax {
    identifierToken;

    /**
     * @param {import('./index.js').SyntaxToken} identifierToken
     */
    constructor(identifierToken) {
        super(SyntaxKind.NameExpression);

        this.identifierToken = identifierToken;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.identifierToken];
    };
};