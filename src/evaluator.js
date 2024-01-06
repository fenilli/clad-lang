import {
    SyntaxKind,
    SyntaxNode,
} from './compiler/syntax/index.js';
import {
    InfixExpression,
    NumericLiteral,
    ParenthesizedExpression,
    SourceFile,
} from './compiler/syntax/ast/index.js';

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
        if (node instanceof InfixExpression) {
            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            switch (node.operator.kind) {
                case SyntaxKind.PlusToken: return left + right;
                case SyntaxKind.MinusToken: return left - right;
                case SyntaxKind.AsteriskToken: return left * right;
                case SyntaxKind.SlashToken: return left / right;
                default: throw new Error(`Unexpected infix operator <${node.operator.kind}>`);
            };
        };
        if (node instanceof NumericLiteral) return node.number.value;
        if (node instanceof ParenthesizedExpression) return this.evaluate(node.expression);
        if (node instanceof SourceFile) return this.evaluate(node.body);

        throw new Error(`Unexpected node <${node.kind}>`);
    };
};