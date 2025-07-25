/**
 * This interface normalize the `TryGet` behavior found in the original
 * C# project. Any `TryGet` method will return a object conforming to this
 * interface.
 *
 * The original function returns a boolean and has a second parameter called
 * item that is an `out`. Both are needed and we can't just return the item
 * because it'll always be truthy. Instead, we return an object containing
 * whether the result exists (`exists`) and the result itself (`result`).
 *
 * For instance a `TryGet` prototype would look like this:
```
TryGetItemWithValue(val: number, item: InkListItem): TryGetResult<InkListItem>{
```
 *
 * On the other hand, dealing with the result can be done in the following way:
```
var item = item.TryGetItemWithValue(intVal, InkListItem.Null);
if (item.exists) {
    console.log(item.result)
}
```
 *
 */
export interface TryGetResult<T> {
    result: T;
    exists: boolean;
}
export declare function tryGetValueFromMap<K, V>(map: Map<K, V> | null, key: K, value: V): TryGetResult<V>;
export declare function tryParseInt(value: any, defaultValue?: number): TryGetResult<number>;
export declare function tryParseFloat(value: any, defaultValue?: number): TryGetResult<number>;
