"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
var Metadata = (function () {
    function Metadata(annotation, data) {
        this._annotation = annotation;
        this._data = data;
    }
    Object.defineProperty(Metadata.prototype, "annotation", {
        get: function () {
            return this._annotation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Metadata.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    return Metadata;
}());
exports.Metadata = Metadata;
//# sourceMappingURL=Metadata.js.map