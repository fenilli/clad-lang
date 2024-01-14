import { IdentifierSymbol } from '../../../IdentifierSymbol.js';

/**
 * Represents an annotated scope in a tree structure.
 */
export class AnnotatedScope {
    /**
     * The variables of the current scope.
     * 
     * @type {Map<string, IdentifierSymbol>}
     */
    #variables = new Map();

    /**
     * The parent of this scope.
     * 
     * @type {AnnotatedScope | null}
     */
    #parent;

    /**
     * Creates a AnnotatedScope.
     * 
     * @param {AnnotatedScope | null} parent - The parent to associate with this scope.
     */
    constructor(parent = null) {
        this.#parent = parent;
    };

    /**
     * Declares the variable to this scope.
     * 
     * @param {IdentifierSymbol} variable
     * 
     * @returns {boolean}
     */
    declare(variable) {
        if (this.#variables.get(variable.name)) return false;

        this.#variables.set(variable.name, variable);
        return true;
    };

    /**
     * Looks for the variable in the current scope, or its parent.
     * 
     * @param {string} name
     * 
     * @returns {IdentifierSymbol | false}
     */
    lookup(name) {
        const variable = this.#variables.get(name);
        if (variable) return variable;

        if (this.#parent === null) return false;

        return this.#parent.lookup(name);
    };

    /**
     * Returns the variables of the scope.
     * 
     * @return {IdentifierSymbol[]}
     */
    getDeclaredVariables() {
        return Array.from(this.#variables.values());
    };
};