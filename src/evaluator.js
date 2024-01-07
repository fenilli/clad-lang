import {
    AnnotatedInfixExpression,
    AnnotatedNumericLiteral,
    AnnotatedParenthesizedExpression,
    AnnotatedPrefixExpression,
    AnnotatedSourceFile,
} from './analiser/annotator/nodes/index.js';
import {
    AnnotatedKind,
    AnnotatedNode,
} from './analiser/annotator/factory/index.js';

/**
 * Evaluator class responsible for evaluating syntax tree nodes.
 */
export class Evaluator {
    /**
     * Evaluates a syntax tree node.
     *
     * @param {AnnotatedNode} node - The syntax tree node to evaluate.
     * @returns {number} The result of the evaluation.
     * @throws {Error} Throws an error for unexpected node types or operators.
     */
    evaluate(node) {
        if (node instanceof AnnotatedInfixExpression) {
            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            switch (node.operator) {
                case AnnotatedKind.Addition: return left + right;
                case AnnotatedKind.Subtraction: return left - right;
                case AnnotatedKind.Multiplication: return left * right;
                case AnnotatedKind.Division: return left / right;
                default: throw new Error(`Unexpected infix operator <${node.operator}>`);
            };
        };
        if (node instanceof AnnotatedNumericLiteral) return node.value;
        if (node instanceof AnnotatedParenthesizedExpression) return this.evaluate(node.expression);
        if (node instanceof AnnotatedPrefixExpression) {
            const operand = this.evaluate(node.operand);

            switch (node.operator) {
                case AnnotatedKind.Identity: return operand;
                case AnnotatedKind.Negation: return -operand;
                default: throw new Error(`Unexpected prefix operator <${node.operator}>`);
            };
        };
        if (node instanceof AnnotatedSourceFile) return this.evaluate(node.body);

        throw new Error(`Unexpected node <${node.kind}>`);
    };
};