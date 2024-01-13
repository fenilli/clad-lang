import { IdentifierSymbol } from '../../../IdentifierSymbol.js';
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
     * @param {IdentifierSymbol} identifier - The identifier name.
     */
    constructor(identifier) {
        super(AnnotatedKind.IdentifierExpression, identifier.type);

        this.identifier = identifier;
    };
};