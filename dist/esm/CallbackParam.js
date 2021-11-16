"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callback = exports.CallbackParamObject = void 0;
class CallbackParamObject {
    constructor(callback) {
        this._callback = callback;
    }
    get callback() {
        return this._callback;
    }
}
exports.CallbackParamObject = CallbackParamObject;
function Callback(callback) {
    return new CallbackParamObject(callback);
}
exports.Callback = Callback;
//# sourceMappingURL=CallbackParam.js.map