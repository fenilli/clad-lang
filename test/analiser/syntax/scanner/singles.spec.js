import { it } from 'node:test';

import { tests, assertToken } from './utils.js';

export default () => {
    it('scans single token', () => {
        for (const [kind, input] of tests) {
            assertToken(input)(kind);
        };
    });
};