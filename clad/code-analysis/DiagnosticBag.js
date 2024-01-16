import { Diagnostic } from './Diagnostic.js';

export class DiagnosticBag {
    /** @type {import('./Diagnostic.js').Diagnostic[]} */
    #diagnostics = [];

    get diagnostics() {
        return this.#diagnostics;
    };

    /**
     * @param {DiagnosticBag} bag 
     */
    concat(bag) {
        return this.diagnostics.concat(bag.diagnostics);
    };

    /**
     * @param {DiagnosticBag} bag
     */
    addRange(bag) {
        this.#diagnostics = this.#diagnostics.concat(bag.diagnostics);
    };

    /**
     * @param {import('./TextSpan.js').TextSpan} span
     * @param {string} message
     */
    #report(span, message) {
        const diagnostic = new Diagnostic(span, message);
        this.#diagnostics.push(diagnostic);
    };

    /**
     * @param {import('./TextSpan.js').TextSpan} span
     * @param {string} text
     * @param {string} type
     */
    reportInvalidNumber(span, text, type) {
        const message = `The number ${text} isn't a valid <${type}>.`;
        this.#report(span, message);
    };

    /**
     * @param {import('./TextSpan.js').TextSpan} span
     * @param {string} character
     */
    reportBadCharacter(span, character) {
        const message = `Bad character input: '${character}'.`;
        this.#report(span, message);
    };

    /**
     * @param {import('./TextSpan.js').TextSpan} span
     * @param {string} actualKind
     * @param {string} expectedKind
     */
    reportUnexpectedToken(span, actualKind, expectedKind) {
        const message = `Unexpected token <${actualKind}>, expected <${expectedKind}>.`;
        this.#report(span, message);
    };

    /**
     * @param {import('./TextSpan.js').TextSpan} span
     * @param {string} operatorText
     * @param {string} operandType
     */
    reportUndefinedUnaryOperator(span, operatorText, operandType) {
        const message = `Unary operator '${operatorText}' is not defined for type <${operandType}>.`;
        this.#report(span, message);
    };

    /**
     * @param {import('./TextSpan.js').TextSpan} span
     * @param {string} operatorText
     * @param {string} leftType
     * @param {string} rightType
     */
    reportUndefinedBinaryOperator(span, operatorText, leftType, rightType) {
        const message = `Binary operator '${operatorText}' is not defined for types <${leftType}> and <${rightType}>.`;
        this.#report(span, message);
    };

    /**
     * @param {import('./TextSpan.js').TextSpan} span
     * @param {string} name
     */
    reportUndefinedName(span, name) {
        const message = `Variable '${name}' doesn't exist.`;
        this.#report(span, message);
    };
};