import { DiagnosticBag } from '../DiagnosticBag.js';
import { VariableSymbol } from '../VariableSymbol.js';
import { BoundGlobalScope } from './BoundGlobalScope.js';
import { BoundScope } from './BoundScope.js';
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
    #scope;

    /** @type {DiagnosticBag} */
    #diagnostics = new DiagnosticBag();

    /**
     * @param {BoundScope | null} parent
     */
    constructor(parent) {
        this.#scope = new BoundScope(parent);
    };

    /**
     * @param {BoundGlobalScope | null} previous
     */
    static createParentScopes(previous) {
        const stack = [];

        while (previous !== null) {
            stack.push(previous);
            previous = previous.previous;
        };

        /** @type {BoundScope | null} */
        let parent = null;
        while (stack.length > 0) {
            const global = stack.pop();
            const scope = new BoundScope(parent);

            for (const variable of global?.variables || []) {
                scope.tryDeclare(variable);
            };

            parent = scope;
        };

        return parent;
    };

    /**
     * @param {BoundGlobalScope | null} previous
     * @param {import('../syntax/index.js').CompilationUnitSyntax} syntax
     */
    static bindGlobalScope(previous, syntax) {
        const parentScope = Binder.createParentScopes(previous);
        const binder = new Binder(parentScope);
        const expression = binder.bindExpression(syntax.expression);
        const variables = binder.#scope.getDeclaredVariables();
        const diagnostics = binder.#diagnostics;

        return new BoundGlobalScope(previous, diagnostics, variables, expression);
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
        let variable = this.#scope.tryLookup(name);

        if (!variable) {
            variable = new VariableSymbol(name, boundExpression.type);;
            this.#scope.tryDeclare(variable);
        };

        if (boundExpression.type !== variable.type) {
            this.#diagnostics.reportCannotConvert(syntax.identifierToken.span, boundExpression.type, variable.type);
            return boundExpression;
        }

        return new BoundAssignmentExpression(variable, boundExpression);
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
        const variable = this.#scope.tryLookup(name);

        if (variable === null) {
            this.#diagnostics.reportUndefinedName(syntax.identifierToken.span, name);
            return new BoundLiteralExpression(0);
        };

        return new BoundNameExpression(variable);
    };

    /**
     * @param {import('../syntax/index.js').LiteralExpressionSyntax} syntax
     */
    #bindLiteralExpression(syntax) {
        const value = syntax.value ?? 0;

        return new BoundLiteralExpression(value);
    };
};