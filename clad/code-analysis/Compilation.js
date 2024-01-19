import { Binder } from './binding/index.js';
import { EvaluationResult } from './EvaluationResult.js';
import { Evaluator } from './Evaluator.js';

export class Compilation {
    #syntax;
    #previous;

    /** @type {import('./binding/BoundGlobalScope.js').BoundGlobalScope | null} */
    #globalScope = null;

    /**
     * @param {import('./syntax/index.js').SyntaxTree} syntax
     * @param {Compilation | null} previous
     */
    constructor(syntax, previous = null) {
        this.#syntax = syntax;
        this.#previous = previous;
    };

    /** @returns {import('./binding/BoundGlobalScope.js').BoundGlobalScope} */
    get globalScope() {
        if (this.#globalScope === null) this.#globalScope = Binder.bindGlobalScope(this.#previous ? this.#previous.#globalScope : null, this.#syntax.root);

        return this.#globalScope;
    };

    /**
     * @param {import('./syntax/index.js').SyntaxTree} syntax
     */
    continueWith(syntax) {
        return new Compilation(syntax, this);
    };

    /**
     * @param {Map<import('./VariableSymbol.js').VariableSymbol, any>} variables
     */
    evaluate(variables) {
        const diagnostics = this.#syntax.diagnostics.concat(this.globalScope.diagnostics);

        if (diagnostics.length > 0) return new EvaluationResult(diagnostics, null);

        const evaluator = new Evaluator(this.globalScope.expression, variables);
        const value = evaluator.evaluate();

        return new EvaluationResult(diagnostics, value);
    };
};