import { SyntaxKind } from "./index.js";

/**
 * Represents a syntax facts of the language, like operator precedence.
 */
export class SyntaxFacts {
    /**
     * Gets the prefix precedence level
     * 
     * @param {SyntaxKind} kind - The expected token kind.
     */
    static getPrefixOperatorPrecedence(kind) {
        switch (kind) {
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
                return 3;

            default: return 0;
        };
    };

    /**
     * Gets the infix precedence level
     * 
     * @param {SyntaxKind} kind - The expected token kind.
     */
    static getInfixOperatorPrecedence(kind) {
        switch (kind) {
            case SyntaxKind.AsteriskToken:
            case SyntaxKind.SlashToken:
                return 2;

            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
                return 1;

            default: return 0;
        };
    };
};