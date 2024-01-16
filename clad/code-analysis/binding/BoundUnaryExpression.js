import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundUnaryExpression extends BoundExpression {
    operator;
    operand;

    /**
     * @param {import('./index.js').BoundUnaryOperator} operator
     * @param {BoundExpression} operand
     */
    constructor(operator, operand) {
        super(BoundNodeKind.UnaryExpression, operator.resultType);

        this.operator = operator;
        this.operand = operand;
    };
};