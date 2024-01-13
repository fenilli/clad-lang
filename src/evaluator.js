import {
    AnnotatedAssignmentExpression,
    AnnotatedBooleanLiteral,
    AnnotatedIdentifierExpression,
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
import { IdentifierSymbol } from './IdentifierSymbol.js';

/**
 * Evaluator class responsible for evaluating syntax tree nodes.
 */
export class Evaluator {
    /**
     * @type {Map<IdentifierSymbol, any>}
     */
    #environment;

    /**
     * @param {Map<IdentifierSymbol, any>} environment 
     */
    constructor(environment) {
        this.#environment = environment;
    };

    /**
     * Evaluates a syntax tree node.
     *
     * @param {AnnotatedNode} node - The syntax tree node to evaluate.
     * 
     * @returns {*} The result of the evaluation.
     * 
     * @throws {Error} Throws an error for unexpected node types or operators.
     */
    evaluate(node) {
        if (node instanceof AnnotatedAssignmentExpression) {
            const expression = this.evaluate(node.expression);
            this.#environment.set(node.identifier, expression);
            return expression;
        };
        if (node instanceof AnnotatedBooleanLiteral) return node.value;
        if (node instanceof AnnotatedIdentifierExpression) return this.#environment.get(node.identifier);
        if (node instanceof AnnotatedInfixExpression) {
            const left = this.evaluate(node.left);
            const right = this.evaluate(node.right);

            switch (node.operator) {
                case AnnotatedKind.Addition: return left + right;
                case AnnotatedKind.Subtraction: return left - right;
                case AnnotatedKind.Multiplication: return left * right;
                case AnnotatedKind.Division: return left / right;
                case AnnotatedKind.LogicalAnd: return left && right;
                case AnnotatedKind.LogicalOr: return left || right;
                case AnnotatedKind.Equals: return left === right;
                case AnnotatedKind.NotEquals: return left !== right;
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
                case AnnotatedKind.LogicalNegation: return !operand;
                default: throw new Error(`Unexpected prefix operator <${node.operator}>`);
            };
        };
        if (node instanceof AnnotatedSourceFile) return this.evaluate(node.body);

        throw new Error(`Unexpected node <${node.kind}>`);
    };
};