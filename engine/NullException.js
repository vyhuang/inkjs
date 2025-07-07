"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwNullException = exports.NullException = void 0;
/**
 * In the original C# code, a SystemException would be thrown when passing
 * null to methods expected a valid instance. Javascript has no such
 * concept, but TypeScript will not allow `null` to be passed to methods
 * explicitely requiring a valid type.
 *
 * Whenever TypeScript complain about the possibility of a `null` value,
 * check the offending value and it it's null, throw this exception using
 * `throwNullException(name: string)`.
 */
class NullException extends Error {
}
exports.NullException = NullException;
/**
 * Throw a NullException.
 *
 * @param name a short description of the offending value (often its name within the code).
 */
function throwNullException(name) {
    throw new NullException(`${name} is null or undefined`);
}
exports.throwNullException = throwNullException;
//# sourceMappingURL=NullException.js.map