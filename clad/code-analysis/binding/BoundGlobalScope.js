export class BoundGlobalScope {
    previous;
    diagnostics;
    variables;
    expression;

    /**
     * @param {BoundGlobalScope | null} previous
     * @param {import('../DiagnosticBag.js').DiagnosticBag} diagnostics
     * @param {import('../VariableSymbol.js').VariableSymbol[]} variables
     * @param {import('./index.js').BoundExpression} expression
     */
    constructor(previous, diagnostics, variables, expression) {
        this.previous = previous;
        this.diagnostics = diagnostics;
        this.variables = variables;
        this.expression = expression;
    };
};