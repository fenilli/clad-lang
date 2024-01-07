import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents a expression in the annotated tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedPrefixExpression extends AnnotatedNode {
    /**
     * Creates an instance AnnotatedPrefixExpression.
     * 
     * @param {AnnotatedKind} operator - The annotated operator kind.
     * @param {AnnotatedNode} operand - The annotated operand node.
     */
    constructor(operator, operand) {
        super(AnnotatedKind.PrefixExpression, operand.type);

        this.operator = operator;
        this.operand = operand;
    };
};