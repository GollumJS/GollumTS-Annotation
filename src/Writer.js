"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writer = void 0;
var Metadata_1 = require("./Metadata");
var Writer = (function () {
    function Writer() {
    }
    Writer.write = function (annotation, data, callback) {
        if (data === void 0) { data = {}; }
        if (callback === void 0) { callback = null; }
        var metadata = new Metadata_1.Metadata(annotation, data);
        return function (target, propertyKey, parameter) {
            if (propertyKey === void 0) { propertyKey = null; }
            if (parameter === void 0) { parameter = null; }
            parameter = isNaN(parameter) ? null : parameter;
            var annotations = Writer.annotations.get(target);
            if (!annotations) {
                annotations = {
                    clazz: [],
                    properties: {},
                    parameters: {},
                    cache: {}
                };
                Writer.annotations.set(target, annotations);
            }
            if (parameter !== null) {
                if (!annotations.parameters[propertyKey]) {
                    annotations.parameters[propertyKey] = {};
                }
                if (!annotations.parameters[propertyKey][parameter]) {
                    annotations.parameters[propertyKey][parameter] = [];
                }
                annotations.parameters[propertyKey][parameter].push(metadata);
            }
            else if (propertyKey) {
                if (!annotations.properties[propertyKey]) {
                    annotations.properties[propertyKey] = [];
                }
                annotations.properties[propertyKey].push(metadata);
            }
            else {
                annotations.clazz.push(metadata);
            }
            if (callback) {
                var result = callback(target, propertyKey, parameter);
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