import {
    AssignmentExpression,
    BooleanLiteral,
    IdentifierExpression,
    InfixExpression,
    NumericLiteral,
    ParenthesizedExpression,
    PrefixExpression,
    SourceFile,
} from './nodes/index.js';
import {
    SyntaxFacts,
    SyntaxKind,
    SyntaxToken,
} from './factory/index.js';
import { Scanner } from "./scanner.js";
import { DiagnosticBag } from '../diagnostic.js';

/**
 * Represents a Parser class for parsing tokens and generating a syntax tree.
 */
export class Parser {
    /**
     * Array to store diagnostic messages.
     * 
     * @type {DiagnosticBag}
     */
    #diagnostics = new DiagnosticBag();

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
     * @returns {DiagnosticBag} - An array of diagnostic messages.
     */
    getDiagnostics() { return this.#diagnostics };

    /**
     * Gets the current token.
     * 
     * @type {SyntaxToken}
     */
    get #current() {
        return this.#peek(0);
    };

    /**
     * Peek at the offset token.
     * 
     * @param {number} offset - The number to peek ahead at the tokens.
     * 
     * @returns {SyntaxToken}
     */
    #peek(offset) {
        const i = this.#cursor + offset ?? 0;
        if (this.#cursor > this.#tokens.length) return this.#tokens[this.#tokens.length - 1];

        return this.#tokens[i];
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

        this.#diagnostics.reportUnexpectedToken(this.#current, kind);
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
     * Parses an expression.
     * 
     * @typedef {PrimaryExpression | InfixExpression | PrefixExpression} Expression
     * 
     * @returns {Expression} The parsed syntax node representing an expression.
     */
    #expression() {
        return this.#assignmentExpression();
    };

    /**
     * Parses an assignment expression.
     * 
     * @returns {Expression} The parsed syntax node representing an expression.
     */
    #assignmentExpression() {
        if (this.#peek(0).kind === SyntaxKind.IdentifierToken && this.#peek(1).kind === SyntaxKind.EqualsToken) {
            const identifier = this.#consume(SyntaxKind.IdentifierToken);
            const operator = this.#consume(SyntaxKind.EqualsToken);
            const expression = this.#assignmentExpression();

            return new AssignmentExpression(identifier, operator, expression);
        };

        return this.#operatorPrecedenceExpression();
    };

    /**
     * Parses an operator precedence expression, delegating to the primaryExpression rule.
     * 
     * @param {number} prevPrecedence - The previous called precedence level
     *
     * @returns {Expression} The parsed syntax node representing an expression.
     */
    #operatorPrecedenceExpression(prevPrecedence = 0) {
        let left;
        const prefixPrecedence = SyntaxFacts.getPrefixOperatorPrecedence(this.#current.kind);

        if (prefixPrecedence !== 0 && prefixPrecedence >= prevPrecedence) {
            const operator = this.#consume(this.#current.kind);
            const operand = this.#operatorPrecedenceExpression(prefixPrecedence);
            left = new PrefixExpression(operator, operand);
        } else {
            left = this.#primaryExpression();
        };

        while (true) {
            const precedence = SyntaxFacts.getInfixOperatorPrecedence(this.#current.kind);

            if (precedence === 0 || precedence <= prevPrecedence) break;

            const operator = this.#consume(this.#current.kind);
            const right = this.#operatorPrecedenceExpression(precedence);
            left = new InfixExpression(left, operator, right);
        };

        return left;
    };

    /**
     * Parses a primary expression based on the current token kind.
     * 
     * @typedef {NumericLiteral | BooleanLiteral | IdentifierExpression | ParenthesizedExpression} PrimaryExpression
     *
     * @returns {PrimaryExpression} The parsed syntax node representing a primary expression.
     */
    #primaryExpression() {
        switch (this.#current.kind) {
            case SyntaxKind.TrueKeyword:
            case SyntaxKind.FalseKeyword:
                return this.#booleanLiteral(this.#current.kind);
            case SyntaxKind.IdentifierToken:
                return this.#identifierExpression();
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
    * Creates a IdentifierExpression instance by consuming an IdentifierToken.
    *
    * @returns {IdentifierExpression} A NumericLiteral instance.
    */
    #identifierExpression() {
        return new IdentifierExpression(this.#consume(SyntaxKind.IdentifierToken));
    };

    /**
     * Creates a BooleanLiteral instance by consuming a TrueKeyword or FalseKeyword.
     * 
     * @param {SyntaxKind} kind - TrueKeyword or FalseKeyword
     *
     * @returns {BooleanLiteral} A NumericLiteral instance.
     */
    #booleanLiteral(kind) {
        return new BooleanLiteral(this.#consume(kind));
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