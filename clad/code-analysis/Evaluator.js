import {
    BoundUnaryOperatorKind,
    BoundBinaryOperatorKind,
    BoundUnaryExpression,
    BoundBinaryExpression,
    BoundAssignmentExpression,
    BoundNameExpression,
    BoundLiteralExpression,
} from './binding/index.js';

export class Evaluator {
    #variables;
    #root;

    /**
     * @param {import('./binding/index.js').BoundExpression} root
     * @param {Record<string, any>} variables
     */
    constructor(root, variables) {
        this.#root = root;
        this.#variables = variables;
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

            switch (node.operator.kind) {
                case BoundUnaryOperatorKind.Identity: return operand;
                case BoundUnaryOperatorKind.Negation: return -operand;
                case BoundUnaryOperatorKind.LogicalNegation: return !operand;
                default: throw new Error(`Unexpected unary operator <${node.operator.kind}>`);
            };
        };

        if (node instanceof BoundBinaryExpression) {
            const left = this.#evaluateExpression(node.left);
            const right = this.#evaluateExpression(node.right);

            switch (node.operator.kind) {
                case BoundBinaryOperatorKind.Addition: return left + right;
                case BoundBinaryOperatorKind.Subtraction: return left - right;
                case BoundBinaryOperatorKind.Multiplication: return left * right;
                case BoundBinaryOperatorKind.Division: return left / right;
                case BoundBinaryOperatorKind.LogicalAnd: return left && right;
                case BoundBinaryOperatorKind.LogicalOr: return left || right;
                case BoundBinaryOperatorKind.Equals: return left === right;
                case BoundBinaryOperatorKind.NotEquals: return left !== right;
                default: throw new Error(`Unexpected binary operator <${node.operator.kind}>`);
            };
        };

        if (node instanceof BoundAssignmentExpression) {
            const value = this.#evaluateExpression(node.expression);
            console.log(node.name);
            this.#variables[node.name] = value;

            return value;
        };

        if (node instanceof BoundNameExpression)
            return this.#variables[node.name];

        if (node instanceof BoundLiteralExpression)
            return node.value;

        throw new Error(`Unexpected node <${node.kind}>`);
    };
};