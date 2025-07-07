"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
class Path {
    constructor() {
        this._components = [];
        this._componentsString = null;
        this._isRelative = false;
        if (typeof arguments[0] == "string") {
            let componentsString = arguments[0];
            this.componentsString = componentsString;
        }
        else if (arguments[0] instanceof Path.Component &&
            arguments[1] instanceof Path) {
            let head = arguments[0];
            let tail = arguments[1];
            this._components.push(head);
            this._components = this._components.concat(tail._components);
        }
        else if (arguments[0] instanceof Array) {
            let head = arguments[0];
            let relative = !!arguments[1];
            this._components = this._components.concat(head);
            this._isRelative = relative;
        }
    }
    get isRelative() {
        return this._isRelative;
    }
    get componentCount() {
        return this._components.length;
    }
    get head() {
        if (this._components.length > 0) {
            return this._components[0];
        }
        else {
            return null;
        }
    }
    get tail() {
        if (this._components.length >= 2) {
            // careful, the original code uses length-1 here. This is because the second argument of
            // List.GetRange is a number of elements to extract, wherease Array.slice uses an index
            let tailComps = this._components.slice(1, this._components.length);
            return new Path(tailComps);
        }
        else {
            return Path.self;
        }
    }
    get length() {
        return this._components.length;
    }
    get lastComponent() {
        let lastComponentIdx = this._components.length - 1;
        if (lastComponentIdx >= 0) {
            return this._components[lastComponentIdx];
        }
        else {
            return null;
        }
    }
    get containsNamedComponent() {
        for (let i = 0, l = this._components.length; i < l; i++) {
            if (!this._components[i].isIndex) {
                return true;
            }
        }
        return false;
    }
    static get self() {
        let path = new Path();
        path._isRelative = true;
        return path;
    }
    GetComponent(index) {
        return this._components[index];
    }
    PathByAppendingPath(pathToAppend) {
        let p = new Path();
        let upwardMoves = 0;
        for (let i = 0; i < pathToAppend._components.length; ++i) {
            if (pathToAppend._components[i].isParent) {
                upwardMoves++;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < this._components.length - upwardMoves; ++i) {
            p._components.push(this._components[i]);
        }
        for (let i = upwardMoves; i < pathToAppend._components.length; ++i) {
            p._components.push(pathToAppend._components[i]);
        }
        return p;
    }
    get componentsString() {
        if (this._componentsString == null) {
            this._componentsString = this._components.join(".");
            if (this.isRelative)
                this._componentsString = "." + this._componentsString;
        }
        return this._componentsString;
    }
    set componentsString(value) {
        this._components.length = 0;
        this._componentsString = value;
        if (this._componentsString == null || this._componentsString == "")
            return;
        if (this._componentsString[0] == ".") {
            this._isRelative = true;
            this._componentsString = this._componentsString.substring(1);
        }
        let componentStrings = this._componentsString.split(".");
        for (let str of componentStrings) {
            // we need to distinguish between named components that start with a number, eg "42somewhere", and indexed components
            // the normal parseInt won't do for the detection because it's too relaxed.
            // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
            if (/^(\-|\+)?([0-9]+|Infinity)$/.test(str)) {
                this._components.push(new Path.Component(parseInt(str)));
            }
            else {
                this._components.push(new Path.Component(str));
            }
        }
    }
    toString() {
        return this.componentsString;
    }
    Equals(otherPath) {
        if (otherPath == null)
            return false;
        if (otherPath._components.length != this._components.length)
            return false;
        if (otherPath.isRelative != this.isRelative)
            return false;
        // the original code uses SequenceEqual here, so we need to iterate over the components manually.
        for (let i = 0, l = otherPath._components.length; i < l; i++) {
            // it's not quite clear whether this test should use Equals or a simple == operator,
            // see https://github.com/y-lohse/inkjs/issues/22
            if (!otherPath._components[i].Equals(this._components[i]))
                return false;
        }
        return true;
    }
    PathByAppendingComponent(c) {
        let p = new Path();
        p._components.push(...this._components);
        p._components.push(c);
        return p;
    }
}
exports.Path = Path;
Path.parentId = "^";
(function (Path) {
    class Component {
        constructor(indexOrName) {
            this.index = -1;
            this.name = null;
            if (typeof indexOrName == "string") {
                this.name = indexOrName;
            }
            else {
                this.index = indexOrName;
            }
        }
        get isIndex() {
            return this.index >= 0;
        }
        get isParent() {
            return this.name == Path.parentId;
        }
        static ToParent() {
            return new Component(Path.parentId);
        }
        toString() {
            if (this.isIndex) {
                return this.index.toString();
            }
            else {
                return this.name;
            }
        }
        Equals(otherComp) {
            if (otherComp != null && otherComp.isIndex == this.isIndex) {
                if (this.isIndex) {
                    return this.index == otherComp.index;
                }
                else {
                    return this.name == otherComp.name;
                }
            }
            return false;
        }
    }
    Path.Component = Component;
})(Path || (exports.Path = Path = {}));
//# sourceMappingURL=Path.js.map