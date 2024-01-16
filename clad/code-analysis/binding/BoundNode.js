export class BoundNode {
    kind;

    /**
     * @param {import('./index.js').BoundNodeKind} kind
     */
    constructor(kind) {
        this.kind = kind;
    };
};