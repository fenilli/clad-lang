import { it } from 'node:test';

import { assertResult } from './utils.js';
import { IdentifierSymbol } from '../../src/IdentifierSymbol.js';

export default () => {
    it('evaluates prefix expressions', () => {
        /** @type {[string, any][]} */
        const tests = [
            ['!true', false],
            ['!false', true],
            ['-1', -1],
            ['+1', 1],
            ['-+1', -1],
            ['+-1', -1],
        ];

        for (const [input, expected] of tests) {
            assertResult(input, expected);
        };
    });

    it('evaluates infix expressions', () => {
        /** @type {[string, any][]} */
        const tests = [
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
            assertResult(input, expected);
        };
    });

    it('evaluates assignement expressions', () => {
        assertResult('x = 42', 42);
    });
};