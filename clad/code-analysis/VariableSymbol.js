export class VariableSymbol {
    name;
    type;

    /**
     * @param {string} name
     * @param {string} type
     */
    constructor(name, type) {
        this.name = name;
        this.type = type;
    };
};