import { AnnotatedKind } from './index.js';

/**
 * Represents an annotated node in a tree structure.
 */
export class AnnotatedNode {
    /**
     * Creates a AnnotatedNode.
     * 
     * @param {AnnotatedKind} kind - The kind of the annotated node.
     * @param {string} type - The instrisic type of the node.
     */
    constructor(kind, type) {
        this.kind = kind;
        this.type = type;
    };
};