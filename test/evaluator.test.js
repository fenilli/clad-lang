import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Compiler } from '../src/compiler.js';
import { SyntaxKind } from '../src/analiser/syntax/factory/SyntaxKind.js';

describe('Evaluator', () => {
    it('evaluates simple literals', () => {
        /** @type {[string, any][]} */
        const tests = [
            ['1', 1],

            ['true', true],
            ['false', false],

            ['x', 42],
        ];

        for (const [input, expected] of tests) {
            const { evaluate } = new Compiler();
            const { result, diagnostics } = evaluate(input, { x: 42 });

            assert.deepEqual(diagnostics, []);
            assert.equal(result, expected);
        };
    });

    it('evaluates expressions', () => {
        /** @type {[string, any][]} */
        const tests = [
            ['!true', false],
            ['!false', true],

            ['true && false', false],
            ['true && true', true],
            ['false && true', false],
            ['false && false', false],

            ['true || false', true],
            ['true || true', true],
            ['false || true', true],
            ['false || false', false],

            ['true == true', true],
            ['true == false', false],
            ['false == true', false],
            ['false == false', true],

            ['true != false', true],
            ['true != true', false],
            ['false != true', true],
            ['false != false', false],

            ['-1', -1],
            ['-+1', -1],
            ['+1', 1],
            ['+-1', -1],

            ['(2 + 4)', 6],
            ['2 + 2', 4],
            ['4 - 2', 2],
            ['2 - 4', -2],
            ['2 * 4', 8],
            ['4 / 2', 2],
            ['2 / 4', 0.5],
            ['1 == 1', true],
            ['1 == 2', false],

            ['1 + 2 + 4', 7],
            ['1 + 2 - 4', -1],
            ['1 + 2 * 4', 9],
            ['1 + 4 / 2', 3],
            ['2 * (4 + 2)', 12],
            ['1 + 1 == 2', true],
            ['1 == 1 + 3', false],
        ];

        for (const [input, expected] of tests) {
            const { evaluate } = new Compiler();
            const { result, diagnostics } = evaluate(input, { x: 42 });

            assert.deepEqual(diagnostics, []);
            assert.equal(result, expected);
        };
    });

    it('evaluates assignement expressions', () => {
        const { evaluate } = new Compiler();
        const { result, diagnostics } = evaluate('x = 42', {});

        assert.deepEqual(diagnostics, []);
        assert.equal(result, 42);
    });
});