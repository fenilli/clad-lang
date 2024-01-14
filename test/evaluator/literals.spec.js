import { it } from 'node:test';

import { assertResult } from './utils.js';
import { IdentifierSymbol } from '../../src/IdentifierSymbol.js';

export default () => {
    it('evaluates numeric literals', () => {
        /** @type {[string, number][]} */
        const tests = [
            ['1', 1],
            ['42', 42],
        ];

        for (const [input, expected] of tests) {
            assertResult(input, expected);
        };
    });

    it('evaluates boolean literals', () => {
        /** @type {[string, boolean][]} */
        const tests = [
            ['true', true],
            ['false', false],
        ];

        for (const [input, expected] of tests) {
            assertResult(input, expected);
        };
    });

    it('evaluates identifiers literals', () => {
        /** @type {[string, any][]} */
        const tests = [
            ['(x = 42) == x', true],
            ['(foo = 5) == 5', true],
        ];

        for (const [input, expected] of tests) {
            assertResult(input, expected);
        };
    });
};