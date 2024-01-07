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

    PlusToken: 'PlusToken',
    MinusToken: 'MinusToken',
    AsteriskToken: 'AsteriskToken',
    SlashToken: 'SlashToken',
    BangToken: 'BangToken',
    DoubleAmpersandToken: 'DoubleAmpersandToken',
    DoublePipeToken: 'DoublePipeToken',
    OpenParenToken: 'OpenParenToken',
    CloseParenToken: 'CloseParenToken',

    // Keywords:
    FalseKeyword: 'FalseKeyword',
    TrueKeyword: 'TrueKeyword',

    // Expressions:
    InfixExpression: 'InfixExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
    PrefixExpression: 'PrefixExpression',

    // Literals:
    BooleanLiteral: 'BooleanLiteral',
    NumericLiteral: 'NumericLiteral',

    // Misc:
    SourceFile: 'SourceFile',
};