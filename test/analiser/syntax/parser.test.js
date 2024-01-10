import { describe, it } from 'node:test';

import literals from './parser/literals.spec.js';
import expressions from './parser/expressions.spec.js';

describe('Parser', () => {
    literals();
    expressions();
});