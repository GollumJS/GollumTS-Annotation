"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metadata_1 = require("./Metadata");
var Writer = (function () {
    function Writer() {
    }
    Writer.write = function (annotation, data, callback) {
        if (data === void 0) { data = {}; }
        if (callback === void 0) { callback = null; }
        var metadata = new Metadata_1.Metadata(annotation, data);
        return function (target, propertyKey, descriptor) {
            if (propertyKey === void 0) { propertyKey = null; }
            if (descriptor === void 0) { descriptor = null; }
            if (!target.hasOwnProperty('__metadata__')) {
                target.__metadata__ = {
                    clazz: [],
                    properties: {}
                };
            }
            if (propertyKey) {
                if (!target.__metadata__.properties.hasOwnProperty(propertyKey)) {
                    target.__metadata__.properties[propertyKey] = [];
                }
                target.__metadata__.properties[propertyKey].push(metadata);
            }
            else {
                target.__metadata__.clazz.push(metadata);
            }
            if (callback) {
                callback(target, propertyKey, descriptor);
            }
        };
    };
    return Writer;
}());
exports.Writer = Writer;
//# sourceMappingURL=Writer.js.map