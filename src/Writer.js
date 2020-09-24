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
            var annotations = Writer.annotations.get(target);
            if (!annotations) {
                annotations = {
                    clazz: [],
                    properties: {},
                    cache: {}
                };
                Writer.annotations.set(target, annotations);
            }
            if (propertyKey) {
                if (!annotations.properties.hasOwnProperty(propertyKey)) {
                    annotations.properties[propertyKey] = [];
                }
                annotations.properties[propertyKey].push(metadata);
            }
            else {
                annotations.clazz.push(metadata);
            }
            if (callback) {
                var result = callback(target, propertyKey, descriptor);
                if (result) {
                    return result;
                }
            }
        };
    };
    Writer.annotations = new Map();
    return Writer;
}());
exports.Writer = Writer;
//# sourceMappingURL=Writer.js.map