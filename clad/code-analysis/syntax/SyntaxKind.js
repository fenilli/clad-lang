/**
 * Enum representing all AST syntax kinds.
 * 
 * @enum {string}
*/
export const SyntaxKind = {
    // Tokens:
    BadToken: 'BadToken',
    EndOfFileToken: 'EndOfFileToken',
    WhitespaceToken: 'WhitespaceToken',

    NumberToken: 'NumberToken',
    IdentifierToken: 'IdentifierToken',

    PlusToken: 'PlusToken',
    MinusToken: 'MinusToken',
    StarToken: 'StarToken',
    SlashToken: 'SlashToken',
    BangToken: 'BangToken',
    AmpersandAmpersandToken: 'AmpersandAmpersandToken',
    PipePipeToken: 'PipePipeToken',

    OpenParenthesisToken: 'OpenParenthesisToken',
    CloseParenthesisToken: 'CloseParenthesisToken',

    // Keywords:
    FalseKeyword: 'FalseKeyword',
    TrueKeyword: 'TrueKeyword',

    // Expressions:
    UnaryExpression: 'UnaryExpression',
    BinaryExpression: 'BinaryExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
    LiteralExpression: 'LiteralExpression',
};