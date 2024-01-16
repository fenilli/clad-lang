import { SyntaxKind } from '../syntax/index.js';
import { BoundBinaryOperatorKind } from './index.js';

export class BoundBinaryOperator {
    syntaxKind;
    kind;
    leftType;
    rightType;
    resultType;

    /**
     * @param {SyntaxKind} syntaxKind
     * @param {BoundBinaryOperatorKind} kind
     * @param {string} leftType
     * @param {string} [rightType]
     * @param {string} [resultType]
     */
    constructor(syntaxKind, kind, leftType, rightType, resultType) {
        this.syntaxKind = syntaxKind;
        this.kind = kind;
        this.leftType = leftType;
        this.rightType = typeof rightType !== 'undefined' ? rightType : leftType;
        this.resultType = typeof resultType !== 'undefined' ? resultType : leftType;
    };

    /**
     * @returns {BoundBinaryOperator[]}
     */
    static get #operators() {
        return [
            new BoundBinaryOperator(SyntaxKind.PlusToken, BoundBinaryOperatorKind.Addition, 'number'),
            new BoundBinaryOperator(SyntaxKind.MinusToken, BoundBinaryOperatorKind.Subtraction, 'number'),
            new BoundBinaryOperator(SyntaxKind.StarToken, BoundBinaryOperatorKind.Multiplication, 'number'),
            new BoundBinaryOperator(SyntaxKind.SlashToken, BoundBinaryOperatorKind.Division, 'number'),

            new BoundBinaryOperator(SyntaxKind.AmpersandAmpersandToken, BoundBinaryOperatorKind.LogicalAnd, 'boolean'),
            new BoundBinaryOperator(SyntaxKind.PipePipeToken, BoundBinaryOperatorKind.LogicalOr, 'boolean'),
        ];
    };

    /**
     * @param {SyntaxKind} syntaxKind
     * @param {string} leftType
     * @param {string} rightType
     * 
     * @returns {BoundBinaryOperator | null}
     */
    static bind(syntaxKind, leftType, rightType) {
        for (const operator of this.#operators) {
            if (operator.syntaxKind === syntaxKind && operator.leftType === leftType && operator.rightType === rightType)
                return operator;
        };

        return null;
    };
};