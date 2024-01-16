import { DiagnosticBag } from '../DiagnosticBag.js';
import { SyntaxKind } from '../syntax/index.js';
import {
    BoundUnaryOperator,
    BoundBinaryOperator,
    BoundUnaryExpression,
    BoundBinaryExpression,
    BoundLiteralExpression,
} from './index.js';

export class Binder {
    /** @type {DiagnosticBag} */
    #diagnostics = new DiagnosticBag();

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
            case SyntaxKind.ParenthesizedExpression: return this.#bindParenthesizedExpression(/** @type {import('../syntax/index.js').ParenthesizedExpressionSyntax} */(syntax));
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
     * @param {import('../syntax/index.js').LiteralExpressionSyntax} syntax
     */
    #bindLiteralExpression(syntax) {
        const value = syntax.value ?? 0;

        return new BoundLiteralExpression(value);
    };
};