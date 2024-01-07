import { SyntaxKind, SyntaxToken } from './factory/index.js';

/**
 * Class representing a scanner for lexical analysis.
 */
export class Scanner {
    /**
     * Represents a specification array containing tuples describing the syntax for various tokens.
     * Each tuple includes the SyntaxKind, corresponding regular expression, and an optional transformation function.
     * @type {[SyntaxKind, RegExp, ((val: string) => any)?][]}
     */
    #spec = [
        [SyntaxKind.WhitespaceToken, /^\s+/],

        // Keywords:
        [SyntaxKind.FalseKeyword, /^false/, () => false],
        [SyntaxKind.TrueKeyword, /^true/, () => true],

        // Symbols:
        [SyntaxKind.PlusToken, /^\+/],
        [SyntaxKind.MinusToken, /^\-/],
        [SyntaxKind.AsteriskToken, /^\*/],
        [SyntaxKind.SlashToken, /^\//],
        [SyntaxKind.BangToken, /^\!/],
        [SyntaxKind.DoubleAmpersandToken, /^\&\&/],
        [SyntaxKind.DoublePipeToken, /^\|\|/],
        [SyntaxKind.OpenParenToken, /^\(/],
        [SyntaxKind.CloseParenToken, /^\)/],

        // Literals:
        [SyntaxKind.NumberToken, /^\d+/, Number],
    ];

    /**
     * Array to store diagnostic messages.
     * 
     * @type {string[]}
     */
    #diagnostics = [];

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
     * Retrieves the diagnostics generated during scanning.
     * 
     * @returns {string[]} An array of diagnostic messages.
     */
    getDiagnostics() { return this.#diagnostics };

    /**
     * Retrieves the next token from the input string.
     * 
     * @returns {SyntaxToken} The next token found in the input string.
     */
    next() {
        if (this.#cursor === this.#input.length) return new SyntaxToken(SyntaxKind.EndOfFileToken, this.#cursor, '\0');

        const slice = this.#input.slice(this.#cursor);
        for (const [kind, regexp, formatter] of this.#spec) {
            const found = regexp.exec(slice)?.[0];
            if (typeof found !== 'string') continue;

            const start = this.#cursor;
            this.#cursor += found.length;

            return new SyntaxToken(kind, start, found, formatter?.(found));
        };

        this.#diagnostics.push(`ScannerError: unexpected token found "${slice.slice(0, 1)}"`);
        return new SyntaxToken(SyntaxKind.UnexpectedToken, this.#cursor++, slice.slice(0, 1));
    };
};