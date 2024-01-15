import { Parser } from './index.js';

export class SyntaxTree {
    #diagnostics;
    root;
    endOfFileToken;

    /**
     * @param {string[]} diagnostics
     * @param {import('./index.js').ExpressionSyntax} root
     * @param {import('./index.js').SyntaxToken} endOfFileToken
     */
    constructor(diagnostics, root, endOfFileToken) {
        this.#diagnostics = diagnostics;
        this.root = root;
        this.endOfFileToken = endOfFileToken;
    };

    get diagnostics() {
        return this.#diagnostics;
    };

    /**
     * @param {string} text 
     */
    static parse(text) {
        const parser = new Parser(text);

        return parser.parse();
    };
};