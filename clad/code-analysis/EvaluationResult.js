export class EvaluationResult {
    /** @type {import('./Diagnostic.js').Diagnostic[]} */
    #diagnostics = [];
    value;

    /**
     * @param {import('./Diagnostic.js').Diagnostic[]} diagnostics
     * @param {any} value
     */
    constructor(diagnostics, value) {
        this.#diagnostics = diagnostics;
        this.value = value;
    };

    get diagnostics() {
        return this.#diagnostics;
    };
};