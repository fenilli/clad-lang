import { TextSpan } from "./text/TextSpan.js";

export class Diagnostic {
    span;
    message;

    /**
     * @param {TextSpan} span
     * @param {string} message
     */
    constructor(span, message) {
        this.span = span;
        this.message = message;
    };
};