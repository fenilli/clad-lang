import { SyntaxKind } from '../syntax/index.js';
import { BoundBinaryOperatorKind } from './index.js';

export class BoundBinaryOperator {
    syntaxKind;
    kind;
    leftType;
    rightType;
    type;

    /**
     * @param {SyntaxKind} syntaxKind
     * @param {BoundBinaryOperatorKind} kind
     * @param {string} typeOrLeftType
     * @param {string} [rightTypeOrResultType]
     * @param {string} [type]
     */
    constructor(syntaxKind, kind, typeOrLeftType, rightTypeOrResultType, type) {
        this.syntaxKind = syntaxKind;
        this.kind = kind;
        this.leftType = typeOrLeftType;
        this.rightType = typeof type !== 'undefined'
            ? rightTypeOrResultType
            : typeOrLeftType;
        this.type = typeof type === 'undefined'
            ? typeof rightTypeOrResultType !== 'undefined'
                ? rightTypeOrResultType
                : typeOrLeftType
            : type;
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
            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, 'number', 'boolean'),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, 'number', 'boolean'),

            new BoundBinaryOperator(SyntaxKind.AmpersandAmpersandToken, BoundBinaryOperatorKind.LogicalAnd, 'boolean'),
            new BoundBinaryOperator(SyntaxKind.PipePipeToken, BoundBinaryOperatorKind.LogicalOr, 'boolean'),
            new BoundBinaryOperator(SyntaxKind.EqualsEqualsToken, BoundBinaryOperatorKind.Equals, 'boolean'),
            new BoundBinaryOperator(SyntaxKind.BangEqualsToken, BoundBinaryOperatorKind.NotEquals, 'boolean'),
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