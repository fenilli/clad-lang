import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundBinaryExpression extends BoundExpression {
    left;
    operator;
    right;

    /**
     * @param {BoundExpression} left
     * @param {import('./index.js').BoundBinaryOperator} operator
     * @param {BoundExpression} right
     */
    constructor(left, operator, right) {
        super(BoundNodeKind.BinaryExpression, operator.resultType);

        this.left = left;
        this.operator = operator;
        this.right = right;
    };
};