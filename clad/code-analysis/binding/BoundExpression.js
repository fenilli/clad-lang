import { BoundNode } from './index.js';

export class BoundExpression extends BoundNode {
    type;

    /**
     * @param {import('./index.js').BoundNodeKind} kind
     * @param {string} type
     */
    constructor(kind, type) {
        super(kind);

        this.type = type;
    };
};