import { describe } from 'node:test';

import singles from './scanner/singles.spec.js';
import pairs from './scanner/pairs.spec.js';

describe('Scanner', () => {
    singles();
    pairs();
});