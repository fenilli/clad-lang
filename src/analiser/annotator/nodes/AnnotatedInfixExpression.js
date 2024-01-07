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
export class AnnotatedInfixExpression extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedInfixExpression.
     * 
     * @param {AnnotatedNode} left - The left annotated expression node.
     * @param {AnnotatedOperator} operator - The annotated operator.
     * @param {AnnotatedNode} right - The right annotated expression node.
     */
    constructor(left, operator, right) {
        super(AnnotatedKind.InfixExpression, operator.type);

        this.left = left;
        this.operator = operator.kind;
        this.right = right;
    };
};