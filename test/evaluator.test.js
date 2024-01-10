import { describe } from 'node:test';

import literals from './evaluator/literals.spec.js';
import expressions from './evaluator/expressions.spec.js';

describe('Evaluator', () => {
    literals();
    expressions();
});