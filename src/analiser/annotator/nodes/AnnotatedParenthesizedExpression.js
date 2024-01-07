import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents a expression in the annotated tree.
 *
 * @extends {AnnotatedNode}
 */
export class AnnotatedParenthesizedExpression extends AnnotatedNode {
    /**
     * Creates an instance of AnnotatedParenthesizedExpression.
     * 
     * @param {AnnotatedNode} expression - The annotated expression node.
     */
    constructor(expression) {
        super(AnnotatedKind.ParenthesizedExpression, expression.type);

        this.expression = expression;
    };
};