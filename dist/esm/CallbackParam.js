export class CallbackParamObject {
    constructor(callback) {
        this._callback = callback;
    }
    get callback() {
        return this._callback;
    }
}
export function Callback(callback) {
    return new CallbackParamObject(callback);
}
//# sourceMappingURL=CallbackParam.js.map