/**
 * The variable symbol for the annotated tree.
 */
export class IdentifierSymbol {
    /**
     * @type {string}
     */
    name;

    /**
     * @type {string}
     */
    type;

    /**
     * Creates an instance of IdentifierSymbol.
     * 
     * @param {string} name
     * @param {string} type
     */
    constructor(name, type) {
        this.name = name;
        this.type = type;
    };
};