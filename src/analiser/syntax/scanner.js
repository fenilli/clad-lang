import { SyntaxKind, SyntaxToken } from './factory/index.js';
import { DiagnosticBag } from '../diagnostic.js';

/**
 * Class representing a scanner for lexical analysis.
 */
export class Scanner {

    /**
     * Array to store diagnostic messages.
     * 
     * @type {DiagnosticBag}
     */
    #diagnostics = new DiagnosticBag();

    /**
     * The input string to be scanned.
     * 
     * @type {string}
     */
    #input;

    /**
     * Cursor position for input slicing.
     * 
     * @type {number}
     */
    #cursor = 0;

    /**
     * Creates a Scanner instance.
     * 
     * @param {string} input - The input string to be scanned.
     */
    constructor(input) {
        this.#input = input;
    };

    /**
     * Returns the current character at the current index
     * 
     * @returns {string}
     */
    get #current() {
        if (this.#cursor >= this.#input.length) return '\0';

        return this.#input[this.#cursor];
    };

    /**
     * Checks if the character is a letter.
     * 
     * @param {string} char
     * @returns {boolean}
     */
    #isLetter(char) {
        return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z';
    };

    /**
     * Checks if the character is a number.
     * 
     * @param {string} char
     * @returns {boolean}
     */
    #isNumber(char) {
        return !isNaN(parseFloat(char));
    };

    /**
     * Checks if the text is a keyword or identifier.
     * 
     * @param {string} text
     * 
     * @returns {SyntaxKind}
     */
    #isKeywordOrIdentifier(text) {
        switch (text) {
            case 'true': return SyntaxKind.TrueKeyword;
            case 'false': return SyntaxKind.FalseKeyword;
            default: return SyntaxKind.IdentifierToken;
        };
    };

    /**
     * Gets text from the input based on a start and end positions.
     * 
     * @param {number} start
     * @param {number} end
     * 
     * @returns {string}
     */
    #getText(start, end) {
        return this.#input.slice(start, end);
    };

    /**
     * Gets a transformed value from the kind and text.
     * 
     * @param {SyntaxKind} kind
     * @param {string} text
     * 
     * @returns {any}
     */
    #getValue(kind, text) {
        switch (kind) {
            case SyntaxKind.TrueKeyword: return true;
            case SyntaxKind.FalseKeyword: return false;
            case SyntaxKind.NumberToken: return Number(text);
        };
    };

    /**
     * Reads and returns the kind of a single character token.
     * 
     * @param {string} char 
     * 
     * @return {SyntaxKind}
     */
    #getSingleCharacterTokenKind(char) {
        this.#cursor++;

        switch (char) {
            case '\0': return SyntaxKind.EndOfFileToken;
            case '+': return SyntaxKind.PlusToken;
            case '-': return SyntaxKind.MinusToken;
            case '*': return SyntaxKind.AsteriskToken;
            case '/': return SyntaxKind.SlashToken;
            case '(': return SyntaxKind.OpenParenToken;
            case ')': return SyntaxKind.CloseParenToken;
            default: return SyntaxKind.UnexpectedToken;
        };
    };

    /**
     * Reads and returns the kind of a single or double character token.
     * 
     * @param {string} char 
     * 
     * @return {SyntaxKind}
     */
    #getDoubleCharacterTokenKind(char) {
        this.#cursor++;

        switch (char) {
            case '&': {
                if (this.#current === '&') {
                    this.#cursor++;
                    return SyntaxKind.DoubleAmpersandToken;
                };
            };
            case '|': {
                if (this.#current === '|') {
                    this.#cursor++;
                    return SyntaxKind.DoublePipeToken;
                };
            };
            case '=': {
                if (this.#current === '=') {
                    this.#cursor++;
                    return SyntaxKind.DoubleEqualsToken;
                };

                return SyntaxKind.EqualsToken;
            };
            case '!': {
                if (this.#current === '=') {
                    this.#cursor++;
                    return SyntaxKind.BangEqualsToken;
                };

                return SyntaxKind.BangToken;
            };
            default: return SyntaxKind.UnexpectedToken;
        }
    };

    /**
     * Reads whitespaces until its any other token.
     * 
     * @return {SyntaxKind}
     */
    #getWhitespaceTokenKind() {
        while ([' ', '\t', '\n', '\r'].includes(this.#current)) {
            this.#cursor++;
        };

        return SyntaxKind.WhitespaceToken;
    };

    /**
     * Reads numbers until its any other token.
     * 
     * @return {SyntaxKind}
     */
    #getNumberTokenKind() {
        while (this.#isNumber(this.#current)) {
            this.#cursor++;
        };

        return SyntaxKind.NumberToken;
    };

    /**
     * Reads identifier characters until its any other token.
     * 
     * @return {SyntaxKind}
     */
    #getIdentifierOrKeywordTokenKind() {
        const _start = this.#cursor;

        while (this.#isLetter(this.#current) || this.#isNumber(this.#current) || this.#current === '_') {
            this.#cursor++;
        };

        return this.#isKeywordOrIdentifier(this.#getText(_start, this.#cursor));
    };

    /**
     * Retrieves the diagnostics generated during scanning.
     * 
     * @returns {DiagnosticBag} An array of diagnostic messages.
     */
    getDiagnostics() { return this.#diagnostics };

    /**
     * Retrieves the next token from the input string.
     * 
     * @returns {SyntaxToken} The next token found in the input string.
     */
    next() {
        let _kind = SyntaxKind.UnexpectedToken;
        let _start = this.#cursor;

        switch (this.#current) {
            case '\0':
            case '+':
            case '-':
            case '*':
            case '/':
            case '(':
            case ')': {
                _kind = this.#getSingleCharacterTokenKind(this.#current);

                break;
            };
            case '&':
            case '|':
            case '=':
            case '!': {
                _kind = this.#getDoubleCharacterTokenKind(this.#current);

                break;
            };
            case ' ':
            case '\t':
            case '\n':
            case '\r': {
                _kind = this.#getWhitespaceTokenKind();

                break;
            };
            default: {
                if (this.#isNumber(this.#current)) {
                    _kind = this.#getNumberTokenKind();
                } else if (this.#isLetter(this.#current) || this.#current === '_') {
                    _kind = this.#getIdentifierOrKeywordTokenKind();
                } else {
                    this.#diagnostics.reportInvalidToken(this.#current, this.#cursor++)
                };

                break;
            };
        };

        const _text = this.#getText(_start, this.#cursor);
        const _value = this.#getValue(_kind, _text);
        return new SyntaxToken(_kind, _start, _text, _value);
    };
};