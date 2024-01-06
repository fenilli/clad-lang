import {
    SyntaxFacts,
    SyntaxKind,
    SyntaxToken,
} from "./syntax/index.js";
import {
    InfixExpression,
    NumericLiteral,
    ParenthesizedExpression,
    SourceFile,
} from "./syntax/ast/index.js";
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
     * Parses the source file.
     *
     * @returns {SourceFile} The root node of the parsed syntax tree.
     */
    parse() {
        return this.#sourceFile();
    };

    /**
     * Parses the input tokens and generates a SourceFile.
     * 
     * @returns {SourceFile} The parsed source file syntax tree.
     */
    #sourceFile() {
        const body = this.#expression();
        this.#consume(SyntaxKind.EndOfFileToken);

        return new SourceFile(body);
    };

    /**
     * Parses an expression, delegating to the primaryExpression rule.
     * 
     * @typedef {PrimaryExpression | InfixExpression} Expression
     * 
     * @param {number} prevPrecedence - The previous called precedence level
     *
     * @returns {Expression} The parsed syntax node representing an expression.
     */
    #expression(prevPrecedence = 0) {
        /** @type {Expression} */
        let left = this.#primaryExpression();

        while (true) {
            const precedence = SyntaxFacts.getInfixOperatorPrecedence(this.#current.kind);

            if (precedence === 0 || precedence <= prevPrecedence) break;

            const operator = this.#consume(this.#current.kind);
            const right = this.#expression(precedence);
            left = new InfixExpression(left, operator, right);
        };

        return left;
    };

    /**
     * Parses a primary expression based on the current token kind.
     * 
     * @typedef {NumericLiteral | ParenthesizedExpression} PrimaryExpression
     *
     * @returns {PrimaryExpression} The parsed syntax node representing a primary expression.
     */
    #primaryExpression() {
        switch (this.#current.kind) {
            case SyntaxKind.OpenParenToken: return this.#parenthesizedExpression();
            default: return this.#numericLiteral();
        };
    };

    /**
     * Parses a parenthesized expression, including the opening and closing parentheses.
     *
     * @returns {ParenthesizedExpression} The parsed syntax node representing a parenthesized expression.
     */
    #parenthesizedExpression() {
        this.#consume(SyntaxKind.OpenParenToken);
        const expression = this.#expression();
        this.#consume(SyntaxKind.CloseParenToken);

        return new ParenthesizedExpression(expression);
    };

    /**
     * Creates a NumericLiteral instance by consuming a NumberToken.
     *
     * @returns {NumericLiteral} A NumericLiteral instance.
     */
    #numericLiteral() {
        return new NumericLiteral(this.#consume(SyntaxKind.NumberToken));
    };
};