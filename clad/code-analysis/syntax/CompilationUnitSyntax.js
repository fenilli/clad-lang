import { SyntaxKind, SyntaxNode } from './index.js';

export class CompilationUnitSyntax extends SyntaxNode {
    expression;
    endOfFileToken;

    /**
     * @param {import('./index.js').ExpressionSyntax} expression
     * @param {import('./index.js').SyntaxToken} endOfFileToken
     */
    constructor(expression, endOfFileToken) {
        super(SyntaxKind.CompilationUnit);

        this.expression = expression;
        this.endOfFileToken = endOfFileToken;
    };
};