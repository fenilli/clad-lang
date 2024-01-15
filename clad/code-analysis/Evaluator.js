import {
    SyntaxKind,
    UnaryExpressionSyntax,
    BinaryExpressionSyntax,
    ParenthesizedExpressionSyntax,
    LiteralExpressionSyntax,
} from './syntax/index.js';

export class Evaluator {
    #root;

    /**
     * @param {import('./syntax/index.js').ExpressionSyntax} root
     */
    constructor(root) {
        this.#root = root;
    };

    evaluate() {
        return this.#evaluateExpression(this.#root);
    };

    /**
     * @param {import('./syntax/index.js').ExpressionSyntax} node
     */
    #evaluateExpression(node) {
        if (node instanceof UnaryExpressionSyntax) {
            const operand = this.#evaluateExpression(node.operand);

            if (node.operatorToken.kind === SyntaxKind.PlusToken)
                return operand;
            else if (node.operatorToken.kind === SyntaxKind.MinusToken)
                return -operand;
            else throw new Error(`Unexpected unary operator <${node.operatorToken.kind}>`);
        };

        if (node instanceof BinaryExpressionSyntax) {
            const left = this.#evaluateExpression(node.left);
            const right = this.#evaluateExpression(node.right);

            if (node.operatorToken.kind === SyntaxKind.PlusToken)
                return left + right;
            else if (node.operatorToken.kind === SyntaxKind.MinusToken)
                return left - right;
            else if (node.operatorToken.kind === SyntaxKind.StarToken)
                return left * right;
            else if (node.operatorToken.kind === SyntaxKind.SlashToken)
                return left / right;
            else throw new Error(`Unexpected binary operator <${node.operatorToken.kind}>`);
        };

        if (node instanceof ParenthesizedExpressionSyntax)
            return this.#evaluateExpression(node.expression);

        if (node instanceof LiteralExpressionSyntax)
            return node.literalToken.value;

        throw new Error(`Unexpected node <${node.kind}>`);
    };
};