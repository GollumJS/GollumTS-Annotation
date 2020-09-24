"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metadata_1 = require("./Metadata");
var CallbackParam_1 = require("./CallbackParam");
var Writer_1 = require("./Writer");
var Reader = (function () {
    function Reader() {
    }
    Reader.getClassAnnotations = function (clazz) {
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            return [];
        }
        return Array.prototype.concat.call(annotationsMap.clazz, []).map(Reader.unCallback);
    };
    Reader.getClassAnnotation = function (clazz, annotation) {
        return this.search(this.getClassAnnotations(clazz), annotation);
    };
    Reader.getPropertyAnnotations = function (clazz, name) {
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            return [];
        }
        if (annotationsMap.properties.hasOwnProperty(name)) {
            return Array.prototype.concat.call(annotationsMap.properties[name], []).map(Reader.unCallback);
        }
        return [];
    };
    Reader.getPropertyAnnotation = function (clazz, name, annotation) {
        return this.search(this.getPropertyAnnotations(clazz, name), annotation);
    };
    Reader.getPropertiesNameWithAnnotations = function (clazz) {
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (annotationsMap) {
            return Object.keys(annotationsMap.properties)
                .filter(function (v, i, a) { return a.indexOf(v) === i; });
        }
        return [];
    };
    Reader.getPropertiesNameByAnnotation = function (clazz, annotation) {
        var properties = [];
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (annotationsMap) {
            for (var _i = 0, _a = Object.keys(annotationsMap.properties); _i < _a.length; _i++) {
                var prop = _a[_i];
                var metadatas = annotationsMap.properties[prop];
                for (var _b = 0, metadatas_1 = metadatas; _b < metadatas_1.length; _b++) {
                    var m = metadatas_1[_b];
                    if (annotation == m.annotation) {
                        properties.push(prop);
                        break;
                    }
                }
            }
        }
        return properties.filter(function (v, i, a) { return a.indexOf(v) === i; });
    };
    Reader.findClassAnnotations = function (clazz) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.clazz) {
            var annotations = this.getClassAnnotations(clazz);
            if (typeof clazz.prototype !== 'undefined') {
                annotations = annotations.concat(this.findClassAnnotations(clazz.prototype));
            }
            annotationsMap.cache.clazz = annotations.concat(this.findClassAnnotations(Object.getPrototypeOf(clazz)));
        }
        return annotationsMap.cache.clazz;
    };
    Reader.findClassAnnotation = function (clazz, annotation) {
        return this.search(this.findClassAnnotations(clazz), annotation);
    };
    Reader.findPropertyAnnotations = function (clazz, name) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties) {
            annotationsMap.cache.properties = {};
        }
        if (!annotationsMap.cache.properties['__' + name]) {
            var annotations = this.getPropertyAnnotations(clazz, name);
            if (typeof clazz.prototype !== 'undefined') {
                annotations = annotations.concat(this.findPropertyAnnotations(clazz.prototype, name));
            }
            annotationsMap.cache.properties['__' + name] = annotations.concat(this.findPropertyAnnotations(Object.getPrototypeOf(clazz), name));
        }
        return annotationsMap.cache.properties['__' + name];
    };
    Reader.findPropertyAnnotation = function (clazz, name, annotation) {
        return this.search(this.findPropertyAnnotations(clazz, name), annotation);
    };
    Reader.findPropertiesNameWithAnnotations = function (clazz) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_with) {
            var properties = this.getPropertiesNameWithAnnotations(clazz);
            if (typeof clazz.prototype !== 'undefined') {
                properties = properties.concat(this.findPropertiesNameWithAnnotations(clazz.prototype));
            }
            annotationsMap.cache.properties_with = properties
                .concat(this.findPropertiesNameWithAnnotations(Object.getPrototypeOf(clazz)))
                .filter(function (v, i, a) { return a.indexOf(v) === i; });
        }
        return annotationsMap.cache.properties_with;
    };
    Reader.findPropertiesNameByAnnotation = function (clazz, annotation) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_by) {
            annotationsMap.cache.properties_by = [];
        }
        var searched = annotationsMap.cache.properties_by
            .filter(function (propertiesBy) { return propertiesBy.annotation == annotation; });
        if (searched.length) {
            return searched[0].properties;
        }
        var properties = this.getPropertiesNameByAnnotation(clazz, annotation);
        if (typeof clazz.prototype !== 'undefined') {
            properties = properties
                .concat(this.findPropertiesNameByAnnotation(clazz.prototype, annotation));
        }
        properties = properties.concat(this.findPropertiesNameByAnnotation(Object.getPrototypeOf(clazz), annotation)
            .filter(function (v, i, a) { return a.indexOf(v) === i; }));
        annotationsMap.cache.properties_by.push({
            annotation: annotation,
            properties: properties,
        });
        return properties;
    };
    Reader.findPropertiesNameByAnnotations = function (clazz, annotations) {
        var properties = [];
        for (var _i = 0, annotations_1 = annotations; _i < annotations_1.length; _i++) {
            var a = annotations_1[_i];
            properties = properties.concat(this.findPropertiesNameByAnnotation(clazz, a));
        }
        properties = properties.filter(function (v, i, a) { return a.indexOf(v) === i; });
        return properties;
    };
    Reader.unCallback = function (metadata) {
        for (var key in metadata.data) {
            if (metadata.data[key] instanceof CallbackParam_1.CallbackParamObject) {
                metadata.data[key] = metadata.data[key].callback();
            }
            else {
                metadata.data[key] = metadata.data[key];
            }
        }
        return new Metadata_1.Metadata(metadata.annotation, metadata.data);
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