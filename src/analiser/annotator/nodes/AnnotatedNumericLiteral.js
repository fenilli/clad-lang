import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents a numeric literal in the syntax tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedNumericLiteral extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedNumericLiteral.
     *
     * @param {any} value - The number literal.
     */
    constructor(value) {
        super(AnnotatedKind.NumericLiteral, typeof value);

        this.value = value;
    };
};