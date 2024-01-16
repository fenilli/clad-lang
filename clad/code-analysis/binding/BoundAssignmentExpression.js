import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundAssignmentExpression extends BoundExpression {
    variable;
    expression;

    /**
     * @param {import('../VariableSymbol.js').VariableSymbol} variable
     * @param {BoundExpression} expression
     */
    constructor(variable, expression) {
        super(BoundNodeKind.AssignmentExpression, expression.type);

        this.variable = variable;
        this.expression = expression;
    };
};