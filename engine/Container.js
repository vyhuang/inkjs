"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const Value_1 = require("./Value");
const NullException_1 = require("./NullException");
const StringBuilder_1 = require("./StringBuilder");
const Object_1 = require("./Object");
const SearchResult_1 = require("./SearchResult");
const Path_1 = require("./Path");
const Debug_1 = require("./Debug");
const TryGetResult_1 = require("./TryGetResult");
const TypeAssertion_1 = require("./TypeAssertion");
class Container extends Object_1.InkObject {
    constructor() {
        super(...arguments);
        this.name = null;
        this._content = [];
        this.namedContent = new Map();
        this.visitsShouldBeCounted = false;
        this.turnIndexShouldBeCounted = false;
        this.countingAtStartOnly = false;
        this._pathToFirstLeafContent = null;
    }
    get hasValidName() {
        return this.name != null && this.name.length > 0;
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this.AddContent(value);
    }
    get namedOnlyContent() {
        let namedOnlyContentDict = new Map();
        for (let [key, value] of this.namedContent) {
            let inkObject = (0, TypeAssertion_1.asOrThrows)(value, Object_1.InkObject);
            namedOnlyContentDict.set(key, inkObject);
        }
        for (let c of this.content) {
            let named = (0, TypeAssertion_1.asINamedContentOrNull)(c);
            if (named != null && named.hasValidName) {
                namedOnlyContentDict.delete(named.name);
            }
        }
        if (namedOnlyContentDict.size == 0)
            namedOnlyContentDict = null;
        return namedOnlyContentDict;
    }
    set namedOnlyContent(value) {
        let existingNamedOnly = this.namedOnlyContent;
        if (existingNamedOnly != null) {
            for (let [key] of existingNamedOnly) {
                this.namedContent.delete(key);
            }
        }
        if (value == null)
            return;
        for (let [, val] of value) {
            let named = (0, TypeAssertion_1.asINamedContentOrNull)(val);
            if (named != null)
                this.AddToNamedContentOnly(named);
        }
    }
    get countFlags() {
        let flags = 0;
        if (this.visitsShouldBeCounted)
            flags |= Container.CountFlags.Visits;
        if (this.turnIndexShouldBeCounted)
            flags |= Container.CountFlags.Turns;
        if (this.countingAtStartOnly)
            flags |= Container.CountFlags.CountStartOnly;
        if (flags == Container.CountFlags.CountStartOnly) {
            flags = 0;
        }
        return flags;
    }
    set countFlags(value) {
        let flag = value;
        if ((flag & Container.CountFlags.Visits) > 0)
            this.visitsShouldBeCounted = true;
        if ((flag & Container.CountFlags.Turns) > 0)
            this.turnIndexShouldBeCounted = true;
        if ((flag & Container.CountFlags.CountStartOnly) > 0)
            this.countingAtStartOnly = true;
    }
    get pathToFirstLeafContent() {
        if (this._pathToFirstLeafContent == null)
            this._pathToFirstLeafContent = this.path.PathByAppendingPath(this.internalPathToFirstLeafContent);
        return this._pathToFirstLeafContent;
    }
    get internalPathToFirstLeafContent() {
        let components = [];
        let container = this;
        while (container instanceof Container) {
            if (container.content.length > 0) {
                components.push(new Path_1.Path.Component(0));
                container = container.content[0];
            }
        }
        return new Path_1.Path(components);
    }
    AddContent(contentObjOrList) {
        if (contentObjOrList instanceof Array) {
            let contentList = contentObjOrList;
            for (let c of contentList) {
                this.AddContent(c);
            }
        }
        else {
            let contentObj = contentObjOrList;
            this._content.push(contentObj);
            if (contentObj.parent) {
                throw new Error("content is already in " + contentObj.parent);
            }
            contentObj.parent = this;
            this.TryAddNamedContent(contentObj);
        }
    }
    TryAddNamedContent(contentObj) {
        let namedContentObj = (0, TypeAssertion_1.asINamedContentOrNull)(contentObj);
        if (namedContentObj != null && namedContentObj.hasValidName) {
            this.AddToNamedContentOnly(namedContentObj);
        }
    }
    AddToNamedContentOnly(namedContentObj) {
        Debug_1.Debug.AssertType(namedContentObj, Object_1.InkObject, "Can only add Runtime.Objects to a Runtime.Container");
        let runtimeObj = (0, TypeAssertion_1.asOrThrows)(namedContentObj, Object_1.InkObject);
        runtimeObj.parent = this;
        if (namedContentObj.name === null)
            return (0, NullException_1.throwNullException)("namedContentObj.name");
        this.namedContent.set(namedContentObj.name, namedContentObj);
    }
    ContentAtPath(path, partialPathStart = 0, partialPathLength = -1) {
        if (partialPathLength == -1)
            partialPathLength = path.length;
        let result = new SearchResult_1.SearchResult();
        result.approximate = false;
        let currentContainer = this;
        let currentObj = this;
        for (let i = partialPathStart; i < partialPathLength; ++i) {
            let comp = path.GetComponent(i);
            if (currentContainer == null) {
                result.approximate = true;
                break;
            }
            let foundObj = currentContainer.ContentWithPathComponent(comp);
            // Couldn't resolve entire path?
            if (foundObj == null) {
                result.approximate = true;
                break;
            }
            // Are we about to loop into another container?
            // Is the object a container as expected? It might
            // no longer be if the content has shuffled around, so what
            // was originally a container no longer is.
            const nextContainer = (0, TypeAssertion_1.asOrNull)(foundObj, Container);
            if (i < partialPathLength - 1 && nextContainer == null) {
                result.approximate = true;
                break;
            }
            currentObj = foundObj;
            currentContainer = nextContainer;
        }
        result.obj = currentObj;
        return result;
    }
    InsertContent(contentObj, index) {
        this.content.splice(index, 0, contentObj);
        if (contentObj.parent) {
            throw new Error("content is already in " + contentObj.parent);
        }
        contentObj.parent = this;
        this.TryAddNamedContent(contentObj);
    }
    AddContentsOfContainer(otherContainer) {
        this.content.push(...otherContainer.content);
        for (let obj of otherContainer.content) {
            obj.parent = this;
            this.TryAddNamedContent(obj);
        }
    }
    ContentWithPathComponent(component) {
        if (component.isIndex) {
            if (component.index >= 0 && component.index < this.content.length) {
                return this.content[component.index];
            }
            else {
                return null;
            }
        }
        else if (component.isParent) {
            return this.parent;
        }
        else {
            if (component.name === null) {
                return (0, NullException_1.throwNullException)("component.name");
            }
            let foundContent = (0, TryGetResult_1.tryGetValueFromMap)(this.namedContent, component.name, null);
            if (foundContent.exists) {
                return (0, TypeAssertion_1.asOrThrows)(foundContent.result, Object_1.InkObject);
            }
            else {
                return null;
            }
        }
    }
    BuildStringOfHierarchy() {
        let sb;
        if (arguments.length == 0) {
            sb = new StringBuilder_1.StringBuilder();
            this.BuildStringOfHierarchy(sb, 0, null);
            return sb.toString();
        }
        sb = arguments[0];
        let indentation = arguments[1];
        let pointedObj = arguments[2];
        function appendIndentation() {
            const spacesPerIndent = 4; // Truly const in the original code
            for (let i = 0; i < spacesPerIndent * indentation; ++i) {
                sb.Append(" ");
            }
        }
        appendIndentation();
        sb.Append("[");
        if (this.hasValidName) {
            sb.AppendFormat(" ({0})", this.name);
        }
        if (this == pointedObj) {
            sb.Append("  <---");
        }
        sb.AppendLine();
        indentation++;
        for (let i = 0; i < this.content.length; ++i) {
            let obj = this.content[i];
            if (obj instanceof Container) {
                let container = obj;
                container.BuildStringOfHierarchy(sb, indentation, pointedObj);
            }
            else {
                appendIndentation();
                if (obj instanceof Value_1.StringValue) {
                    sb.Append('"');
                    sb.Append(obj.toString().replace("\n", "\\n"));
                    sb.Append('"');
                }
                else {
                    sb.Append(obj.toString());
                }
            }
            if (i != this.content.length - 1) {
                sb.Append(",");
            }
            if (!(obj instanceof Container) && obj == pointedObj) {
                sb.Append("  <---");
            }
            sb.AppendLine();
        }
        let onlyNamed = new Map();
        for (let [key, value] of this.namedContent) {
            if (this.content.indexOf((0, TypeAssertion_1.asOrThrows)(value, Object_1.InkObject)) >= 0) {
                continue;
            }
            else {
                onlyNamed.set(key, value);
            }
        }
        if (onlyNamed.size > 0) {
            appendIndentation();
            sb.AppendLine("-- named: --");
            for (let [, value] of onlyNamed) {
                Debug_1.Debug.AssertType(value, Container, "Can only print out named Containers");
                let container = value;
                container.BuildStringOfHierarchy(sb, indentation, pointedObj);
                sb.AppendLine();
            }
        }
        indentation--;
        appendIndentation();
        sb.Append("]");
    }
}
exports.Container = Container;
(function (Container) {
    let CountFlags;
    (function (CountFlags) {
        CountFlags[CountFlags["Start"] = 0] = "Start";
        CountFlags[CountFlags["Visits"] = 1] = "Visits";
        CountFlags[CountFlags["Turns"] = 2] = "Turns";
        CountFlags[CountFlags["CountStartOnly"] = 4] = "CountStartOnly";
    })(CountFlags = Container.CountFlags || (Container.CountFlags = {}));
})(Container || (exports.Container = Container = {}));
//# sourceMappingURL=Container.js.map