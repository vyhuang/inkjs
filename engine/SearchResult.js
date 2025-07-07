"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
const Container_1 = require("./Container");
class SearchResult {
    constructor() {
        this.obj = null;
        this.approximate = false;
    }
    get correctObj() {
        return this.approximate ? null : this.obj;
    }
    get container() {
        return this.obj instanceof Container_1.Container ? this.obj : null;
    }
    copy() {
        let searchResult = new SearchResult();
        searchResult.obj = this.obj;
        searchResult.approximate = this.approximate;
        return searchResult;
    }
}
exports.SearchResult = SearchResult;
//# sourceMappingURL=SearchResult.js.map