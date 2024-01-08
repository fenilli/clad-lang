import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents an annotated identifier expression in the syntax tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedIdentifierExpression extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedIdentifierExpression.
     *
     * @param {string} identifier - The identifier name.
     * @param {string} type - The type of the identifier.
     */
    constructor(identifier, type) {
        super(AnnotatedKind.IdentifierExpression, type);

        this.identifier = identifier;
    };
};