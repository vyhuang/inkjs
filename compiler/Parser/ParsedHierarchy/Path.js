"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
const TypeAssertion_1 = require("../../../engine/TypeAssertion");
const FlowBase_1 = require("./Flow/FlowBase");
const FlowLevel_1 = require("./Flow/FlowLevel");
const Weave_1 = require("./Weave");
class Path {
    get baseTargetLevel() {
        if (this.baseLevelIsAmbiguous) {
            return FlowLevel_1.FlowLevel.Story;
        }
        return this._baseTargetLevel;
    }
    get baseLevelIsAmbiguous() {
        return !this._baseTargetLevel;
    }
    get firstComponent() {
        if (this.components == null || !this.components.length) {
            return null;
        }
        return this.components[0].name;
    }
    get numberOfComponents() {
        return this.components ? this.components.length : 0;
    }
    get dotSeparatedComponents() {
        if (this._dotSeparatedComponents == null) {
            this._dotSeparatedComponents = (this.components ? this.components : [])
                .map((c) => c.name)
                .filter(TypeAssertion_1.filterUndef)
                .join(".");
        }
        return this._dotSeparatedComponents;
    }
    constructor(argOne, argTwo) {
        this._dotSeparatedComponents = null;
        this.toString = () => {
            if (this.components === null || this.components.length === 0) {
                if (this.baseTargetLevel === FlowLevel_1.FlowLevel.WeavePoint) {
                    return "-> <next gather point>";
                }
                return "<invalid Path>";
            }
            return `-> ${this.dotSeparatedComponents}`;
        };
        this.ResolveFromContext = (context) => {
            if (this.components == null || this.components.length == 0) {
                return null;
            }
            // Find base target of path from current context. e.g.
            //   ==> BASE.sub.sub
            let baseTargetObject = this.ResolveBaseTarget(context);
            if (baseTargetObject === null) {
                return null;
            }
            // Given base of path, resolve final target by working deeper into hierarchy
            //  e.g. ==> base.mid.FINAL
            if (this.components.length > 1) {
                return this.ResolveTailComponents(baseTargetObject);
            }
            return baseTargetObject;
        };
        // Find the root object from the base, i.e. root from:
        //    root.sub1.sub2
        this.ResolveBaseTarget = (originalContext) => {
            const firstComp = this.firstComponent;
            // Work up the ancestry to find the node that has the named object
            let ancestorContext = originalContext;
            while (ancestorContext) {
                // Only allow deep search when searching deeper from original context.
                // Don't allow search upward *then* downward, since that's searching *everywhere*!
                // Allowed examples:
                //  - From an inner gather of a stitch, you should search up to find a knot called 'x'
                //    at the root of a story, but not a stitch called 'x' in that knot.
                //  - However, from within a knot, you should be able to find a gather/choice
                //    anywhere called 'x'
                // (that latter example is quite loose, but we allow it)
                const deepSearch = ancestorContext === originalContext;
                const foundBase = this.GetChildFromContext(ancestorContext, firstComp, null, deepSearch);
                if (foundBase) {
                    return foundBase;
                }
                ancestorContext = ancestorContext.parent;
            }
            return null;
        };
        // Find the final child from path given root, i.e.:
        //   root.sub.finalChild
        this.ResolveTailComponents = (rootTarget) => {
            let foundComponent = rootTarget;
            if (!this.components)
                return null;
            for (let ii = 1; ii < this.components.length; ++ii) {
                const compName = this.components[ii].name;
                let minimumExpectedLevel;
                let foundFlow = (0, TypeAssertion_1.asOrNull)(foundComponent, FlowBase_1.FlowBase);
                if (foundFlow !== null) {
                    minimumExpectedLevel = (foundFlow.flowLevel + 1);
                }
                else {
                    minimumExpectedLevel = FlowLevel_1.FlowLevel.WeavePoint;
                }
                foundComponent = this.GetChildFromContext(foundComponent, compName, minimumExpectedLevel);
                if (foundComponent === null) {
                    break;
                }
            }
            return foundComponent;
        };
        // See whether "context" contains a child with a given name at a given flow level
        // Can either be a named knot/stitch (a FlowBase) or a weave point within a Weave (Choice or Gather)
        // This function also ignores any other object types that are neither FlowBase nor Weave.
        // Called from both ResolveBase (force deep) and ResolveTail for the individual components.
        this.GetChildFromContext = (context, childName, minimumLevel, forceDeepSearch = false) => {
            // null childLevel means that we don't know where to find it
            const ambiguousChildLevel = minimumLevel === null;
            // Search for WeavePoint within Weave
            const weaveContext = (0, TypeAssertion_1.asOrNull)(context, Weave_1.Weave);
            if (childName &&
                weaveContext !== null &&
                (ambiguousChildLevel || minimumLevel === FlowLevel_1.FlowLevel.WeavePoint)) {
                return weaveContext.WeavePointNamed(childName);
            }
            // Search for content within Flow (either a sub-Flow or a WeavePoint)
            let flowContext = (0, TypeAssertion_1.asOrNull)(context, FlowBase_1.FlowBase);
            if (childName && flowContext !== null) {
                // When searching within a Knot, allow a deep searches so that
                // named weave points (choices and gathers) can be found within any stitch
                // Otherwise, we just search within the immediate object.
                const shouldDeepSearch = forceDeepSearch || flowContext.flowLevel === FlowLevel_1.FlowLevel.Knot;
                return flowContext.ContentWithNameAtLevel(childName, minimumLevel, shouldDeepSearch);
            }
            return null;
        };
        if (Object.values(FlowLevel_1.FlowLevel).includes(argOne)) {
            this._baseTargetLevel = argOne;
            this.components = argTwo || [];
        }
        else if (Array.isArray(argOne)) {
            this._baseTargetLevel = null;
            this.components = argOne || [];
        }
        else {
            this._baseTargetLevel = null;
            this.components = [argOne];
        }
    }
    get typeName() {
        return "Path";
    }
}
exports.Path = Path;
//# sourceMappingURL=Path.js.map