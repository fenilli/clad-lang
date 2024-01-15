import { SyntaxKind, ExpressionSyntax } from './index.js';

export class UnaryExpressionSyntax extends ExpressionSyntax {
    operatorToken;
    operand;

    /**
     * @param {import('./index.js').SyntaxToken} operatorToken
     * @param {ExpressionSyntax} operand
     */
    constructor(operatorToken, operand) {
        super(SyntaxKind.UnaryExpression);

        this.operatorToken = operatorToken;
        this.operand = operand;
    };

    /**
     * @returns {import('./index.js').SyntaxNode[]}
     */
    getChildren() {
        return [this.operatorToken, this.operand];
    };
};