import { SyntaxKind, ExpressionSyntax } from './index.js';

export class AssignmentExpressionSyntax extends ExpressionSyntax {
    identifierToken;
    equalsToken;
    expression;

    /**
     * @param {import('./index.js').SyntaxToken} identifierToken
     * @param {import('./index.js').SyntaxToken} equalsToken
     * @param {ExpressionSyntax} expression
     */
    constructor(identifierToken, equalsToken, expression) {
        super(SyntaxKind.AssignmentExpression);

        this.identifierToken = identifierToken;
        this.equalsToken = equalsToken;
        this.expression = expression;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.identifierToken, this.equalsToken, this.expression];
    };
};