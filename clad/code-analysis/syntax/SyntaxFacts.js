import { SyntaxKind } from './SyntaxKind.js';

export class SyntaxFacts {
    /**
     * @param {string} text
     * 
     * @returns {SyntaxKind}
     */
    static getKeywordKind(text) {
        switch (text) {
            case 'false': return SyntaxKind.FalseKeyword;
            case 'true': return SyntaxKind.TrueKeyword;
            default: return SyntaxKind.IdentifierToken;
        };
    };

    /**
     * @param {SyntaxKind} kind 
     */
    static getUnaryOperatorPrecedence(kind) {
        switch (kind) {
            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
                return 3;

            default: return 0;
        };
    };

    /**
     * @param {SyntaxKind} kind 
     */
    static getBinaryOperatorPrecedence(kind) {
        switch (kind) {
            case SyntaxKind.StarToken:
            case SyntaxKind.SlashToken:
                return 2;

            case SyntaxKind.PlusToken:
            case SyntaxKind.MinusToken:
                return 1;

            default: return 0;
        };
    };
};