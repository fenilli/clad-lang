export class EvaluationResult {
    /** @type {string[]} */
    #diagnostics = [];
    value;

    /**
     * @param {string[]} diagnostics
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