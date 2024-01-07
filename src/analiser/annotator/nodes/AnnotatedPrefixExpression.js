import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';
import {
    AnnotatedOperator,
} from '../nodes/index.js';

/**
 * Represents a expression in the annotated tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedPrefixExpression extends AnnotatedNode {
    /**
     * Creates an instance AnnotatedPrefixExpression.
     * 
     * @param {AnnotatedOperator} operator - The annotated operator.
     * @param {AnnotatedNode} operand - The annotated operand node.
     */
    constructor(operator, operand) {
        super(AnnotatedKind.PrefixExpression, operator.type);

        this.operator = operator.kind;
        this.operand = operand;
    };
};