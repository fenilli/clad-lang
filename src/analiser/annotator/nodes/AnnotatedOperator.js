import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents an annotated operator in the syntax tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedOperator extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedOperator.
     *
     * @param {AnnotatedKind} kind - The annotated operator kind.
     * @param {string} type - The result type of the operation.
     */
    constructor(kind, type) {
        super(kind, type);
    };
};