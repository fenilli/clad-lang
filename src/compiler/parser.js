import {
    SyntaxKind,
    SyntaxToken,
} from "./syntax/index.js";
import { SourceFile } from "./syntax/ast/SourceFile.js";
import { Scanner } from "./scanner.js";

/**
 * Represents a Parser class for parsing tokens and generating a syntax tree.
 */
export class Parser {
    /**
     * Array to store diagnostic messages.
     * 
     * @type {string[]}
     */
    #diagnostics = [];

    /**
     * Array to store scanned tokens.
     * 
     * @type {SyntaxToken[]}
     */
    #tokens = [];

    /**
     * Cursor position for token consumption.
     * 
     * @type {number}
     */
    #cursor = 0;

    /**
     * Constructs an instance of the Parser class.
     * 
     * @param {string} input - The input string to be parsed.
     */
    constructor(input) {
        const scanner = new Scanner(input);

        const tokens = [];
        let token;
        do {
            token = scanner.next();
            if (token.kind !== SyntaxKind.WhitespaceToken && token.kind !== SyntaxKind.UnexpectedToken) tokens.push(token);
        } while (token.kind !== SyntaxKind.EndOfFileToken);

        this.#tokens = tokens;
        this.#diagnostics = scanner.getDiagnostics();
    };

    /**
     * Retrieves the diagnostics generated during parsing and scanning.
     * 
     * @returns {string[]} An array of diagnostic messages.
     */
    getDiagnostics() { return this.#diagnostics };

    /**
     * Gets the current token.
     * 
     * @type {SyntaxToken}
     */
    get #current() {
        return this.#tokens[this.#cursor];
    };

    /**
     * Consumes the current token if it matches the expected kind; otherwise, adds a diagnostic message.
     * 
     * @param {SyntaxKind} kind - The expected token kind.
     * 
     * @returns {SyntaxToken} The consumed token.
     */
    #consume(kind) {
        if (this.#current.kind === kind) return this.#tokens[this.#cursor++];

        this.#diagnostics.push(`SyntaxError: unexpected token <${this.#current.kind}>, expected <${kind}>`);
        return new SyntaxToken(kind, this.#current.pos);
    };

    /**
     * Parses the input tokens and generates a SourceFile.
     * 
     * @returns {SourceFile} The parsed source file syntax tree.
     */
    parse() {
        const eof = this.#consume(SyntaxKind.EndOfFileToken);

        return new SourceFile(eof);
    };
};