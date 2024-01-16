import { SyntaxKind } from '../syntax/index.js';
import {
    BoundUnaryOperatorKind,
    BoundBinaryOperatorKind,
    BoundUnaryExpression,
    BoundBinaryExpression,
    BoundLiteralExpression,
} from './index.js';

export class Binder {
    /** @type {string[]} */
    #diagnostics = [];

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
            case SyntaxKind.LiteralExpression: return this.#bindLiteralExpression(/** @type {import('../syntax/index.js').LiteralExpressionSyntax} */(syntax));
            default: throw new Error(`Unexpected syntax <${syntax.kind}>`);
        };
    };

    /**
     * @param {import('../syntax/index.js').UnaryExpressionSyntax} syntax
     */
    #bindUnaryExpression(syntax) {
        const boundOperand = this.bindExpression(syntax.operand);
        const boundOperatorKind = this.#bindUnaryOperatorKind(syntax.operatorToken.kind, boundOperand.type);

        if (boundOperatorKind === null) {
            this.#diagnostics.push(`Unary operator '${syntax.operatorToken.text}' is not defined for type <${boundOperand.type}>.`);

            return boundOperand;
        };

        return new BoundUnaryExpression(boundOperatorKind, boundOperand);
    };

    /**
     * @param {import('../syntax/index.js').SyntaxKind} kind
     * @param {string} operandType
     * 
     * @returns {BoundUnaryOperatorKind | null}
     */
    #bindUnaryOperatorKind(kind, operandType) {
        if (operandType === 'number')
            switch (kind) {
                case SyntaxKind.PlusToken: return BoundUnaryOperatorKind.Identity;
                case SyntaxKind.MinusToken: return BoundUnaryOperatorKind.Negation;
            };

        if (operandType === 'boolean')
            switch (kind) {
                case SyntaxKind.BangToken: return BoundUnaryOperatorKind.LogicalNegation;
            };

        return null;
    };

    /**
     * @param {import('../syntax/index.js').BinaryExpressionSyntax} syntax
     */
    #bindBinaryExpression(syntax) {
        const boundLeft = this.bindExpression(syntax.left);
        const boundRight = this.bindExpression(syntax.right);
        const boundOperatorKind = this.#bindBinaryOperatorKind(syntax.operatorToken.kind, boundLeft.type, boundRight.type);

        if (boundOperatorKind === null) {
            this.#diagnostics.push(`Binary operator '${syntax.operatorToken.text}' is not defined for types <${boundLeft.type}> and <${boundRight.type}>.`);

            return boundLeft;
        };

        return new BoundBinaryExpression(boundLeft, boundOperatorKind, boundRight);
    };

    /**
     * @param {import('../syntax/index.js').SyntaxKind} kind
     * @param {string} leftType
     * @param {string} rightType
     * 
     * @returns {BoundBinaryOperatorKind | null}
     */
    #bindBinaryOperatorKind(kind, leftType, rightType) {
        if (leftType === 'number' && rightType === 'number')
            switch (kind) {
                case SyntaxKind.PlusToken: return BoundBinaryOperatorKind.Addition;
                case SyntaxKind.MinusToken: return BoundBinaryOperatorKind.Subtraction;
                case SyntaxKind.StarToken: return BoundBinaryOperatorKind.Multiplication;
                case SyntaxKind.SlashToken: return BoundBinaryOperatorKind.Division;
            };

        if (leftType === 'boolean' && rightType === 'boolean')
            switch (kind) {
                case SyntaxKind.AmpersandAmpersandToken: return BoundBinaryOperatorKind.LogicalAnd;
                case SyntaxKind.PipePipeToken: return BoundBinaryOperatorKind.LogicalOr;
            };

        return null
    };

    /**
     * @param {import('../syntax/index.js').LiteralExpressionSyntax} syntax
     */
    #bindLiteralExpression(syntax) {
        const value = syntax.value ?? 0;

        return new BoundLiteralExpression(value);
    };
};