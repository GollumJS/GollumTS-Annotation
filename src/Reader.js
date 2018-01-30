"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Metadata_1 = require("./Metadata");
var CallbackParam_1 = require("./CallbackParam");
var Reader = (function () {
    function Reader() {
    }
    Reader.getClassAnnotations = function (clazz) {
        if (!clazz.hasOwnProperty('__gts_annotations__')) {
            return [];
        }
        return Array.prototype.concat.call(clazz.__gts_annotations__.clazz, []).map(Reader.unCallback);
    };
    Reader.getClassAnnotation = function (clazz, annotation) {
        return this.search(this.getClassAnnotations(clazz), annotation);
    };
    Reader.getPropertyAnnotations = function (clazz, name) {
        if (!clazz.hasOwnProperty('__gts_annotations__')) {
            return [];
        }
        if (clazz.__gts_annotations__.properties.hasOwnProperty(name)) {
            return Array.prototype.concat.call(clazz.__gts_annotations__.properties[name], []).map(Reader.unCallback);
        }
        return [];
    };
    Reader.getPropertyAnnotation = function (clazz, name, annotation) {
        return this.search(this.getPropertyAnnotations(clazz, name), annotation);
    };
    Reader.getPropertiesNameWithAnnotations = function (clazz) {
        if (clazz.hasOwnProperty('__gts_annotations__')) {
            return Object.keys(clazz.__gts_annotations__.properties)
                .filter(function (v, i, a) { return a.indexOf(v) === i; });
        }
        return [];
    };
    Reader.getPropertiesNameByAnnotation = function (clazz, annotation) {
        var properties = [];
        if (clazz.hasOwnProperty('__gts_annotations__')) {
            for (var _i = 0, _a = Object.keys(clazz.__gts_annotations__.properties); _i < _a.length; _i++) {
                var prop = _a[_i];
                var metadatas = clazz.__gts_annotations__.properties[prop];
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
        if (!clazz.hasOwnProperty('__gts_annotations__')) {
            clazz.__gts_annotations__ = {
                clazz: [],
                properties: {},
                cache: {}
            };
        }
        if (!clazz.__gts_annotations__.cache.clazz) {
            var annotations = this.getClassAnnotations(clazz);
            if (typeof clazz.prototype !== 'undefined') {
                annotations = annotations.concat(this.findClassAnnotations(clazz.prototype));
            }
            clazz.__gts_annotations__.cache.clazz = annotations.concat(this.findClassAnnotations(Object.getPrototypeOf(clazz)));
        }
        return clazz.__gts_annotations__.cache.clazz;
    };
    Reader.findClassAnnotation = function (clazz, annotation) {
        return this.search(this.findClassAnnotations(clazz), annotation);
    };
    Reader.findPropertyAnnotations = function (clazz, name) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        if (!clazz.hasOwnProperty('__gts_annotations__')) {
            clazz.__gts_annotations__ = {
                clazz: [],
                properties: {},
                cache: {}
            };
        }
        if (!clazz.__gts_annotations__.cache.properties) {
            clazz.__gts_annotations__.cache.properties = {};
        }
        if (!clazz.__gts_annotations__.cache.properties[name]) {
            var annotations = this.getPropertyAnnotations(clazz, name);
            if (typeof clazz.prototype !== 'undefined') {
                annotations = annotations.concat(this.findPropertyAnnotations(clazz.prototype, name));
            }
            clazz.__gts_annotations__.cache.properties[name] = annotations.concat(this.findPropertyAnnotations(Object.getPrototypeOf(clazz), name));
        }
        return clazz.__gts_annotations__.cache.properties[name];
    };
    Reader.findPropertyAnnotation = function (clazz, name, annotation) {
        return this.search(this.findPropertyAnnotations(clazz, name), annotation);
    };
    Reader.findPropertiesNameWithAnnotations = function (clazz) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        if (!clazz.hasOwnProperty('__gts_annotations__')) {
            clazz.__gts_annotations__ = {
                clazz: [],
                properties: {},
                cache: {}
            };
        }
        if (!clazz.__gts_annotations__.cache.properties_with) {
            var properties = this.getPropertiesNameWithAnnotations(clazz);
            if (typeof clazz.prototype !== 'undefined') {
                properties = properties.concat(this.findPropertiesNameWithAnnotations(clazz.prototype));
            }
            clazz.__gts_annotations__.cache.properties_with = properties
                .concat(this.findPropertiesNameWithAnnotations(Object.getPrototypeOf(clazz)))
                .filter(function (v, i, a) { return a.indexOf(v) === i; });
        }
        return clazz.__gts_annotations__.cache.properties_with;
    };
    Reader.findPropertiesNameByAnnotation = function (clazz, annotation) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        if (!clazz.hasOwnProperty('__gts_annotations__')) {
            clazz.__gts_annotations__ = {
                clazz: [],
                properties: {},
                cache: {}
            };
        }
        if (!clazz.__gts_annotations__.cache.properties_by) {
            clazz.__gts_annotations__.cache.properties_by = [];
        }
        var searched = clazz.__gts_annotations__.cache.properties_by
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
        clazz.__gts_annotations__.cache.properties_by.push({
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