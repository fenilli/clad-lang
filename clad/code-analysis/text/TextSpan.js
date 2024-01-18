export class TextSpan {
    start;
    length;
    end;
    line;
    column;

    /**
     * @param {number} start
     * @param {number} end
     * @param {number} line
     * @param {number} column
     */
    constructor(start, end, line, column) {
        this.start = start;
        this.end = end;
        this.length = end - start;
        this.line = line;
        this.column = column;
    };
};