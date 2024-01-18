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
    EqualsToken: 'EqualsToken',
    AmpersandAmpersandToken: 'AmpersandAmpersandToken',
    PipePipeToken: 'PipePipeToken',
    EqualsEqualsToken: 'EqualsEqualsToken',
    BangEqualsToken: 'BangEqualsToken',

    OpenParenthesisToken: 'OpenParenthesisToken',
    CloseParenthesisToken: 'CloseParenthesisToken',

    // Keywords:
    FalseKeyword: 'FalseKeyword',
    TrueKeyword: 'TrueKeyword',

    // Nodes:
    CompilationUnit: 'CompilationUnit',

    // Expressions:
    UnaryExpression: 'UnaryExpression',
    BinaryExpression: 'BinaryExpression',
    AssignmentExpression: 'AssignmentExpression',
    ParenthesizedExpression: 'ParenthesizedExpression',
    NameExpression: 'NameExpression',
    LiteralExpression: 'LiteralExpression',
};