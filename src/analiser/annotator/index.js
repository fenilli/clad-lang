import {
    InfixExpression,
    NumericLiteral,
    ParenthesizedExpression,
    PrefixExpression,
    SourceFile,
} from '../syntax/nodes/index.js';
import {
    SyntaxKind,
    SyntaxNode,
} from '../syntax/factory/index.js';
import {
    AnnotatedInfixExpression,
    AnnotatedNumericLiteral,
    AnnotatedParenthesizedExpression,
    AnnotatedPrefixExpression,
    AnnotatedSourceFile,
} from './nodes/index.js';
import { AnnotatedKind } from './factory/AnnotatedKind.js';
import { AnnotatedNode } from './factory/AnnotatedNode.js';

/**
 * Represents am Annotator class for annotating the types to a annotated syntax tree.
 */
export class Annotator {
    /**
     * Array to store diagnostic messages.
     * 
     * @type {string[]}
     */
    #diagnostics = [];

    /**
     * Annotates the AST.
     *
     * @param {SyntaxNode} node
     */
    annotate(node) {
        if (node instanceof InfixExpression) return this.#annotatedInfixExpression(node);
        if (node instanceof NumericLiteral) return this.#annotatedNumericLiteral(node);
        if (node instanceof ParenthesizedExpression) return this.#annotatedParenthesizedExpression(node);
        if (node instanceof PrefixExpression) return this.#annotatedPrefixExpression(node);
        if (node instanceof SourceFile) return this.#annotatedSourceFile(node);

        throw new Error(`Unexpected node <${node.kind}>`);
    };

    /**
     * Retrieves the diagnostics generated during parsing and scanning.
     * 
     * @returns {string[]} An array of diagnostic messages.
     */
    getDiagnostics() { return this.#diagnostics };

    /**
     * Annotates a infix expression.
     *
     * @param {InfixExpression} node
     */
    #annotatedInfixExpression(node) {
        /** @type {AnnotatedNode} */
        const left = this.annotate(node.left);
        let operator;
        switch (node.operator.kind) {
            case SyntaxKind.PlusToken: {
                operator = AnnotatedKind.Addition;
                break;
            };
            case SyntaxKind.MinusToken: {
                operator = AnnotatedKind.Subtraction;
                break;
            };
            case SyntaxKind.AsteriskToken: {
                operator = AnnotatedKind.Multiplication;
                break;
            };
            case SyntaxKind.SlashToken: {
                operator = AnnotatedKind.Division;
                break;
            };
            default: throw new Error(`Unexpected infix operator <${node.operator.kind}>.`);
        };
        /** @type {AnnotatedNode} */
        const right = this.annotate(node.right);

        if (left.type !== 'number' || right.type !== 'number') {
            this.#diagnostics.push(`Infix operator <${node.operator.kind}> is not defined for types <${left.kind}> and <${right.kind}>.`);
            return left;
        };

        return new AnnotatedInfixExpression(left, operator, right);
    };

    /**
     * Annotates a numeric literal.
     *
     * @param {NumericLiteral} node
     */
    #annotatedNumericLiteral(node) {
        const value = node.number.value || 0;

        return new AnnotatedNumericLiteral(value);
    };

    /**
     * Annotates a parenthesized expression.
     *
     * @param {ParenthesizedExpression} node
     */
    #annotatedParenthesizedExpression(node) {
        const expression = this.annotate(node.expression);

        return new AnnotatedParenthesizedExpression(expression);
    };

    /**
     * Annotates a prefix expression.
     *
     * @param {PrefixExpression} node
     */
    #annotatedPrefixExpression(node) {
        let operator;
        switch (node.operator.kind) {
            case SyntaxKind.PlusToken: {
                operator = AnnotatedKind.Identity;
                break;
            };
            case SyntaxKind.MinusToken: {
                operator = AnnotatedKind.Negation;
                break;
            };
            default: throw new Error(`Unexpected prefix operator <${node.operator.kind}>.`);
        };
        /** @type {AnnotatedNode} */
        const operand = this.annotate(node.operand);

        if (operand.type !== 'number') {
            this.#diagnostics.push(`Prefix operator <${node.operator.kind}> is not defined for type <${operand.kind}>.`);
            return operand;
        };

        return new AnnotatedPrefixExpression(operator, operand);
    };

    /**
     * Annotates a source file.
     *
     * @param {SourceFile} node
     */
    #annotatedSourceFile(node) {
        const body = this.annotate(node.body);

        return new AnnotatedSourceFile(body);
    };
};