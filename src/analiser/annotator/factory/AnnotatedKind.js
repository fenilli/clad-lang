/**
 * Enum representing all annotated node kinds.
 * 
 * @enum {string}
*/
export const AnnotatedKind = {
    // PrefixKind:
    Identity: 'Identity',
    Negation: 'Negation',

    // InfixKind:
    Addition: 'Addition',
    Subtraction: 'Subtraction',
    Multiplication: 'Multiplication',
    Division: 'Division',

    // Expressions:
    InfixExpression: 'InfixExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
    PrefixExpression: 'PrefixExpression',

    // Literals:
    NumericLiteral: 'NumericLiteral',

    SourceFile: 'SourceFile',
};