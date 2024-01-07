/**
 * Enum representing all annotated node kinds.
 * 
 * @enum {string}
*/
export const AnnotatedKind = {
    // PrefixKind:
    Identity: 'Identity',
    Negation: 'Negation',
    LogicalNegation: 'LogicalNegation',

    // InfixKind:
    Addition: 'Addition',
    Subtraction: 'Subtraction',
    Multiplication: 'Multiplication',
    Division: 'Division',
    LogicalAnd: 'LogicalAnd',
    LogicalOr: 'LogicalOr',

    // Expressions:
    InfixExpression: 'InfixExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
    PrefixExpression: 'PrefixExpression',

    // Literals:
    BooleanLiteral: 'BooleanLiteral',
    NumericLiteral: 'NumericLiteral',

    SourceFile: 'SourceFile',
};