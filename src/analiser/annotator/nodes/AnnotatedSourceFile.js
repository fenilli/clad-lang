import {
    AnnotatedKind,
    AnnotatedNode,
} from '../factory/index.js';

/**
 * Represents a source file in the syntax tree.
 * 
 * @extends {AnnotatedNode}
 */
export class AnnotatedSourceFile extends AnnotatedNode {
    /**
     * Creates an instance of SourceFile.
     * 
     * @param {AnnotatedNode} body - The body of the source file
     */
    constructor(body) {
        super(AnnotatedKind.SourceFile, body.type);

        this.body = body;
    };
};