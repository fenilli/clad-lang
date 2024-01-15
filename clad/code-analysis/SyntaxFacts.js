import { SyntaxKind } from './SyntaxKind.js';

export class SyntaxFacts {
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