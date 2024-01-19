export class BoundScope {
    #parent;

    /** @type {Map<string, import('../VariableSymbol.js').VariableSymbol>} */
    #variables = new Map();

    /**
     * @param {BoundScope | null} parent
     */
    constructor(parent) {
        this.#parent = parent;
    };

    /**
     * @param {import('../VariableSymbol.js').VariableSymbol} variable
     * 
     * @returns {boolean}
     */
    tryDeclare(variable) {
        if (this.#variables.get(variable.name)) return false;

        this.#variables.set(variable.name, variable);
        return true;
    };

    /**
     * @param {string} name
     * 
     * @returns {import('../VariableSymbol.js').VariableSymbol | null}
     */
    tryLookup(name) {
        const variable = this.#variables.get(name);

        if (variable) return variable;

        return this.#parent === null ? null : this.#parent.tryLookup(name);
    };

    /**
     * @returns {import('../VariableSymbol.js').VariableSymbol[]}
     */
    getDeclaredVariables() {
        return Array.from(this.#variables.values());
    };
};