import {
    SyntaxKind,
    SyntaxToken,
} from './syntax/factory/index.js';
import {
    AnnotatedNode,
} from './annotator/factory/index.js';
import { IdentifierSymbol } from '../IdentifierSymbol.js';

/**
 * Represents a diagnostic message with information about an issue in the source code.
 */
export class Diagnostic {
    /**
     * Creates an instance of Diagnostic.
     *
     * @param {string} message - The diagnostic message describing the issue.
     * @param {{ start: number, end: number, line: number, column: number }} location - The position in the source code where the issue is located.
     */
    constructor(message, location) {
        this.message = message;
        this.location = location;
    };
};

export class DiagnosticBag {
    /**
     * @type {Diagnostic[]}
     */
    #diagnostics = [];

    /**
     * Creates an instance of DiagnosticBag.
     * 
     * @param {Diagnostic[]} bag
     */
    constructor(bag = []) {
        this.#diagnostics = bag;
    };

    /**
     * Adds a Diagnostic to the DiagnosticBag
     * 
     * @param {string} message - The diagnostic message describing the issue.
     * @param {{ start: number, end: number, line: number, column: number }} location - The position in the source code where the issue is located.
     */
    #report(message, location) {
        this.#diagnostics.push(new Diagnostic(message, location));
    };

    /**
     * Returns the diagnostics array.
     * 
     * @returns {Diagnostic[]}
     */
    toArray() {
        return this.#diagnostics;
    };

    /**
     * Returns two concatenated DiagnosticBags.
     * 
     * @param {DiagnosticBag} bag
     * 
     * @returns {DiagnosticBag}
     */
    concat(bag) {
        return new DiagnosticBag(this.#diagnostics.concat(bag.toArray()));
    };

    /**
     * Adds a report on invalid scanned tokens.
     * 
     * @param {string} token - The invalid token.
     * @param {{ start: number, end: number, line: number, column: number }} location - The location in the source code where the token is located.
     */
    reportInvalidToken(token, location) {
        const message = `Scanner: Invalid token found "${token}".`;
        this.#report(message, location);
    };

    /**
     * Adds a report on unexpected tokens.
     * 
     * @param {SyntaxToken} found - The invalid token.
     * @param {SyntaxKind} expected - The position in the source code where the token is located.
     */
    reportUnexpectedToken(found, expected) {
        const message = `Parser: Unexpected token found <${found.kind}>, expected <${expected}>`;
        this.#report(message, found.location);
    };

    /**
     * Adds a report on undefined prefix operator for operand.
     * 
     * @param {SyntaxToken} operator - The operator used in the prefix operation.
     * @param {AnnotatedNode} operand - The operand used in the prefix operation.
     */
    reportUndefinedPrefixOperator(operator, operand) {
        const message = `Prefix operator <${operator.text}> is not defined for type <${operand.type}>.`;
        this.#report(message, operator.location);
    };

    /**
     * Adds a report on undefined infix operator for left and right operands.
     * 
     * @param {SyntaxToken} operator - The operator used in the infix operation.
     * @param {AnnotatedNode} left - The left operand used in the infix operation.
     * @param {AnnotatedNode} right - The right operand used in the infix operation.
     */
    reportUndefinedInfixOperator(operator, left, right) {
        const message = `Infix operator <${operator.text}> is not defined for types <${left.type}> and <${right.type}>.`;
        this.#report(message, operator.location);
    };

    /**
     * Adds a report on undefined identifier for a expression.
     * 
     * @param {SyntaxToken} identifier - The identifier used in the expression.
     */
    reportUndefinedIdentifier(identifier) {
        const message = `Identifier <${identifier.text}> is not defined.`;
        this.#report(message, identifier.location);
    };

    /**
     * Adds a report on an already defined identifier for a expression.
     * 
     * @param {SyntaxToken} node - The node identifier used in the expression.
     * @param {AnnotatedNode} expression - The identifier used in the expression.
     * @param {IdentifierSymbol} identifier - The identifier symbol used in the expression.
     */
    reportCannotConvertType(node, expression, identifier) {
        const message = `Cannot convert <${node.text}> from type <${expression.type}> to type ${identifier.type}.`;
        this.#report(message, node.location);
    };
};