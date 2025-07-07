"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDefinitionsOrigin = void 0;
const InkList_1 = require("./InkList");
const Value_1 = require("./Value");
const NullException_1 = require("./NullException");
class ListDefinitionsOrigin {
    constructor(lists) {
        this._lists = new Map();
        this._allUnambiguousListValueCache = new Map();
        for (let list of lists) {
            this._lists.set(list.name, list);
            for (let [key, val] of list.items) {
                let item = InkList_1.InkListItem.fromSerializedKey(key);
                let listValue = new Value_1.ListValue(item, val);
                if (!item.itemName) {
                    throw new Error("item.itemName is null or undefined.");
                }
                this._allUnambiguousListValueCache.set(item.itemName, listValue);
                this._allUnambiguousListValueCache.set(item.fullName, listValue);
            }
        }
    }
    get lists() {
        let listOfLists = [];
        for (let [, value] of this._lists) {
            listOfLists.push(value);
        }
        return listOfLists;
    }
    TryListGetDefinition(name, 
    /* out */ def) {
        if (name === null) {
            return { result: def, exists: false };
        }
        // initially, this function returns a boolean and the second parameter is an out.
        let definition = this._lists.get(name);
        if (!definition)
            return { result: def, exists: false };
        return { result: definition, exists: true };
    }
    FindSingleItemListWithName(name) {
        if (name === null) {
            return (0, NullException_1.throwNullException)("name");
        }
        let val = this._allUnambiguousListValueCache.get(name);
        if (typeof val !== "undefined") {
            return val;
        }
        return null;
    }
}
exports.ListDefinitionsOrigin = ListDefinitionsOrigin;
//# sourceMappingURL=ListDefinitionsOrigin.js.map