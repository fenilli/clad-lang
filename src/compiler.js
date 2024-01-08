import { Annotator } from "./analiser/annotator/index.js";
import { Diagnostic } from "./analiser/diagnostic.js";
import { Parser } from "./analiser/syntax/parser.js";
import { Evaluator } from "./evaluator.js";

/**
 * Compiler class responsible for parsing and annotating source code.
 */
export class Compiler {
    /**
     * Evaluates the input source code by parsing, annotating, and returning the abstract syntax tree (AST)
     * along with any diagnostic messages.
     *
     * @param {string} input - The source code to be compiled.
     * @returns {{ ast: any, result: any, diagnostics: Diagnostic[] }} An object containing the AST and an array of diagnostic messages.
     */
    evaluate(input) {
        const parser = new Parser(input);
        const annotator = new Annotator();
        const evaluator = new Evaluator();
        const ast = parser.parse();
        const aast = annotator.annotate(ast);

        const result = evaluator.evaluate(aast);
        const diagnostics = parser.getDiagnostics().concat(annotator.getDiagnostics()).toArray();

        return { ast, result, diagnostics };
    };
};