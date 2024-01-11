import {
    SyntaxKind,
    SyntaxNode,
    SyntaxToken,
} from '../factory/index.js';

/**
 * Represents a assignment expression in the syntax tree.
 *
 * @extends {SyntaxNode}
 */
export class AssignmentExpression extends SyntaxNode {
    /**
     * Creates an instance of AssignmentExpression.
     * 
     * @param {SyntaxToken} identifier - The left identifier token.
     * @param {SyntaxToken} operator - The operator syntax token.
     * @param {SyntaxNode} expression - The right expression node.
     */
    constructor(identifier, operator, expression) {
        super(SyntaxKind.AssignmentExpression, identifier.location);

        this.identifier = identifier;
        this.operator = operator;
        this.expression = expression;
    };

    getChildren() { return [this.identifier, this.operator, this.expression] };
};