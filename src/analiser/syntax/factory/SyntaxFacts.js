import { SyntaxKind } from "./index.js";

/**
 * Represents a syntax facts of the language, like operator precedence.
 */
export class SyntaxFacts {
    /**
     * Gets the formatter from the specified kind
     * 
     * @param {SyntaxKind} kind - The expected token kind.
     * 
     * @returns {(text: string) => any}
     */
    static getFormatter(kind) {
        switch (kind) {
            case SyntaxKind.TrueKeyword: return () => true;
            case SyntaxKind.FalseKeyword: return () => false;
            case SyntaxKind.NumberToken: return (text) => Number(text);
            default: return (text) => text;
        };
    };

    /**
     * Checks if the text is a keyword or identifier.
     * 
     * @param {string} text
     * 
     * @returns {SyntaxKind}
     */
    static isKeywordOrIdentifier(text) {
        switch (text) {
            case 'true': return SyntaxKind.TrueKeyword;
            case 'false': return SyntaxKind.FalseKeyword;
            default: return SyntaxKind.IdentifierToken;
        };
    };

    /**
     * Gets the prefix precedence level
     * 
     * @param {SyntaxKind} kind - The expected token kind.
     */
    static getPrefixOperatorPrecedence(kind) {
        switch (kind) {
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
            case SyntaxKind.BangToken:
                return 6;

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
                return 5;

            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
                return 4;

            case SyntaxKind.DoubleEqualsToken:
            case SyntaxKind.BangEqualsToken:
                return 3;

            case SyntaxKind.DoubleAmpersandToken:
                return 2;

            case SyntaxKind.DoublePipeToken:
                return 1;

            default: return 0;
        };
    };
};