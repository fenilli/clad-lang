import readline from 'node:readline';

import { Compilation } from './clad/code-analysis/Compilation.js';
import { SyntaxToken, SyntaxTree } from './clad/code-analysis/syntax/index.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * @param {import('./clad/code-analysis/syntax/SyntaxNode.js').SyntaxNode} node
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

        const syntaxTree = SyntaxTree.parse(line);
        const compilation = new Compilation(syntaxTree);
        const { diagnostics, value } = compilation.evaluate();

        if (debug) {
            process.stdout.write('\x1b[38;2;127;127;127m│\n');
            prettyPrint(syntaxTree.root);
            process.stdout.write('\x1b[0m');
        };

        if (diagnostics.length === 0) {
            process.stdout.write(`\x1b[38;2;255;255;0m${value}\x1b[0m\n`);
        } else {
            for (const diagnostic of diagnostics) {
                process.stdout.write('\n\x1b[38;2;255;0;0m');
                console.log(diagnostic.message);
                process.stdout.write('\x1b[0m');

                const prefix = line.substring(0, diagnostic.span.start);
                const error = line.substring(diagnostic.span.start, diagnostic.span.end);
                const suffix = line.substring(diagnostic.span.end);

                process.stdout.write(`   └─── ${prefix}`);
                process.stdout.write(`\x1b[38;2;255;0;0m${error}`);
                process.stdout.write(`\x1b[0m${suffix}\n`);
            };
        };

        processInput();
    });
};

processInput();