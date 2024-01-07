import {
    InfixExpression,
    NumericLiteral,
    ParenthesizedExpression,
    PrefixExpression,
    SourceFile,
} from './analiser/syntax/nodes/index.js';
import {
    SyntaxKind,
    SyntaxNode,
} from './analiser/syntax/factory/index.js';

/**
 * Evaluator class responsible for evaluating syntax tree nodes.
 */
export class Evaluator {
    /**
     * Evaluates a syntax tree node.
     *
     * @param {SyntaxNode} node - The syntax tree node to evaluate.
     * @returns {number} The result of the evaluation.
     * @throws {Error} Throws an error for unexpected node types or operators.
     */
    evaluate(node) {
        if (node instanceof PrefixExpression) {
            const operand = this.evaluate(node.operand);

            switch (node.operator.kind) {
                case SyntaxKind.PlusToken: return operand;
                case SyntaxKind.MinusToken: return -operand;
            };

            throw new Error(`Unexpected prefix operator <${node.operator.kind}>`);
        };
        if (node instanceof InfixExpression) {
            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            switch (node.operator.kind) {
                case SyntaxKind.PlusToken: return left + right;
                case SyntaxKind.MinusToken: return left - right;
                case SyntaxKind.AsteriskToken: return left * right;
                case SyntaxKind.SlashToken: return left / right;
            };

            throw new Error(`Unexpected infix operator <${node.operator.kind}>`);
        };
        if (node instanceof NumericLiteral) return node.number.value;
        if (node instanceof ParenthesizedExpression) return this.evaluate(node.expression);
        if (node instanceof SourceFile) return this.evaluate(node.body);

        throw new Error(`Unexpected node <${node.kind}>`);
    };
};