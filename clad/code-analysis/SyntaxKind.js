/**
 * Enum representing all AST syntax kinds.
 * 
 * @enum {string}
*/
export const SyntaxKind = {
    // Tokens:
    NumberToken: 'NumberToken',
    WhitespaceToken: 'WhitespaceToken',
    PlusToken: 'PlusToken',
    MinusToken: 'MinusToken',
    StarToken: 'StarToken',
    SlashToken: 'SlashToken',
    OpenParenthesisToken: 'OpenParenthesisToken',
    CloseParenthesisToken: 'CloseParenthesisToken',
    BadToken: 'BadToken',
    EndOfFileToken: 'EndOfFileToken',
    NumberExpression: 'NumberExpression',
    BinaryExpression: 'BinaryExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
};