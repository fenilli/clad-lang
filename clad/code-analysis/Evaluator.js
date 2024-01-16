import {
    BoundUnaryOperatorKind,
    BoundBinaryOperatorKind,
    BoundUnaryExpression,
    BoundBinaryExpression,
    BoundLiteralExpression,
} from './binding/index.js';

export class Evaluator {
    #root;

    /**
     * @param {import('./binding/index.js').BoundExpression} root
     */
    constructor(root) {
        this.#root = root;
    };

    evaluate() {
        return this.#evaluateExpression(this.#root);
    };

    /**
     * @param {import('./binding/index.js').BoundExpression} node
     */
    #evaluateExpression(node) {
        if (node instanceof BoundUnaryExpression) {
            const operand = this.#evaluateExpression(node.operand);

            switch (node.operatorKind) {
                case BoundUnaryOperatorKind.Identity: return operand;
                case BoundUnaryOperatorKind.Negation: return -operand;
                default: throw new Error(`Unexpected unary operator <${node.operatorKind}>`);
            };
        };

        if (node instanceof BoundBinaryExpression) {
            const left = this.#evaluateExpression(node.left);
            const right = this.#evaluateExpression(node.right);

            switch (node.operatorKind) {
                case BoundBinaryOperatorKind.Addition: return left + right;
                case BoundBinaryOperatorKind.Subtraction: return left - right;
                case BoundBinaryOperatorKind.Multiplication: return left * right;
                case BoundBinaryOperatorKind.Division: return left / right;
                default: throw new Error(`Unexpected binary operator <${node.operatorKind}>`);
            };
        };

        if (node instanceof BoundLiteralExpression)
            return node.value;

        throw new Error(`Unexpected node <${node.kind}>`);
    };
};