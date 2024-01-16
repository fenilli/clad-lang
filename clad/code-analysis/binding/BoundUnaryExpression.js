import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundUnaryExpression extends BoundExpression {
    operatorKind;
    operand;

    /**
     * @param {import('./index.js').BoundUnaryOperatorKind} operatorKind
     * @param {BoundExpression} operand
     */
    constructor(operatorKind, operand) {
        super(BoundNodeKind.UnaryExpression, operand.type);

        this.operatorKind = operatorKind;
        this.operand = operand;
    };
};