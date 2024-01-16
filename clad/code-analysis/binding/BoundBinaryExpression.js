import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundBinaryExpression extends BoundExpression {
    left;
    operatorKind;
    right;

    /**
     * @param {BoundExpression} left
     * @param {import('./index.js').BoundBinaryOperatorKind} operatorKind
     * @param {BoundExpression} right
     */
    constructor(left, operatorKind, right) {
        super(BoundNodeKind.BinaryExpression, left.type);

        this.left = left;
        this.operatorKind = operatorKind;
        this.right = right;
    };
};