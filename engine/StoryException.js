"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryException = void 0;
class StoryException extends Error {
    constructor(message) {
        super(message);
        this.useEndLineNumber = false;
        this.message = message;
        this.name = "StoryException";
    }
}
exports.StoryException = StoryException;
//# sourceMappingURL=StoryException.js.map