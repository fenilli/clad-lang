import { DiagnosticBag } from '../DiagnosticBag.js';
import { TextSpan } from '../TextSpan.js';
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

    /** @type {DiagnosticBag} */
    #diagnostics = new DiagnosticBag();

    /**
     * @param {string} text
     */
    constructor(text) {
        this.#text = text;
    };

    get diagnostics() {
        return this.#diagnostics;
    };

    /**
     * @param {number} offset
     */
    #peek(offset) {
        const index = this.#position + offset;
        if (index >= this.#text.length) return '\0';

        return this.#text[index];
    };

    get #current() {
        return this.#peek(0);
    };

    get #lookahead() {
        return this.#peek(1);
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
                this.#diagnostics.reportInvalidNumber(new TextSpan(start, this.#position - start), text, 'number');
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
            case '&': {
                const start = this.#position;

                if (this.#lookahead === '&') {
                    this.#position += 2;
                    return new SyntaxToken(SyntaxKind.AmpersandAmpersandToken, start, '&&', null);
                };

                break;
            }
            case '|': {
                const start = this.#position;

                if (this.#lookahead === '|') {
                    this.#position += 2;
                    return new SyntaxToken(SyntaxKind.PipePipeToken, start, '||', null);
                };

                break;
            }
            case '=': {
                const start = this.#position;

                if (this.#lookahead === '=') {
                    this.#position += 2;
                    return new SyntaxToken(SyntaxKind.EqualsEqualsToken, start, '==', null);
                };

                return new SyntaxToken(SyntaxKind.EqualsToken, this.#position++, '=', null);
            }
            case '!': {
                const start = this.#position;

                if (this.#lookahead === '=') {
                    this.#position += 2;
                    return new SyntaxToken(SyntaxKind.BangEqualsToken, start, '!=', null);
                };

                return new SyntaxToken(SyntaxKind.BangToken, this.#position++, '!', null);
            }
        };

        const start = this.#position;
        this.#next();
        const text = this.#text.slice(start, this.#position);

        this.#diagnostics.reportBadCharacter(new TextSpan(start, 1), text);
        return new SyntaxToken(SyntaxKind.BadToken, start, text, null);
    };
};