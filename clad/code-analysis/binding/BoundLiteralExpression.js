import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundLiteralExpression extends BoundExpression {
    value;

    /**
     * @param {any} value
     */
    constructor(value) {
        super(BoundNodeKind.LiteralExpression, typeof value);

        this.value = value;
    };
};