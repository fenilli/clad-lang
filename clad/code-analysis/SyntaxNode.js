export class SyntaxNode {
    kind;

    /**
     * @param {import('./index.js').SyntaxKind} kind
     */
    constructor(kind) {
        this.kind = kind;
    };

    /**
     * @returns {SyntaxNode[]}
     */
    getChildren() {
        return [];
    };
};