import {
    AssignmentExpression,
    BooleanLiteral,
    IdentifierExpression,
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
    AnnotatedAssignmentExpression,
    AnnotatedBooleanLiteral,
    AnnotatedIdentifierExpression,
    AnnotatedInfixExpression,
    AnnotatedNumericLiteral,
    AnnotatedOperator,
    AnnotatedParenthesizedExpression,
    AnnotatedPrefixExpression,
    AnnotatedSourceFile,
} from './nodes/index.js';
import {
    AnnotatedGlobalScope,
    AnnotatedKind,
    AnnotatedNode,
    AnnotatedScope
} from './factory/index.js';
import { DiagnosticBag } from '../diagnostic.js';
import { IdentifierSymbol } from '../../IdentifierSymbol.js';

/**
 * Represents am Annotator class for annotating the types to a annotated syntax tree.
 */
export class Annotator {
    /**
     * Array to store diagnostic messages.
     * 
     * @type {DiagnosticBag}
     */
    #diagnostics = new DiagnosticBag();

    /**
     * @type {AnnotatedScope}
     */
    #scope;

    /**
     * @param {AnnotatedScope | null} parent
     */
    constructor(parent) {
        this.#scope = new AnnotatedScope(parent);
    };

    /**
     * Creates an instance of AnnotatedGlobalScope with the source.
     * 
     * @param {AnnotatedGlobalScope | null} previous
     * @param {SourceFile} source
    */
    static annotateGlobalScope(previous, source) {
        const parent = this.createParentScope(previous);
        const annotator = new Annotator(parent);
        const annotatedSource = annotator.annotate(source);
        const diagnostics = annotator.getDiagnostics();
        const variables = annotator.#scope.getDeclaredVariables();

        return new AnnotatedGlobalScope(previous, diagnostics, variables, annotatedSource);
    };

    /**
     * @param {AnnotatedGlobalScope | null} previous
     */
    static createParentScope(previous) {
        /** @type {(AnnotatedGlobalScope | null)[]} */
        const stack = [];

        while (previous !== null) {
            stack.push(previous);
            previous = previous.previous;
        };

        /** @type {AnnotatedScope | null} */
        let parent = null;
        while (stack.length > 0) {
            const global = stack.pop();
            const scope = new AnnotatedScope(parent);

            for (const v of global?.variables || []) {
                scope.declare(v);
            };
            parent = scope;
        };

        return parent;
    };

    /**
     * Annotates the AST.
     *
     * @param {SyntaxNode} node
     */
    annotate(node) {
        if (node instanceof AssignmentExpression) return this.#annotatedAssignmentExpression(node);
        if (node instanceof BooleanLiteral) return this.#annotatedBooleanLiteral(node);
        if (node instanceof IdentifierExpression) return this.#annotatedIdentifierExpression(node);
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
     * @returns {DiagnosticBag} An array of diagnostic messages.
     */
    getDiagnostics() { return this.#diagnostics };

    /**
     * Annotates a assignment expression.
     *
     * @param {AssignmentExpression} node
     */
    #annotatedAssignmentExpression(node) {
        const identifierName = node.identifier.text || '';

        /** @type {AnnotatedNode} */
        const expression = this.annotate(node.expression);

        let identifier = this.#scope.lookup(identifierName);
        if (!identifier) {
            identifier = new IdentifierSymbol(identifierName, expression.type)
            this.#scope.declare(identifier);
        };

        if (expression.type !== identifier.type) {
            this.#diagnostics.reportCannotConvertType(node.identifier, expression, identifier);
            return expression;
        };

        return new AnnotatedAssignmentExpression(identifier, expression);
    };

    /**
     * Annotates a numeric literal.
     *
     * @param {BooleanLiteral} node
     */
    #annotatedBooleanLiteral(node) {
        return new AnnotatedBooleanLiteral(node.bool.value);
    };

    /**
     * Annotates a identifier expression.
     *
     * @param {IdentifierExpression} node
     */
    #annotatedIdentifierExpression(node) {
        const identifierName = node.identifier.text || '';

        const variable = this.#scope.lookup(identifierName);
        if (!variable) {
            this.#diagnostics.reportUndefinedIdentifier(node.identifier);
            return new AnnotatedNumericLiteral(0);
        };

        return new AnnotatedIdentifierExpression(variable);
    };

    /**
     * Annotates a infix expression.
     *
     * @param {InfixExpression} node
     */
    #annotatedInfixExpression(node) {
        /** @type {AnnotatedNode} */
        const left = this.annotate(node.left);
        /** @type {AnnotatedNode} */
        const right = this.annotate(node.right);

        let operator;
        if (left.type === 'number' && right.type === 'number') {
            switch (node.operator.kind) {
                case SyntaxKind.PlusToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.Addition, 'number');
                    break;
                };
                case SyntaxKind.MinusToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.Subtraction, 'number');
                    break;
                };
                case SyntaxKind.AsteriskToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.Multiplication, 'number');
                    break;
                };
                case SyntaxKind.SlashToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.Division, 'number');
                    break;
                };
            };
        };

        if (left.type === 'boolean' && right.type === 'boolean') {
            switch (node.operator.kind) {
                case SyntaxKind.DoubleAmpersandToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.LogicalAnd, 'boolean');
                    break;
                };
                case SyntaxKind.DoublePipeToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.LogicalOr, 'boolean');
                    break;
                };
            };
        };

        if ((left.type === 'boolean' || left.type === 'number') && (right.type === 'boolean' || right.type === 'number')) {
            switch (node.operator.kind) {
                case SyntaxKind.BangEqualsToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.NotEquals, 'boolean');
                    break;
                };
                case SyntaxKind.DoubleEqualsToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.Equals, 'boolean');
                    break;
                };
            };
        };

        if (typeof operator === 'undefined') {
            this.#diagnostics.reportUndefinedInfixOperator(node.operator, left, right);
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
        return new AnnotatedNumericLiteral(node.number.value || 0);
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
        /** @type {AnnotatedNode} */
        const operand = this.annotate(node.operand);

        let operator;
        if (operand.type === 'number') {
            switch (node.operator.kind) {
                case SyntaxKind.PlusToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.Identity, 'number');
                    break;
                };
                case SyntaxKind.MinusToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.Negation, 'number');
                    break;
                };
            };
        };

        if (operand.type === 'boolean') {
            switch (node.operator.kind) {
                case SyntaxKind.BangToken: {
                    operator = new AnnotatedOperator(AnnotatedKind.LogicalNegation, 'boolean');
                    break;
                };
            };
        };

        if (typeof operator === 'undefined') {
            this.#diagnostics.reportUndefinedPrefixOperator(node.operator, operand);
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