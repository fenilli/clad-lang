import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents an annotated boolean literal in the syntax tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedBooleanLiteral extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedBooleanLiteral.
     *
     * @param {any} value - The number literal.
     */
    constructor(value) {
        super(AnnotatedKind.BooleanLiteral, typeof value);

        this.value = value;
    };
};