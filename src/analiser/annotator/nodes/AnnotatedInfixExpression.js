import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

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
     * @param {AnnotatedKind} operator - The operator annotated token.
     * @param {AnnotatedNode} right - The right annotated expression node.
     */
    constructor(left, operator, right) {
        super(AnnotatedKind.InfixExpression, left.type);

        this.left = left;
        this.operator = operator;
        this.right = right;
    };
};