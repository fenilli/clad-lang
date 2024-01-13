import { IdentifierSymbol } from '../../../IdentifierSymbol.js';
import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents an annotated assignment expression in the syntax tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedAssignmentExpression extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedAssignmentExpression.
     * 
     * @param {IdentifierSymbol} identifier - The identifier name.
     * @param {AnnotatedNode} expression - The expression node to be assigned.
     */
    constructor(identifier, expression) {
        super(AnnotatedKind.AssignmentExpression, expression.type);

        this.identifier = identifier;
        this.expression = expression;
    };
};