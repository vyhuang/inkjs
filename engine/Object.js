"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InkObject = void 0;
const Path_1 = require("./Path");
const Container_1 = require("./Container");
const Debug_1 = require("./Debug");
const TypeAssertion_1 = require("./TypeAssertion");
const NullException_1 = require("./NullException");
class InkObject {
    constructor() {
        this.parent = null;
        this._debugMetadata = null;
        this._path = null;
    }
    get debugMetadata() {
        if (this._debugMetadata === null) {
            if (this.parent) {
                return this.parent.debugMetadata;
            }
        }
        return this._debugMetadata;
    }
    set debugMetadata(value) {
        this._debugMetadata = value;
    }
    get ownDebugMetadata() {
        return this._debugMetadata;
    }
    DebugLineNumberOfPath(path) {
        if (path === null)
            return null;
        // Try to get a line number from debug metadata
        let root = this.rootContentContainer;
        if (root) {
            let targetContent = root.ContentAtPath(path).obj;
            if (targetContent) {
                let dm = targetContent.debugMetadata;
                if (dm !== null) {
                    return dm.startLineNumber;
                }
            }
        }
        return null;
    }
    get path() {
        if (this._path == null) {
            if (this.parent == null) {
                this._path = new Path_1.Path();
            }
            else {
                let comps = [];
                let child = this;
                let container = (0, TypeAssertion_1.asOrNull)(child.parent, Container_1.Container);
                while (container !== null) {
                    let namedChild = (0, TypeAssertion_1.asINamedContentOrNull)(child);
                    if (namedChild != null && namedChild.hasValidName) {
                        if (namedChild.name === null)
                            return (0, NullException_1.throwNullException)("namedChild.name");
                        comps.unshift(new Path_1.Path.Component(namedChild.name));
                    }
                    else {
                        comps.unshift(new Path_1.Path.Component(container.content.indexOf(child)));
                    }
                    child = container;
                    container = (0, TypeAssertion_1.asOrNull)(container.parent, Container_1.Container);
                }
                this._path = new Path_1.Path(comps);
            }
        }
        return this._path;
    }
    ResolvePath(path) {
        if (path === null)
            return (0, NullException_1.throwNullException)("path");
        if (path.isRelative) {
            let nearestContainer = (0, TypeAssertion_1.asOrNull)(this, Container_1.Container);
            if (nearestContainer === null) {
                Debug_1.Debug.Assert(this.parent !== null, "Can't resolve relative path because we don't have a parent");
                nearestContainer = (0, TypeAssertion_1.asOrNull)(this.parent, Container_1.Container);
                Debug_1.Debug.Assert(nearestContainer !== null, "Expected parent to be a container");
                Debug_1.Debug.Assert(path.GetComponent(0).isParent);
                path = path.tail;
            }
            if (nearestContainer === null) {
                return (0, NullException_1.throwNullException)("nearestContainer");
            }
            return nearestContainer.ContentAtPath(path);
        }
        else {
            let contentContainer = this.rootContentContainer;
            if (contentContainer === null) {
                return (0, NullException_1.throwNullException)("contentContainer");
            }
            return contentContainer.ContentAtPath(path);
        }
    }
    ConvertPathToRelative(globalPath) {
        let ownPath = this.path;
        let minPathLength = Math.min(globalPath.length, ownPath.length);
        let lastSharedPathCompIndex = -1;
        for (let i = 0; i < minPathLength; ++i) {
            let ownComp = ownPath.GetComponent(i);
            let otherComp = globalPath.GetComponent(i);
            if (ownComp.Equals(otherComp)) {
                lastSharedPathCompIndex = i;
            }
            else {
                break;
            }
        }
        // No shared path components, so just use global path
        if (lastSharedPathCompIndex == -1)
            return globalPath;
        let numUpwardsMoves = ownPath.componentCount - 1 - lastSharedPathCompIndex;
        let newPathComps = [];
        for (let up = 0; up < numUpwardsMoves; ++up)
            newPathComps.push(Path_1.Path.Component.ToParent());
        for (let down = lastSharedPathCompIndex + 1; down < globalPath.componentCount; ++down)
            newPathComps.push(globalPath.GetComponent(down));
        let relativePath = new Path_1.Path(newPathComps, true);
        return relativePath;
    }
    CompactPathString(otherPath) {
        let globalPathStr = null;
        let relativePathStr = null;
        if (otherPath.isRelative) {
            relativePathStr = otherPath.componentsString;
            globalPathStr = this.path.PathByAppendingPath(otherPath).componentsString;
        }
        else {
            let relativePath = this.ConvertPathToRelative(otherPath);
            relativePathStr = relativePath.componentsString;
            globalPathStr = otherPath.componentsString;
        }
        if (relativePathStr.length < globalPathStr.length)
            return relativePathStr;
        else
            return globalPathStr;
    }
    get rootContentContainer() {
        let ancestor = this;
        while (ancestor.parent) {
            ancestor = ancestor.parent;
        }
        return (0, TypeAssertion_1.asOrNull)(ancestor, Container_1.Container);
    }
    Copy() {
        throw Error("Not Implemented: Doesn't support copying");
    }
    // SetChild works slightly diferently in the js implementation.
    // Since we can't pass an objets property by reference, we instead pass
    // the object and the property string.
    // TODO: This method can probably be rewritten with type-safety in mind.
    SetChild(obj, prop, value) {
        if (obj[prop])
            obj[prop] = null;
        obj[prop] = value;
        if (obj[prop])
            obj[prop].parent = this;
    }
    Equals(obj) {
        return obj === this;
    }
}
exports.InkObject = InkObject;
//# sourceMappingURL=Object.js.map