import { SyntaxNode } from './index.js';

export class ExpressionSyntax extends SyntaxNode {
    /**
     * @param {import('./index.js').SyntaxKind} kind
     */
    constructor(kind) {
        super(kind)
    };
};