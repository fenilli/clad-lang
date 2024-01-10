import assert from 'node:assert';

import { Compiler } from '../../src/compiler.js';
import { SyntaxKind } from '../../src/analiser/syntax/factory/SyntaxKind.js';

/**
 * Asserts the evaluation result.
 * 
 * @param {string} input 
 * @param {any} expected
 * @param {any} [scope]
 */
export const assertResult = (input, expected, scope = {}) => {
    const { evaluate } = new Compiler();

    const { result, diagnostics } = evaluate(input, scope);

    assert.deepEqual(diagnostics, []);
    assert.equal(result, expected);
};

export { SyntaxKind };