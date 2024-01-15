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

    PlusToken: 'PlusToken',
    MinusToken: 'MinusToken',
    StarToken: 'StarToken',
    SlashToken: 'SlashToken',

    OpenParenthesisToken: 'OpenParenthesisToken',
    CloseParenthesisToken: 'CloseParenthesisToken',

    // Expressions:
    BinaryExpression: 'BinaryExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
    LiteralExpression: 'LiteralExpression',
};