import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents an annotated numeric literal in the syntax tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedNumericLiteral extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedNumericLiteral.
     *
     * @param {any} value - The boolean literal.
     */
    constructor(value) {
        super(AnnotatedKind.NumericLiteral, typeof value);

        this.value = value;
    };
};