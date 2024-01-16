import { Binder } from './binding/index.js';
import { EvaluationResult } from './EvaluationResult.js';
import { Evaluator } from './Evaluator.js';

export class Compilation {
    #syntax;

    /**
     * @param {import('./syntax/index.js').SyntaxTree} syntax
     */
    constructor(syntax) {
        this.#syntax = syntax;
    };

    evaluate() {
        const binder = new Binder();
        const boundExpression = binder.bindExpression(this.#syntax.root);

        const diagnostics = this.#syntax.diagnostics.concat(binder.diagnostics);

        if (diagnostics.length > 0) return new EvaluationResult(diagnostics, null);

        const evaluator = new Evaluator(boundExpression);
        const value = evaluator.evaluate();

        return new EvaluationResult(diagnostics, value);
    };
};