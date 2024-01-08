import rl from 'node:readline';

import {
    SyntaxNode,
    SyntaxToken,
} from './analiser/syntax/factory/index.js';
import { Compiler } from './compiler.js';

/**
 * Represents a Read-Eval-Print Loop (REPL) class for interactive input and output.
 */
export class REPL {
    /**
     * The standard input stream.
     * 
     * @type {import('stream').Readable}
     */
    #in = process.stdin;

    /**
    * The standard output stream.
    * 
    * @type {import('stream').Writable}
    */
    #out = process.stdout;

    /**
     * The Readline interface for handling input and output.
     * 
     * @type {import('readline').Interface}
     */
    #cli = rl.createInterface({ input: this.#in, output: this.#out });

    /**
     * Writes the provided buffer to the standard output.
     * 
     * @param {string} buffer - The buffer to be written.
     */
    #write(buffer) {
        this.#out.write(buffer);
    };

    /**
     * Recursively prints the syntax tree to the standard output.
     * 
     * @param {SyntaxNode} node - The syntax tree node to print.
     * @param {string} indent - The current indentation string.
     * @param {boolean} isLast - Indicates whether the current node is the last child.
     */
    #printTree(node, indent = '', isLast = true) {
        this.#write(`${indent}${isLast ? '└───' : '├───'}${node.kind}`);

        if (node instanceof SyntaxToken && typeof node.value !== 'undefined') this.#write(` ${node.value}`);
        this.#write('\n');
        indent += isLast ? '    ' : '│   ';

        const children = node.getChildren();
        const lastChild = children.slice(-1)[0];
        for (const child of children) this.#printTree(child, indent, child === lastChild);
    };

    /**
     * Runs the REPL, handling input and producing output.
     */
    run() {
        let debug = true;
        const scope = {};

        this.#cli.on('line', (input) => {
            if (input === '#clear') return this.#write('\u001Bc');
            if (input === '#exit') return this.#cli.close();
            if (input === '#debug') {
                this.#write(`${debug ? 'Deactivated' : 'Activated'} debug mode!\n`);

                debug = !debug;
                return this.#cli.prompt();
            };

            const { evaluate } = new Compiler();
            const { ast, result, diagnostics } = evaluate(input, scope);

            if (debug) this.#printTree(ast);

            if (diagnostics.length === 0) {
                this.#write(`${result}\n`);
            } else {
                for (const diagnostic of diagnostics) {
                    this.#write('\n\x1b[31m');
                    this.#write(`${diagnostic.message}\n`);
                    this.#write('\x1b[0m');

                    const prefix = input.slice(0, diagnostic.span.start);
                    const error = input.slice(diagnostic.span.start, diagnostic.span.end);
                    const suffix = input.slice(diagnostic.span.end);

                    this.#write(`    └── ${prefix}`);
                    this.#write('\x1b[31m');
                    this.#write(`${error}`);
                    this.#write('\x1b[0m');
                    this.#write(`${suffix}\n`);
                };
            };

            this.#cli.prompt();
        }).setPrompt('> ');

        this.#cli.prompt();
    };
};

/**
 * Instantiates a REPL and starts its run loop.
 */
const repl = new REPL();
repl.run();