import { SyntaxFacts, SyntaxKind, SyntaxToken } from './factory/index.js';
import { DiagnosticBag } from '../diagnostic.js';

/**
 * Checks if the character is a possible identifier.
 * 
 * @param {string} char
 * @returns {boolean}
 */
const isIdentifier = (char) => {
    return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_';
};

/**
 * Checks if the character is a number.
 * 
 * @param {string} char
 * @returns {boolean}
 */
const isNumber = (char) => {
    switch (char) {
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
            return true;
        default: return false;
    };
};

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
     * Current location of the scanner.
    */
    #column = 1;
    #line = 1;

    /**
     * Creates a Scanner instance.
     * 
     * @param {string} input - The input string to be scanned.
     */
    constructor(input) {
        this.#input = input;
    };

    /**
     * Moves the cursor ahead one character.
     */
    #moveCursor() {
        this.#cursor++;
        this.#column++;
    };

    /**
     * Change the scanner state to the next line.
     */
    #nextLine() {
        this.#line++;
        this.#column = 1;
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
     * Reads and returns the kind of a single character token.
     * 
     * @param {string} char 
     * 
     * @return {SyntaxKind}
     */
    #getSingleCharacterTokenKind(char) {
        this.#moveCursor();

        switch (char) {
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
        this.#moveCursor();

        switch (char) {
            case '&': {
                if (this.#current === '&') {
                    this.#moveCursor();
                    return SyntaxKind.DoubleAmpersandToken;
                };
            };
            case '|': {
                if (this.#current === '|') {
                    this.#moveCursor();
                    return SyntaxKind.DoublePipeToken;
                };
            };
            case '=': {
                if (this.#current === '=') {
                    this.#moveCursor();
                    return SyntaxKind.DoubleEqualsToken;
                };

                return SyntaxKind.EqualsToken;
            };
            case '!': {
                if (this.#current === '=') {
                    this.#moveCursor();
                    return SyntaxKind.BangEqualsToken;
                };

                return SyntaxKind.BangToken;
            };
            default: return SyntaxKind.UnexpectedToken;
        }
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
            case '\0': {
                _kind = SyntaxKind.EndOfFileToken;

                break;
            };
            case '+': case '-': case '*': case '/': case '(': case ')': {
                _kind = this.#getSingleCharacterTokenKind(this.#current);

                break;
            };
            case '&': case '|': case '=': case '!': {
                _kind = this.#getDoubleCharacterTokenKind(this.#current);

                break;
            };
            case ' ': case '\t': case '\n': case '\r': {
                _kind = SyntaxKind.WhitespaceToken;

                while ([' ', '\t', '\n', '\r'].includes(this.#current)) {
                    switch (this.#current) {
                        case '\n': case '\r': {
                            this.#nextLine();
                        };
                    };
                    this.#moveCursor();
                };

                break;
            };
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                _kind = SyntaxKind.NumberToken;
                this.#moveCursor();

                while (isNumber(this.#current)) {
                    this.#moveCursor();
                };

                break;
            default: {
                if (isIdentifier(this.#current)) {
                    _kind = SyntaxKind.IdentifierToken;
                    this.#moveCursor();

                    while (isIdentifier(this.#current) || isNumber(this.#current)) {
                        this.#moveCursor();
                    };
                };

                break;
            };
        };

        const _text = this.#input.slice(_start, this.#cursor);
        const _location = { start: _start, end: this.#cursor, column: this.#column - _text.length, line: this.#line };

        if (_kind === SyntaxKind.IdentifierToken) {
            _kind = SyntaxFacts.isKeywordOrIdentifier(_text);
        };

        if (_kind === SyntaxKind.UnexpectedToken) {
            this.#diagnostics.reportInvalidToken(this.#current, _location);
            this.#moveCursor();
        };

        return new SyntaxToken(_kind, _location, _text, SyntaxFacts.getFormatter(_kind)(_text));
    };
};