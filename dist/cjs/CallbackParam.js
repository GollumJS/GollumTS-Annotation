"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Callback = exports.CallbackParamObject = void 0;
var CallbackParamObject = (function () {
    function CallbackParamObject(callback) {
        this._callback = callback;
    }
    Object.defineProperty(CallbackParamObject.prototype, "callback", {
        get: function () {
            return this._callback;
        },
        enumerable: false,
        configurable: true
    });
    return CallbackParamObject;
}());
exports.CallbackParamObject = CallbackParamObject;
function Callback(callback) {
    return new CallbackParamObject(callback);
}
exports.Callback = Callback;
//# sourceMappingURL=CallbackParam.js.map