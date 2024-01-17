import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Compilation } from '../../clad/code-analysis/Compilation.js';
import { SyntaxTree } from '../../clad/code-analysis/syntax/index.js';

/**
 * @return {[string, any][]}
 */
function getTests() {
    return [
        ['1', 1],
        ['+1', 1],
        ['-1', -1],

        ['14 + 12', 26],
        ['12 - 3', 9],
        ['4 * 2', 8],
        ['9 / 3', 3],
        ['(10)', 10],
        ['12 == 3', false],
        ['3 == 3', true],
        ['12 != 3', true],
        ['3 != 3', false],
        ['false == false', true],
        ['true == false', false],
        ['false != false', false],
        ['true != false', true],

        ['true', true],
        ['false', false],
        ['!true', false],
        ['!false', true],

        ['(a = 10) * a', 100],
    ];
};

describe('Evaluator Tests', () => {
    getTests().forEach(([text, expectedValue]) => {
        const syntaxTree = SyntaxTree.parse(text);
        const compilation = new Compilation(syntaxTree);
        const variables = new Map();
        const result = compilation.evaluate(variables);

        it(`evaluates ${text} with the correct result ${expectedValue}.`, () => {
            assert.equal(result.diagnostics.length, 0);
            assert.equal(result.value, expectedValue);
        });
    });
});