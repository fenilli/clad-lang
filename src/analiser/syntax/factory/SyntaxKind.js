/**
 * Enum representing all AST syntax kinds.
 * 
 * @enum {string}
*/
export const SyntaxKind = {
    // Tokens:
    EndOfFileToken: 'EndOfFileToken',
    WhitespaceToken: 'WhitespaceToken',
    UnexpectedToken: 'UnexpectedToken',

    NumberToken: 'NumberToken',
    IdentifierToken: 'IdentifierToken',

    DoubleAmpersandToken: 'DoubleAmpersandToken',
    DoublePipeToken: 'DoublePipeToken',
    DoubleEqualToken: 'DoubleEqualToken',
    BangEqualToken: 'BangEqualToken',
    EqualsToken: 'EqualsToken',
    PlusToken: 'PlusToken',
    MinusToken: 'MinusToken',
    AsteriskToken: 'AsteriskToken',
    SlashToken: 'SlashToken',
    BangToken: 'BangToken',
    OpenParenToken: 'OpenParenToken',
    CloseParenToken: 'CloseParenToken',

    // Keywords:
    FalseKeyword: 'FalseKeyword',
    TrueKeyword: 'TrueKeyword',

    // Expressions:
    AssignmentExpression: 'AssignmentExpression',
    IdentifierExpression: 'IdentifierExpression',
    InfixExpression: 'InfixExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
    PrefixExpression: 'PrefixExpression',

    // Literals:
    BooleanLiteral: 'BooleanLiteral',
    NumericLiteral: 'NumericLiteral',

    // Misc:
    SourceFile: 'SourceFile',
};