import { SyntaxKind } from '../syntax/index.js';
import { BoundUnaryOperatorKind } from './index.js';

export class BoundUnaryOperator {
    syntaxKind;
    kind;
    operandType;
    resultType;

    /**
     * @param {SyntaxKind} syntaxKind
     * @param {BoundUnaryOperatorKind} kind
     * @param {string} operandType
     * @param {string} [resultType]
     */
    constructor(syntaxKind, kind, operandType, resultType) {
        this.syntaxKind = syntaxKind;
        this.kind = kind;
        this.operandType = operandType;
        this.resultType = typeof resultType !== 'undefined' ? resultType : operandType;
    };

    /**
     * @returns {BoundUnaryOperator[]}
     */
    static get #operators() {
        return [
            new BoundUnaryOperator(SyntaxKind.BangToken, BoundUnaryOperatorKind.LogicalNegation, 'boolean'),
            new BoundUnaryOperator(SyntaxKind.PlusToken, BoundUnaryOperatorKind.Identity, 'number'),
            new BoundUnaryOperator(SyntaxKind.MinusToken, BoundUnaryOperatorKind.Negation, 'number'),
        ];
    };

    /**
     * @param {SyntaxKind} syntaxKind
     * @param {string} operandType
     * 
     * @returns {BoundUnaryOperator | null}
     */
    static bind(syntaxKind, operandType) {
        for (const operator of this.#operators) {
            if (operator.syntaxKind === syntaxKind && operator.operandType === operandType)
                return operator;
        };

        return null;
    };
};