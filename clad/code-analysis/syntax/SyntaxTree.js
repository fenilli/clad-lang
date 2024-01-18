import { Parser } from './index.js';

export class SyntaxTree {
    #diagnostics;
    root;

    /**
     * @param {string} text
     */
    constructor(text) {
        const parser = new Parser(text);
        const root = parser.parseCompilationUnit();

        this.#diagnostics = parser.diagnostics;
        this.root = root;
    };

    get diagnostics() {
        return this.#diagnostics;
    };

    /**
     * @param {string} text 
     */
    static parse(text) {
        return new SyntaxTree(text);
    };
};