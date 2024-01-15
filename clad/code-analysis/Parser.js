import {
    Lexer,
    SyntaxKind,
    SyntaxToken,
    SyntaxTree,
    BinaryExpressionSyntax,
    ParenthesizedExpressionSyntax,
    LiteralExpressionSyntax,
} from './index.js';

export class Parser {
    /** @type {import('./SyntaxToken.js').SyntaxToken[]} */
    #tokens = [];
    #position = 0;

    /** @type {string[]} */
    #diagnostics = [];

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

        this.#diagnostics.concat(lexer.diagnostics);
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

        this.#diagnostics.push(`Unexpected token <${this.#current.kind}>, expected <${kind}>.`);
        return new SyntaxToken(kind, this.#current.position, '', null);
    };

    get #current() {
        return this.#peek(0);
    };

    parse() {
        const expression = this.#parseExpression();
        const endOfFileToken = this.#matchToken(SyntaxKind.EndOfFileToken);

        return new SyntaxTree(this.#diagnostics, expression, endOfFileToken);
    };

    #parseExpression() {
        return this.#parseTerm();
    };

    #parseTerm() {
        let left = this.#parseFactor();

        while (this.#current.kind === SyntaxKind.PlusToken || this.#current.kind === SyntaxKind.MinusToken) {
            const operatorToken = this.#matchToken(this.#current.kind);
            const right = this.#parseFactor();
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        };

        return left;
    };

    #parseFactor() {
        let left = this.#parsePrimaryExpression();

        while (this.#current.kind === SyntaxKind.StarToken || this.#current.kind === SyntaxKind.SlashToken) {
            const operatorToken = this.#matchToken(this.#current.kind);
            const right = this.#parsePrimaryExpression();
            left = new BinaryExpressionSyntax(left, operatorToken, right);
        };

        return left;
    };

    /**
     * @returns {import('./index.js').ExpressionSyntax}
     */
    #parsePrimaryExpression() {
        if (this.#current.kind === SyntaxKind.OpenParenthesisToken) {
            const openParenthesisToken = this.#matchToken(SyntaxKind.OpenParenthesisToken);
            const expression = this.#parseExpression();
            const closeParenthesisToken = this.#matchToken(SyntaxKind.CloseParenthesisToken);

            return new ParenthesizedExpressionSyntax(openParenthesisToken, expression, closeParenthesisToken);
        };

        const numberToken = this.#matchToken(SyntaxKind.NumberToken);
        return new LiteralExpressionSyntax(numberToken);
    };
};