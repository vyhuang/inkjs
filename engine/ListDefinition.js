"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDefinition = void 0;
const InkList_1 = require("./InkList");
class ListDefinition {
    constructor(name, items) {
        this._name = name || "";
        this._items = null;
        this._itemNameToValues = items || new Map();
    }
    get name() {
        return this._name;
    }
    get items() {
        if (this._items == null) {
            this._items = new Map();
            for (let [key, value] of this._itemNameToValues) {
                let item = new InkList_1.InkListItem(this.name, key);
                this._items.set(item.serialized(), value);
            }
        }
        return this._items;
    }
    ValueForItem(item) {
        if (!item.itemName)
            return 0;
        let intVal = this._itemNameToValues.get(item.itemName);
        if (typeof intVal !== "undefined")
            return intVal;
        else
            return 0;
    }
    ContainsItem(item) {
        if (!item.itemName)
            return false;
        if (item.originName != this.name)
            return false;
        return this._itemNameToValues.has(item.itemName);
    }
    ContainsItemWithName(itemName) {
        return this._itemNameToValues.has(itemName);
    }
    TryGetItemWithValue(val, 
    /* out */ item) {
        for (let [key, value] of this._itemNameToValues) {
            if (value == val) {
                item = new InkList_1.InkListItem(this.name, key);
                return { result: item, exists: true };
            }
        }
        item = InkList_1.InkListItem.Null;
        return { result: item, exists: false };
    }
    TryGetValueForItem(item, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /* out */ intVal) {
        if (!item.itemName)
            return { result: 0, exists: false };
        let value = this._itemNameToValues.get(item.itemName);
        if (!value)
            return { result: 0, exists: false };
        return { result: value, exists: true };
    }
}
exports.ListDefinition = ListDefinition;
//# sourceMappingURL=ListDefinition.js.map