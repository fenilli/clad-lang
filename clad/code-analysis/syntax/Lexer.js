import { DiagnosticBag } from '../DiagnosticBag.js';
import { TextSpan } from '../text/TextSpan.js';
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
    #line = 1;
    #column = 0;

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

    /**
     * @param {number} amount 
     */
    #stepBy(amount) {
        const before = this.#position;

        this.#position += amount;
        this.#column += amount;

        return before;
    };

    #next() {
        return this.#stepBy(1);
    };

    /**
     * @param {number} start
     */
    #generateTextSpan(start) {
        return new TextSpan(start, this.#position, this.#line, this.#column);
    };

    /**
     * @returns {SyntaxToken}
     */
    lex() {
        const start = this.#position;

        if (this.#position >= this.#text.length) return new SyntaxToken(SyntaxKind.EndOfFileToken, '\0', null, this.#generateTextSpan(start));

        if (isNumber(this.#current)) {
            while (isNumber(this.#current)) this.#next();

            const text = this.#text.slice(start, this.#position);
            const value = parseInt(text);

            if (!value) {
                this.#diagnostics.reportInvalidNumber(this.#generateTextSpan(start), text, 'number');
            };

            return new SyntaxToken(SyntaxKind.NumberToken, text, value, this.#generateTextSpan(start));
        };

        if (isWhitespace(this.#current)) {
            while (isWhitespace(this.#current)) {
                switch (this.#current) {
                    case '\n': case '\r': {
                        this.#line++;
                        this.#column = 0;

                        break;
                    }
                };

                this.#next();
            };

            const text = this.#text.slice(start, this.#position);

            return new SyntaxToken(SyntaxKind.WhitespaceToken, text, null, this.#generateTextSpan(start));
        };

        if (isLetter(this.#current)) {
            while (isLetter(this.#current)) this.#next();

            const text = this.#text.slice(start, this.#position);
            const kind = SyntaxFacts.getKeywordKind(text);
            return new SyntaxToken(kind, text, null, this.#generateTextSpan(start));
        };

        switch (this.#current) {
            case '+': return new SyntaxToken(SyntaxKind.PlusToken, '+', null, this.#generateTextSpan(this.#next()));
            case '-': return new SyntaxToken(SyntaxKind.MinusToken, '-', null, this.#generateTextSpan(this.#next()));
            case '*': return new SyntaxToken(SyntaxKind.StarToken, '*', null, this.#generateTextSpan(this.#next()));
            case '/': return new SyntaxToken(SyntaxKind.SlashToken, '/', null, this.#generateTextSpan(this.#next()));
            case '(': return new SyntaxToken(SyntaxKind.OpenParenthesisToken, '(', null, this.#generateTextSpan(this.#next()));
            case ')': return new SyntaxToken(SyntaxKind.CloseParenthesisToken, ')', null, this.#generateTextSpan(this.#next()));
            case '&': {
                if (this.#lookahead === '&') {
                    this.#stepBy(2);
                    return new SyntaxToken(SyntaxKind.AmpersandAmpersandToken, '&&', null, this.#generateTextSpan(start));
                };

                break;
            }
            case '|': {
                if (this.#lookahead === '|') {
                    this.#stepBy(2);
                    return new SyntaxToken(SyntaxKind.PipePipeToken, '||', null, this.#generateTextSpan(start));
                };

                break;
            }
            case '=': {
                if (this.#lookahead === '=') {
                    this.#stepBy(2);
                    return new SyntaxToken(SyntaxKind.EqualsEqualsToken, '==', null, this.#generateTextSpan(start));
                };

                return new SyntaxToken(SyntaxKind.EqualsToken, '=', null, this.#generateTextSpan(this.#next()));
            }
            case '!': {
                if (this.#lookahead === '=') {
                    this.#stepBy(2);
                    return new SyntaxToken(SyntaxKind.BangEqualsToken, '!=', null, this.#generateTextSpan(start));
                };

                return new SyntaxToken(SyntaxKind.BangToken, '!', null, this.#generateTextSpan(this.#next()));
            }
        };

        this.#next();
        const text = this.#text.slice(start, this.#position);

        this.#diagnostics.reportBadCharacter(this.#generateTextSpan(start), text);
        return new SyntaxToken(SyntaxKind.BadToken, text, null, this.#generateTextSpan(start));
    };
};