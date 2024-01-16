export class TextSpan {
    start;
    length;

    /**
     * @param {number} start
     * @param {number} length
     */
    constructor(start, length) {
        this.start = start;
        this.length = length;
    };

    get end() {
        return this.start + this.length;
    };
};