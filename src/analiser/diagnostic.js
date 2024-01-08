import {
    SyntaxKind,
    SyntaxToken,
} from './syntax/factory/index.js';
import {
    AnnotatedNode,
} from './annotator/factory/index.js';

/**
 * Represents a diagnostic message with information about an issue in the source code.
 */
export class Diagnostic {
    /**
     * Creates an instance of Diagnostic.
     *
     * @param {string} message - The diagnostic message describing the issue.
     * @param {{ start: number, end: number }} span - The position in the source code where the issue is located.
     */
    constructor(message, span) {
        this.message = message;
        this.span = span;
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
     * @param {{ start: number, end: number }} end - The position in the source code where the issue is located.
     */
    #report(message, end) {
        this.#diagnostics.push(new Diagnostic(message, end));
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
     * @param {number} at - The position in the source code where the token is located.
     */
    reportInvalidToken(token, at) {
        const message = `Scanner: Invalid token found "${token}".`;
        const span = { start: at, end: at + token.length };
        this.#report(message, span);
    };

    /**
     * Adds a report on unexpected tokens.
     * 
     * @param {SyntaxToken} found - The invalid token.
     * @param {SyntaxKind} expected - The position in the source code where the token is located.
     */
    reportUnexpectedToken(found, expected) {
        const message = `Parser: Unexpected token found <${found.kind}>, expected <${expected}>`;
        const span = { start: found.pos, end: found.pos + (found.text?.length || 1) };
        this.#report(message, span);
    };

    /**
     * Adds a report on undefined prefix operator for operand.
     * 
     * @param {SyntaxToken} operator - The operator used in the prefix operation.
     * @param {AnnotatedNode} operand - The operand used in the prefix operation.
     */
    reportUndefinedPrefixOperator(operator, operand) {
        const message = `Prefix operator <${operator.text}> is not defined for type <${operand.type}>.`;
        const span = { start: operator.pos, end: operator.pos + (operator.text?.length || 1) };
        this.#report(message, span);
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
        const span = { start: operator.pos, end: operator.pos + (operator.text?.length || 1) };
        this.#report(message, span);
    };

    /**
     * Adds a report on undefined identifier for a expression.
     * 
     * @param {SyntaxToken} identifier - The identifier used in the expression.
     */
    reportUndefinedIdentifier(identifier) {
        const message = `Identifier <${identifier.text}> is not defined.`;
        const span = { start: identifier.pos, end: identifier.pos + (identifier.text?.length || 1) };
        this.#report(message, span);
    };
};