import { DiagnosticBag } from '../DiagnosticBag.js';
import { SyntaxKind } from '../syntax/index.js';
import {
    BoundUnaryOperator,
    BoundBinaryOperator,
    BoundUnaryExpression,
    BoundLiteralExpression,
    BoundAssignmentExpression,
    BoundNameExpression,
    BoundBinaryExpression,
} from './index.js';

export class Binder {
    #variables;

    /** @type {DiagnosticBag} */
    #diagnostics = new DiagnosticBag();

    /**
     * @param {Record<string, any>} variables
     */
    constructor(variables) {
        this.#variables = variables;
    };

    get diagnostics() {
        return this.#diagnostics;
    };

    /**
     * 
     * @param {import('../syntax/index.js').ExpressionSyntax} syntax
     * 
     * @return {import('./index.js').BoundExpression}
     */
    bindExpression(syntax) {
        switch (syntax.kind) {
            case SyntaxKind.UnaryExpression: return this.#bindUnaryExpression(/** @type {import('../syntax/index.js').UnaryExpressionSyntax} */(syntax));
            case SyntaxKind.BinaryExpression: return this.#bindBinaryExpression(/** @type {import('../syntax/index.js').BinaryExpressionSyntax} */(syntax));
            case SyntaxKind.AssignmentExpression: return this.#bindAssignmentExpression(/** @type {import('../syntax/index.js').AssignmentExpressionSyntax} */(syntax));
            case SyntaxKind.ParenthesizedExpression: return this.#bindParenthesizedExpression(/** @type {import('../syntax/index.js').ParenthesizedExpressionSyntax} */(syntax));
            case SyntaxKind.NameExpression: return this.#bindNameExpression(/** @type {import('../syntax/index.js').NameExpressionSyntax} */(syntax));
            case SyntaxKind.LiteralExpression: return this.#bindLiteralExpression(/** @type {import('../syntax/index.js').LiteralExpressionSyntax} */(syntax));
            default: throw new Error(`Unexpected syntax <${syntax.kind}>`);
        };
    };

    /**
     * @param {import('../syntax/index.js').UnaryExpressionSyntax} syntax
     */
    #bindUnaryExpression(syntax) {
        const boundOperand = this.bindExpression(syntax.operand);
        const boundOperator = BoundUnaryOperator.bind(syntax.operatorToken.kind, boundOperand.type);

        if (boundOperator === null) {
            this.#diagnostics.reportUndefinedUnaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundOperand.type);
            return boundOperand;
        };

        return new BoundUnaryExpression(boundOperator, boundOperand);
    };

    /**
     * @param {import('../syntax/index.js').AssignmentExpressionSyntax} syntax
     */
    #bindAssignmentExpression(syntax) {
        const name = syntax.identifierToken.text;
        const boundExpression = this.bindExpression(syntax.expression);

        return new BoundAssignmentExpression(name, boundExpression);
    };

    /**
     * @param {import('../syntax/index.js').BinaryExpressionSyntax} syntax
     */
    #bindBinaryExpression(syntax) {
        const boundLeft = this.bindExpression(syntax.left);
        const boundRight = this.bindExpression(syntax.right);
        const boundOperator = BoundBinaryOperator.bind(syntax.operatorToken.kind, boundLeft.type, boundRight.type);

        if (boundOperator === null) {
            this.#diagnostics.reportUndefinedBinaryOperator(syntax.operatorToken.span, syntax.operatorToken.text, boundLeft.type, boundRight.type);
            return boundLeft;
        };

        return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
    };

    /**
     * @param {import('../syntax/index.js').ParenthesizedExpressionSyntax} syntax
     */
    #bindParenthesizedExpression(syntax) {
        return this.bindExpression(syntax.expression);
    };

    /**
     * @param {import('../syntax/index.js').NameExpressionSyntax} syntax
     */
    #bindNameExpression(syntax) {
        const name = syntax.identifierToken.text;
        const variable = this.#variables[name];

        if (typeof variable === 'undefined') {
            this.#diagnostics.reportUndefinedName(syntax.identifierToken.span, name);
            return new BoundLiteralExpression(0);
        };

        const type = typeof variable;
        return new BoundNameExpression(name, type);
    };

    /**
     * @param {import('../syntax/index.js').LiteralExpressionSyntax} syntax
     */
    #bindLiteralExpression(syntax) {
        const value = syntax.value ?? 0;

        return new BoundLiteralExpression(value);
    };
};