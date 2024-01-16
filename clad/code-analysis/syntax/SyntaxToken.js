import { TextSpan } from '../TextSpan.js';
import { SyntaxNode } from './index.js';

export class SyntaxToken extends SyntaxNode {
    position;
    text;
    value;

    /**
     * @param {import('./index.js').SyntaxKind} kind
     * @param {number} position
     * @param {string} text
     * @param {any} value
     */
    constructor(kind, position, text, value) {
        super(kind);

        this.position = position;
        this.text = text;
        this.value = value;
    };

    /**
     * @returns {TextSpan}
     */
    get span() {
        return new TextSpan(this.position, this.text.length);
    };
};