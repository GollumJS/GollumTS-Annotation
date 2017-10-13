"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metadata_1 = require("./Metadata");
var CallbackParam_1 = require("./CallbackParam");
var Reader = (function () {
    function Reader() {
    }
    Reader.getClassAnnotations = function (clazz) {
        if (!clazz.hasOwnProperty('__metadata__')) {
            return [];
        }
        return Array.prototype.concat.call(clazz.__metadata__.clazz, []).map(Reader.unCallback);
    };
    Reader.getClassAnnotation = function (clazz, annotation) {
        return this.search(this.getClassAnnotations(clazz), annotation);
    };
    Reader.getPropertyAnnotations = function (clazz, name) {
        if (!clazz.hasOwnProperty('__metadata__')) {
            return [];
        }
        if (clazz.__metadata__.properties.hasOwnProperty(name)) {
            return Array.prototype.concat.call(clazz.__metadata__.properties[name], []).map(Reader.unCallback);
        }
        return [];
    };
    Reader.getPropertyAnnotation = function (clazz, name, annotation) {
        return this.search(this.getPropertyAnnotations(clazz, name), annotation);
    };
    Reader.getPropertiesNameWithAnnotations = function (clazz) {
        var properties = [];
        if (clazz.hasOwnProperty('__metadata__')) {
            for (var prop in clazz.__metadata__.properties) {
                if (properties.indexOf(prop) == -1) {
                    properties.push(prop);
                }
            }
        }
        return properties;
    };
    Reader.getPropertiesNameByAnnotations = function (clazz, annotations) {
        if (!Array.isArray(annotations)) {
            annotations = [annotations];
        }
        var properties = [];
        if (clazz.hasOwnProperty('__metadata__')) {
            for (var prop in clazz.__metadata__.properties) {
                var metadatas = clazz.__metadata__.properties[prop];
                for (var _i = 0, metadatas_1 = metadatas; _i < metadatas_1.length; _i++) {
                    var m = metadatas_1[_i];
                    if (annotations.indexOf(m.annotation) != -1) {
                        if (properties.indexOf(prop) == -1) {
                            properties.push(prop);
                        }
                        break;
                    }
                }
            }
        }
        return properties;
    };
    Reader.findClassAnnotations = function (clazz) {
        if (clazz == null) {
            return [];
        }
        var annotations = this.getClassAnnotations(clazz);
        if (typeof clazz.prototype !== 'undefined') {
            annotations = annotations.concat(this.findClassAnnotations(clazz.prototype));
        }
        return annotations.concat(this.findClassAnnotations(Object.getPrototypeOf(clazz)));
    };
    Reader.findClassAnnotation = function (clazz, annotation) {
        return this.search(this.findClassAnnotations(clazz), annotation);
    };
    Reader.findPropertyAnnotations = function (clazz, name) {
        if (clazz == null) {
            return [];
        }
        var annotations = this.getPropertyAnnotations(clazz, name);
        if (typeof clazz.prototype !== 'undefined') {
            annotations = annotations.concat(this.findPropertyAnnotations(clazz.prototype, name));
        }
        return annotations.concat(this.findPropertyAnnotations(Object.getPrototypeOf(clazz), name));
    };
    Reader.findPropertyAnnotation = function (clazz, name, annotation) {
        return this.search(this.findPropertyAnnotations(clazz, name), annotation);
    };
    Reader.findPropertiesNameWithAnnotations = function (clazz) {
        if (clazz == null) {
            return [];
        }
        var properties = this.getPropertiesNameWithAnnotations(clazz);
        if (typeof clazz.prototype !== 'undefined') {
            properties = properties.concat(this.findPropertiesNameWithAnnotations(clazz.prototype));
        }
        return properties.concat(this.findPropertiesNameWithAnnotations(Object.getPrototypeOf(clazz)));
    };
    Reader.findPropertiesNameByAnnotations = function (clazz, annotations) {
        if (clazz == null) {
            return [];
        }
        var properties = this.getPropertiesNameByAnnotations(clazz, annotations);
        if (typeof clazz.prototype !== 'undefined') {
            properties = properties.concat(this.findPropertiesNameByAnnotations(clazz.prototype, annotations));
        }
        return properties.concat(this.findPropertiesNameByAnnotations(Object.getPrototypeOf(clazz), annotations));
    };
    Reader.unCallback = function (metadata) {
        var data = {};
        for (var key in metadata.data) {
            if (metadata.data[key] instanceof CallbackParam_1.CallbackParamObject) {
                data[key] = metadata.data[key].callback();
            }
            else {
                data[key] = metadata.data[key];
            }
        }
        return new Metadata_1.Metadata(metadata.annotation, data);
    };
    Reader.search = function (list, annotation) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var metadata = list_1[_i];
            if (metadata.annotation == annotation) {
                return metadata.data;
            }
        }
        return null;
    };
    return Reader;
}());
exports.Reader = Reader;
//# sourceMappingURL=Reader.js.map