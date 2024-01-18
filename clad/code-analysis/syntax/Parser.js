import { DiagnosticBag } from '../DiagnosticBag.js';
import {
    Lexer,
    SyntaxKind,
    SyntaxFacts,
    SyntaxToken,
    SyntaxTree,
    CompilationUnitSyntax,
    UnaryExpressionSyntax,
    BinaryExpressionSyntax,
    AssignmentExpressionSyntax,
    ParenthesizedExpressionSyntax,
    NameExpressionSyntax,
    LiteralExpressionSyntax,
} from './index.js';

export class Parser {
    /** @type {import('./SyntaxToken.js').SyntaxToken[]} */
    #tokens = [];
    #position = 0;

    /** @type {DiagnosticBag} */
    #diagnostics = new DiagnosticBag();

    /**
     * @param {string} text
     */
    constructor(text) {
        const lexer = new Lexer(text);

        let token;
        do {
            token = lexer.lex();

            if (token.kind !== SyntaxKind.WhitespaceToken && token.kind !== SyntaxKind.BadToken)
                this.#tokens.push(token);
        } while (token.kind !== SyntaxKind.EndOfFileToken);

        this.#diagnostics.addRange(lexer.diagnostics);
    };

    get diagnostics() {
        return this.#diagnostics;
    };

    /**
     * @param {number} offset
     */
    #peek(offset) {
        const index = this.#position + offset;
        if (index >= this.#tokens.length) return this.#tokens[this.#tokens.length - 1];

        return this.#tokens[index];
    };

    #nextToken() {
        const current = this.#current;
        this.#position++;
        return current;
    };

    /**
     * @param {SyntaxKind} kind
     */
    #matchToken(kind) {
        if (this.#current.kind === kind) return this.#nextToken();

        this.#diagnostics.reportUnexpectedToken(this.#current.span, this.#current.kind, kind);
        return new SyntaxToken(kind, '', null, this.#current.span);
    };

    get #current() {
        return this.#peek(0);
    };

    parseCompilationUnit() {
        const expression = this.#parseExpression();
        const endOfFileToken = this.#matchToken(SyntaxKind.EndOfFileToken);

        return new CompilationUnitSyntax(expression, endOfFileToken);
    };

    #parseExpression() {
        return this.#parseAssignmentExpression();
    };

    #parseAssignmentExpression() {
        if (this.#peek(0).kind === SyntaxKind.IdentifierToken && this.#peek(1).kind === SyntaxKind.EqualsToken) {
            const IdentifierToken = this.#matchToken(SyntaxKind.IdentifierToken);
            const operatorToken = this.#matchToken(SyntaxKind.EqualsToken);
            const expression = this.#parseAssignmentExpression();

            return new AssignmentExpressionSyntax(IdentifierToken, operatorToken, expression);
        };

        return this.#parseBinaryExpression();
    };

    #parseBinaryExpression(parentPrecedence = 0) {
        let left;
        const precedence = SyntaxFacts.getUnaryOperatorPrecedence(this.#current.kind);

        if (precedence !== 0 && precedence >= parentPrecedence) {
            const operatorToken = this.#matchToken(this.#current.kind);
            const operand = this.#parseBinaryExpression(precedence);

            left = new UnaryExpressionSyntax(operatorToken, operand);
        } else {
            left = this.#parsePrimaryExpression();
        };

        while (true) {
            const precedence = SyntaxFacts.getBinaryOperatorPrecedence(this.#current.kind);
            if (precedence === 0 || precedence <= parentPrecedence) break;

            const operatorToken = this.#matchToken(this.#current.kind);
            const right = this.#parseBinaryExpression(precedence);
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        };

        return left;
    };

    /**
     * @returns {import('./index.js').ExpressionSyntax}
     */
    #parsePrimaryExpression() {
        switch (this.#current.kind) {
            case SyntaxKind.OpenParenthesisToken: {
                const openParenthesisToken = this.#matchToken(SyntaxKind.OpenParenthesisToken);
                const expression = this.#parseExpression();
                const closeParenthesisToken = this.#matchToken(SyntaxKind.CloseParenthesisToken);

                return new ParenthesizedExpressionSyntax(openParenthesisToken, expression, closeParenthesisToken);
            }

            case SyntaxKind.FalseKeyword:
            case SyntaxKind.TrueKeyword: {
                const keywordToken = this.#matchToken(this.#current.kind);
                const value = keywordToken.kind === SyntaxKind.TrueKeyword;

                return new LiteralExpressionSyntax(keywordToken, value);
            }

            case SyntaxKind.IdentifierToken: {
                const identifierToken = this.#matchToken(SyntaxKind.IdentifierToken);

                return new NameExpressionSyntax(identifierToken);
            }

            default: {
                const numberToken = this.#matchToken(SyntaxKind.NumberToken);
                return new LiteralExpressionSyntax(numberToken);
            }
        };
    };
};