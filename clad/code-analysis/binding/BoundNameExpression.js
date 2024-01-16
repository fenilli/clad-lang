import { BoundNodeKind, BoundExpression } from './index.js';

export class BoundNameExpression extends BoundExpression {
    variable;

    /**
     * @param {import('../VariableSymbol.js').VariableSymbol} variable
     */
    constructor(variable) {
        super(BoundNodeKind.NameExpression, variable.type);

        this.variable = variable;
    };
};