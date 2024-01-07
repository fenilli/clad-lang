import {
    SyntaxKind,
    SyntaxNode,
    SyntaxToken,
} from '../index.js';

/**
 * Represents a prefix expression in the syntax tree.
 *
 * @extends {SyntaxNode}
 */
export class PrefixExpression extends SyntaxNode {
    /**
     * Creates an instance of PrefixExpression.
     *
     * @param {SyntaxToken} operator - The operator syntax token.
     * @param {SyntaxNode} operand - The operand expression node.
     */
    constructor(operator, operand) {
        super(SyntaxKind.PrefixExpression, operator.pos);

        this.operator = operator;
        this.operand = operand;
    };

    getChildren() { return [this.operator, this.operand] };
};