import { SyntaxFacts, SyntaxKind, SyntaxToken } from './index.js';

/**
 * @param {string} string
 * 
 * @returns {boolean}
 */
function isNumber(string) {
    return /\d/.test(string);
};

/**
 * @param {string} string 
 * 
 * @returns {boolean}
 */
function isWhitespace(string) {
    return /\s/.test(string);
};

/**
 * @param {string} string 
 * 
 * @returns {boolean}
 */
function isLetter(string) {
    return /\w/.test(string);
};

export class Lexer {
    #text = '';
    #position = 0;

    /** @type {string[]} */
    #diagnostics = [];

    /**
     * @param {string} text
     */
    constructor(text) {
        this.#text = text;
    };

    get diagnostics() {
        return this.#diagnostics;
    };

    get #current() {
        if (this.#position >= this.#text.length) return '\0';

        return this.#text[this.#position];
    };

    #next() {
        this.#position++;
    };

    /**
     * @returns {SyntaxToken}
     */
    lex() {
        if (this.#position >= this.#text.length) return new SyntaxToken(SyntaxKind.EndOfFileToken, this.#position, '\0', null);

        if (isNumber(this.#current)) {
            const start = this.#position;

            while (isNumber(this.#current)) this.#next();

            const text = this.#text.slice(start, this.#position);
            const value = parseInt(text);

            if (!value) {
                this.#diagnostics.push(`The number ${text} isn't a valid number.`);
            };

            return new SyntaxToken(SyntaxKind.NumberToken, start, text, value);
        };

        if (isWhitespace(this.#current)) {
            const start = this.#position;

            while (isWhitespace(this.#current)) this.#next();

            const text = this.#text.slice(start, this.#position);

            return new SyntaxToken(SyntaxKind.WhitespaceToken, start, text, null);
        };

        if (isLetter(this.#current)) {
            const start = this.#position;

            while (isLetter(this.#current)) this.#next();

            const text = this.#text.slice(start, this.#position);
            const kind = SyntaxFacts.getKeywordKind(text);
            return new SyntaxToken(kind, start, text, null);
        };

        switch (this.#current) {
            case '+': return new SyntaxToken(SyntaxKind.PlusToken, this.#position++, '+', null);
            case '-': return new SyntaxToken(SyntaxKind.MinusToken, this.#position++, '-', null);
            case '*': return new SyntaxToken(SyntaxKind.StarToken, this.#position++, '*', null);
            case '/': return new SyntaxToken(SyntaxKind.SlashToken, this.#position++, '/', null);
            case '(': return new SyntaxToken(SyntaxKind.OpenParenthesisToken, this.#position++, '(', null);
            case ')': return new SyntaxToken(SyntaxKind.CloseParenthesisToken, this.#position++, ')', null);
        };

        const start = this.#position;
        this.#next();
        const text = this.#text.slice(start, this.#position);

        this.#diagnostics.push(`Bad character input: '${text}'.`);
        return new SyntaxToken(SyntaxKind.BadToken, start, text, null);
    };
};