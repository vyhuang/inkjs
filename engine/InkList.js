"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InkList = exports.InkListItem = void 0;
const NullException_1 = require("./NullException");
const StringBuilder_1 = require("./StringBuilder");
class InkListItem {
    constructor() {
        // InkListItem is a struct
        this.originName = null;
        this.itemName = null;
        if (typeof arguments[1] !== "undefined") {
            let originName = arguments[0];
            let itemName = arguments[1];
            this.originName = originName;
            this.itemName = itemName;
        }
        else if (arguments[0]) {
            let fullName = arguments[0];
            let nameParts = fullName.toString().split(".");
            this.originName = nameParts[0];
            this.itemName = nameParts[1];
        }
    }
    static get Null() {
        return new InkListItem(null, null);
    }
    get isNull() {
        return this.originName == null && this.itemName == null;
    }
    get fullName() {
        return ((this.originName !== null ? this.originName : "?") + "." + this.itemName);
    }
    toString() {
        return this.fullName;
    }
    Equals(obj) {
        if (obj instanceof InkListItem) {
            let otherItem = obj;
            return (otherItem.itemName == this.itemName &&
                otherItem.originName == this.originName);
        }
        return false;
    }
    // These methods did not exist in the original C# code. Their purpose is to
    // make `InkListItem` mimics the value-type semantics of the original
    // struct. Please refer to the end of this file, for a more in-depth
    // explanation.
    /**
     * Returns a shallow clone of the current instance.
     */
    copy() {
        return new InkListItem(this.originName, this.itemName);
    }
    /**
     * Returns a `SerializedInkListItem` representing the current
     * instance. The result is intended to be used as a key inside a Map.
     */
    serialized() {
        // We are simply using a JSON representation as a value-typed key.
        return JSON.stringify({
            originName: this.originName,
            itemName: this.itemName,
        });
    }
    /**
     * Reconstructs a `InkListItem` from the given SerializedInkListItem.
     */
    static fromSerializedKey(key) {
        let obj = JSON.parse(key);
        if (!InkListItem.isLikeInkListItem(obj))
            return InkListItem.Null;
        let inkListItem = obj;
        return new InkListItem(inkListItem.originName, inkListItem.itemName);
    }
    /**
     * Determines whether the given item is sufficiently `InkListItem`-like
     * to be used as a template when reconstructing the InkListItem.
     */
    static isLikeInkListItem(item) {
        if (typeof item !== "object")
            return false;
        if (!item.hasOwnProperty("originName") || !item.hasOwnProperty("itemName"))
            return false;
        if (typeof item.originName !== "string" && typeof item.originName !== null)
            return false;
        if (typeof item.itemName !== "string" && typeof item.itemName !== null)
            return false;
        return true;
    }
}
exports.InkListItem = InkListItem;
class InkList extends Map {
    constructor() {
        // Trying to be smart here, this emulates the constructor inheritance found
        // in the original code, but only if otherList is an InkList. IIFE FTW.
        super((() => {
            if (arguments[0] instanceof InkList) {
                return arguments[0];
            }
            else {
                return [];
            }
        })());
        this.origins = null;
        this._originNames = [];
        if (arguments[0] instanceof InkList) {
            let otherList = arguments[0];
            let otherOriginNames = otherList.originNames;
            if (otherOriginNames !== null)
                this._originNames = otherOriginNames.slice();
            if (otherList.origins !== null) {
                this.origins = otherList.origins.slice();
            }
        }
        else if (typeof arguments[0] === "string") {
            let singleOriginListName = arguments[0];
            let originStory = arguments[1];
            this.SetInitialOriginName(singleOriginListName);
            if (originStory.listDefinitions === null) {
                return (0, NullException_1.throwNullException)("originStory.listDefinitions");
            }
            let def = originStory.listDefinitions.TryListGetDefinition(singleOriginListName, null);
            if (def.exists) {
                // Throwing now, because if the value is `null` it will
                // eventually throw down the line.
                if (def.result === null) {
                    return (0, NullException_1.throwNullException)("def.result");
                }
                this.origins = [def.result];
            }
            else {
                throw new Error("InkList origin could not be found in story when constructing new list: " +
                    singleOriginListName);
            }
        }
        else if (typeof arguments[0] === "object" &&
            arguments[0].hasOwnProperty("Key") &&
            arguments[0].hasOwnProperty("Value")) {
            let singleElement = arguments[0];
            this.Add(singleElement.Key, singleElement.Value);
        }
    }
    static FromString(myListItem, originStory) {
        var _a;
        if (myListItem == null || myListItem == "")
            return new InkList();
        let listValue = (_a = originStory.listDefinitions) === null || _a === void 0 ? void 0 : _a.FindSingleItemListWithName(myListItem);
        if (listValue) {
            if (listValue.value === null) {
                return (0, NullException_1.throwNullException)("listValue.value");
            }
            return new InkList(listValue.value);
        }
        else {
            throw new Error("Could not find the InkListItem from the string '" +
                myListItem +
                "' to create an InkList because it doesn't exist in the original list definition in ink.");
        }
    }
    AddItem(itemOrItemName, storyObject = null) {
        if (itemOrItemName instanceof InkListItem) {
            let item = itemOrItemName;
            if (item.originName == null) {
                this.AddItem(item.itemName);
                return;
            }
            if (this.origins === null)
                return (0, NullException_1.throwNullException)("this.origins");
            for (let origin of this.origins) {
                if (origin.name == item.originName) {
                    let intVal = origin.TryGetValueForItem(item, 0);
                    if (intVal.exists) {
                        this.Add(item, intVal.result);
                        return;
                    }
                    else {
                        throw new Error("Could not add the item " +
                            item +
                            " to this list because it doesn't exist in the original list definition in ink.");
                    }
                }
            }
            throw new Error("Failed to add item to list because the item was from a new list definition that wasn't previously known to this list. Only items from previously known lists can be used, so that the int value can be found.");
        }
        else if (itemOrItemName !== null) {
            //itemOrItemName is a string
            let itemName = itemOrItemName;
            let foundListDef = null;
            if (this.origins === null)
                return (0, NullException_1.throwNullException)("this.origins");
            for (let origin of this.origins) {
                if (itemName === null)
                    return (0, NullException_1.throwNullException)("itemName");
                if (origin.ContainsItemWithName(itemName)) {
                    if (foundListDef != null) {
                        throw new Error("Could not add the item " +
                            itemName +
                            " to this list because it could come from either " +
                            origin.name +
                            " or " +
                            foundListDef.name);
                    }
                    else {
                        foundListDef = origin;
                    }
                }
            }
            if (foundListDef == null) {
                if (storyObject == null) {
                    throw new Error("Could not add the item " +
                        itemName +
                        " to this list because it isn't known to any list definitions previously associated with this list.");
                }
                else {
                    let newItem = InkList.FromString(itemName, storyObject)
                        .orderedItems[0];
                    this.Add(newItem.Key, newItem.Value);
                }
            }
            else {
                let item = new InkListItem(foundListDef.name, itemName);
                let itemVal = foundListDef.ValueForItem(item);
                this.Add(item, itemVal);
            }
        }
    }
    ContainsItemNamed(itemName) {
        for (let [key] of this) {
            let item = InkListItem.fromSerializedKey(key);
            if (item.itemName == itemName)
                return true;
        }
        return false;
    }
    ContainsKey(key) {
        return this.has(key.serialized());
    }
    Add(key, value) {
        let serializedKey = key.serialized();
        if (this.has(serializedKey)) {
            // Throw an exception to match the C# behavior.
            throw new Error(`The Map already contains an entry for ${key}`);
        }
        this.set(serializedKey, value);
    }
    Remove(key) {
        return this.delete(key.serialized());
    }
    get Count() {
        return this.size;
    }
    get originOfMaxItem() {
        if (this.origins == null)
            return null;
        let maxOriginName = this.maxItem.Key.originName;
        let result = null;
        this.origins.every((origin) => {
            if (origin.name == maxOriginName) {
                result = origin;
                return false;
            }
            else
                return true;
        });
        return result;
    }
    get originNames() {
        if (this.Count > 0) {
            if (this._originNames == null && this.Count > 0)
                this._originNames = [];
            else {
                if (!this._originNames)
                    this._originNames = [];
                this._originNames.length = 0;
            }
            for (let [key] of this) {
                let item = InkListItem.fromSerializedKey(key);
                if (item.originName === null)
                    return (0, NullException_1.throwNullException)("item.originName");
                this._originNames.push(item.originName);
            }
        }
        return this._originNames;
    }
    SetInitialOriginName(initialOriginName) {
        this._originNames = [initialOriginName];
    }
    SetInitialOriginNames(initialOriginNames) {
        if (initialOriginNames == null)
            this._originNames = null;
        else
            this._originNames = initialOriginNames.slice(); // store a copy
    }
    get maxItem() {
        let max = {
            Key: InkListItem.Null,
            Value: 0,
        };
        for (let [key, value] of this) {
            let item = InkListItem.fromSerializedKey(key);
            if (max.Key.isNull || value > max.Value)
                max = { Key: item, Value: value };
        }
        return max;
    }
    get minItem() {
        let min = {
            Key: InkListItem.Null,
            Value: 0,
        };
        for (let [key, value] of this) {
            let item = InkListItem.fromSerializedKey(key);
            if (min.Key.isNull || value < min.Value) {
                min = { Key: item, Value: value };
            }
        }
        return min;
    }
    get inverse() {
        let list = new InkList();
        if (this.origins != null) {
            for (let origin of this.origins) {
                for (let [key, value] of origin.items) {
                    let item = InkListItem.fromSerializedKey(key);
                    if (!this.ContainsKey(item))
                        list.Add(item, value);
                }
            }
        }
        return list;
    }
    get all() {
        let list = new InkList();
        if (this.origins != null) {
            for (let origin of this.origins) {
                for (let [key, value] of origin.items) {
                    let item = InkListItem.fromSerializedKey(key);
                    list.set(item.serialized(), value);
                }
            }
        }
        return list;
    }
    Union(otherList) {
        let union = new InkList(this);
        for (let [key, value] of otherList) {
            union.set(key, value);
        }
        return union;
    }
    Intersect(otherList) {
        let intersection = new InkList();
        for (let [key, value] of this) {
            if (otherList.has(key))
                intersection.set(key, value);
        }
        return intersection;
    }
    HasIntersection(otherList) {
        for (let [key] of this) {
            if (otherList.has(key))
                return true;
        }
        return false;
    }
    Without(listToRemove) {
        let result = new InkList(this);
        for (let [key] of listToRemove) {
            result.delete(key);
        }
        return result;
    }
    Contains(what) {
        if (typeof what == "string")
            return this.ContainsItemNamed(what);
        const otherList = what;
        if (otherList.size == 0 || this.size == 0)
            return false;
        for (let [key] of otherList) {
            if (!this.has(key))
                return false;
        }
        return true;
    }
    GreaterThan(otherList) {
        if (this.Count == 0)
            return false;
        if (otherList.Count == 0)
            return true;
        return this.minItem.Value > otherList.maxItem.Value;
    }
    GreaterThanOrEquals(otherList) {
        if (this.Count == 0)
            return false;
        if (otherList.Count == 0)
            return true;
        return (this.minItem.Value >= otherList.minItem.Value &&
            this.maxItem.Value >= otherList.maxItem.Value);
    }
    LessThan(otherList) {
        if (otherList.Count == 0)
            return false;
        if (this.Count == 0)
            return true;
        return this.maxItem.Value < otherList.minItem.Value;
    }
    LessThanOrEquals(otherList) {
        if (otherList.Count == 0)
            return false;
        if (this.Count == 0)
            return true;
        return (this.maxItem.Value <= otherList.maxItem.Value &&
            this.minItem.Value <= otherList.minItem.Value);
    }
    MaxAsList() {
        if (this.Count > 0)
            return new InkList(this.maxItem);
        else
            return new InkList();
    }
    MinAsList() {
        if (this.Count > 0)
            return new InkList(this.minItem);
        else
            return new InkList();
    }
    ListWithSubRange(minBound, maxBound) {
        if (this.Count == 0)
            return new InkList();
        let ordered = this.orderedItems;
        let minValue = 0;
        let maxValue = Number.MAX_SAFE_INTEGER;
        if (Number.isInteger(minBound)) {
            minValue = minBound;
        }
        else {
            if (minBound instanceof InkList && minBound.Count > 0)
                minValue = minBound.minItem.Value;
        }
        if (Number.isInteger(maxBound)) {
            maxValue = maxBound;
        }
        else {
            if (maxBound instanceof InkList && maxBound.Count > 0)
                maxValue = maxBound.maxItem.Value;
        }
        let subList = new InkList();
        subList.SetInitialOriginNames(this.originNames);
        for (let item of ordered) {
            if (item.Value >= minValue && item.Value <= maxValue) {
                subList.Add(item.Key, item.Value);
            }
        }
        return subList;
    }
    Equals(otherInkList) {
        if (otherInkList instanceof InkList === false)
            return false;
        if (otherInkList.Count != this.Count)
            return false;
        for (let [key] of this) {
            if (!otherInkList.has(key))
                return false;
        }
        return true;
    }
    // GetHashCode not implemented
    get orderedItems() {
        // List<KeyValuePair<InkListItem, int>>
        let ordered = new Array();
        for (let [key, value] of this) {
            let item = InkListItem.fromSerializedKey(key);
            ordered.push({ Key: item, Value: value });
        }
        ordered.sort((x, y) => {
            if (x.Key.originName === null) {
                return (0, NullException_1.throwNullException)("x.Key.originName");
            }
            if (y.Key.originName === null) {
                return (0, NullException_1.throwNullException)("y.Key.originName");
            }
            if (x.Value == y.Value) {
                return x.Key.originName.localeCompare(y.Key.originName);
            }
            else {
                // TODO: refactor this bit into a numberCompareTo method?
                if (x.Value < y.Value)
                    return -1;
                return x.Value > y.Value ? 1 : 0;
            }
        });
        return ordered;
    }
    get singleItem() {
        for (let item of this.orderedItems) {
            return item.Key;
        }
        return null;
    }
    toString() {
        let ordered = this.orderedItems;
        let sb = new StringBuilder_1.StringBuilder();
        for (let i = 0; i < ordered.length; i++) {
            if (i > 0)
                sb.Append(", ");
            let item = ordered[i].Key;
            if (item.itemName === null)
                return (0, NullException_1.throwNullException)("item.itemName");
            sb.Append(item.itemName);
        }
        return sb.toString();
    }
    // casting a InkList to a Number, for somereason, actually gives a number.
    // This messes up the type detection when creating a Value from a InkList.
    // Returning NaN here prevents that.
    valueOf() {
        return NaN;
    }
}
exports.InkList = InkList;
//# sourceMappingURL=InkList.js.map