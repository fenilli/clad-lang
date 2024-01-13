import { Annotator } from "./analiser/annotator/index.js";
import { Diagnostic } from "./analiser/diagnostic.js";
import { Parser } from "./analiser/syntax/parser.js";
import { IdentifierSymbol } from "./IdentifierSymbol.js";
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
     * @param {Map<IdentifierSymbol, any>} environment - The source code to be compiled.
     * @returns {{ ast: any, result: any, diagnostics: Diagnostic[] }} An object containing the AST and an array of diagnostic messages.
     */
    evaluate(input, environment = new Map()) {
        const parser = new Parser(input);
        const ast = parser.parse();

        const annotator = new Annotator(environment);
        const aast = annotator.annotate(ast);

        const evaluator = new Evaluator(environment);
        const result = evaluator.evaluate(aast);
        const diagnostics = parser.getDiagnostics().concat(annotator.getDiagnostics()).toArray();

        return { ast, result, diagnostics };
    };
};