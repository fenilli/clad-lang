import assert from 'node:assert';

import { Compiler } from '../../src/compiler.js';
import { SyntaxKind } from '../../src/analiser/syntax/factory/SyntaxKind.js';

/**
 * Asserts the evaluation result.
 * 
 * @param {string} input 
 * @param {any} expected
 */
export const assertResult = (input, expected) => {
    const compiler = new Compiler(input);
    const { result, diagnostics } = compiler.evaluate();

    assert.deepEqual(diagnostics, []);
    assert.equal(result, expected);
};

export { SyntaxKind };