import { IdentifierSymbol } from '../../../IdentifierSymbol.js';
import { DiagnosticBag } from '../../diagnostic.js';
import { AnnotatedSourceFile } from '../nodes/AnnotatedSourceFile.js';

/**
 * Represents an global annotated scope in a tree structure.
 */
export class AnnotatedGlobalScope {
    /**
     * The parent of this scope.
     * 
     * @type {AnnotatedGlobalScope | null}
     */
    previous;

    /**
     * The parent of this scope.
     * 
     * @type {DiagnosticBag}
     */
    diagnostics;

    /**
     * The variables of the current scope.
     * 
     * @type {IdentifierSymbol[]}
     */
    variables;

    /**
     * The parent of this scope.
     * 
     * @type {AnnotatedSourceFile}
     */
    source;

    /**
     * Creates a AnnotatedGlobalScope.
     * 
     * @param {AnnotatedGlobalScope | null} previous - The previous scope.
     * @param {DiagnosticBag} diagnostics - The diagnostics for annotating the global scope.
     * @param {IdentifierSymbol[]} variables - The variables for the global scope.
     * @param {AnnotatedSourceFile} source - The source to annotate the variables.
     */
    constructor(previous, diagnostics, variables, source) {
        this.previous = previous;
        this.diagnostics = diagnostics;
        this.variables = variables;
        this.source = source;
    };
};