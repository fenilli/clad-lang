import {
    SyntaxKind,
    SyntaxNode,
    SyntaxToken,
} from '../factory/index.js';

/**
 * Represents a identifier expression in the syntax tree.
 *
 * @extends {SyntaxNode}
 */
export class IdentifierExpression extends SyntaxNode {
    /**
     * Creates an instance of IdentifierExpression.
     *
     * @param {SyntaxToken} identifier - The identifier syntax token.
     */
    constructor(identifier) {
        super(SyntaxKind.IdentifierExpression, identifier.location);

        this.identifier = identifier;
    };

    getChildren() { return [this.identifier] };
};