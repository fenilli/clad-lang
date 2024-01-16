import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundAssignmentExpression extends BoundExpression {
    name;
    expression;

    /**
     * @param {string} name
     * @param {BoundExpression} expression
     */
    constructor(name, expression) {
        super(BoundNodeKind.AssignmentExpression, expression.type);

        this.name = name;
        this.expression = expression;
    };
};