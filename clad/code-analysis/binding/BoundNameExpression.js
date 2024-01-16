import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundNameExpression extends BoundExpression {
    name;
    type;

    /**
     * @param {string} name
     * @param {string} type
     */
    constructor(name, type) {
        super(BoundNodeKind.NameExpression, type);

        this.name = name;
        this.type = type;
    };
};