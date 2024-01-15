import readline from 'node:readline';

import { Evaluator } from './code-analysis/Evaluator.js';
import { SyntaxToken, SyntaxTree } from './code-analysis/syntax/index.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * @param {import('./code-analysis/syntax/SyntaxNode.js').SyntaxNode} node
 * @param {string} indent
 * @param {boolean} isLast
 */
function prettyPrint(node, indent = '', isLast = true) {
    const marker = isLast ? '└───' : '├───';
    process.stdout.write(`${indent}${marker}${node.kind}`);

    if (node instanceof SyntaxToken && node.value !== null) {
        process.stdout.write(` ${node.value}`);
    };

    process.stdout.write('\n');

    indent += isLast ? '    ' : '│   ';

    const lastChild = node.getChildren().slice(-1)[0];
    for (const child of node.getChildren()) {
        prettyPrint(child, indent, child === lastChild);
    };
};

let debug = false;

function processInput() {
    rl.question('> ', (line) => {
        if (line === '#debug') {
            process.stdout.write(`Debug mode ${debug ? 'deactivated' : 'activated'}!\n`);
            debug = !debug;

            return processInput();
        } else if (line === '#clear') {
            process.stdout.write('\u001Bc');
            return processInput();
        };

        const { root, diagnostics } = SyntaxTree.parse(line);

        if (debug) {
            process.stdout.write('\x1b[38;2;127;127;127m│\n');
            prettyPrint(root);
            process.stdout.write('\x1b[0m');
        };

        if (diagnostics.length === 0) {
            const evaluator = new Evaluator(root);
            const result = evaluator.evaluate();

            process.stdout.write(`\x1b[38;2;255;255;0m${result}\x1b[0m\n`);
        } else {
            process.stdout.write('\n\x1b[38;2;255;0;0m');

            for (const diagnostic of diagnostics) {
                console.log(diagnostic);
            };

            process.stdout.write('\x1b[0m\n');
        };

        processInput();
    });
};

processInput();