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
            if (!target.hasOwnProperty('__gts_annotations__')) {
                target.__gts_annotations__ = {
                    clazz: [],
                    properties: {},
                    cache: {}
                };
            }
            if (propertyKey) {
                if (!target.__gts_annotations__.properties.hasOwnProperty(propertyKey)) {
                    target.__gts_annotations__.properties[propertyKey] = [];
                }
                target.__gts_annotations__.properties[propertyKey].push(metadata);
            }
            else {
                target.__gts_annotations__.clazz.push(metadata);
            }
            if (callback) {
                var result = callback(target, propertyKey, descriptor);
                if (result) {
                    return result;
                }
            }
        };
    };
    return Writer;
}());
exports.Writer = Writer;
//# sourceMappingURL=Writer.js.map