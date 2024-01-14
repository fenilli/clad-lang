import { AnnotatedGlobalScope } from "./analiser/annotator/factory/AnnotatedGlobalScope.js";
import { Annotator } from "./analiser/annotator/index.js";
import { Diagnostic } from "./analiser/diagnostic.js";
import { Parser } from "./analiser/syntax/parser.js";
import { IdentifierSymbol } from "./IdentifierSymbol.js";
import { Evaluator } from "./evaluator.js";
import { SourceFile } from "./analiser/syntax/nodes/SourceFile.js";

/**
 * Compiler class responsible for parsing and annotating source code.
 */
export class Compiler {
    /**
     * Previous compiler called.
     * 
     * @type {Compiler | null}
     */
    #previous;

    /**
     * Global scope for the compilation.
     * 
     * @type { AnnotatedGlobalScope }
     */
    #globalScope;

    /**
     * The parser for the current compilation.
     * 
     * @type {Parser}
     */
    #parser;

    /**
     * @type {SourceFile}
     */
    #ast;

    /**
     * Creates an instance of Compiler.
     * 
     * @param {string} input 
     * @param {Compiler | null} previous
     */
    constructor(input, previous = null) {
        this.#parser = new Parser(input);
        this.#ast = this.#parser.parse();
        this.#previous = previous;
    };

    /**
     * @returns {AnnotatedGlobalScope}
     */
    get globalScope() {
        if (!this.#globalScope) this.#globalScope = Annotator.annotateGlobalScope(this.#previous ? this.#previous.globalScope : null, this.#ast);

        return this.#globalScope;
    };

    /**
     * Continue with the previous compiler scope.
     * 
     * @param {string} input
     * 
     * @returns {Compiler}
     */
    continue(input) {
        return new Compiler(input, this);
    };

    /**
     * Evaluates the input source code by parsing, annotating, and returning the abstract syntax tree (AST)
     * along with any diagnostic messages.
     *
     * @param {Map<IdentifierSymbol, any>} environment - The source code to be compiled.
     * @returns {{ ast: any, result: any, diagnostics: Diagnostic[] }} An object containing the AST and an array of diagnostic messages.
     */
    evaluate(environment = new Map()) {
        const evaluator = new Evaluator(environment);
        const result = evaluator.evaluate(this.globalScope.source);
        const diagnostics = this.#parser.getDiagnostics().concat(this.globalScope.diagnostics).toArray();

        return { ast: this.#ast, result, diagnostics };
    };
};