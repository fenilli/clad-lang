import { SyntaxNode } from './index.js';

export class SyntaxToken extends SyntaxNode {
    text;
    value;
    span;

    /**
     * @param {import('./index.js').SyntaxKind} kind
     * @param {string} text
     * @param {any} value
     * @param {import('../text/TextSpan.js').TextSpan} span
     */
    constructor(kind, text, value, span) {
        super(kind);

        this.text = text;
        this.value = value;
        this.span = span;
    };
};