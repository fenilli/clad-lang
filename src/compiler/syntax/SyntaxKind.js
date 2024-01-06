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
    OpenParenToken: 'OpenParenToken',
    CloseParenToken: 'CloseParenToken',

    // Misc:
    SourceFile: 'SourceFile',
};