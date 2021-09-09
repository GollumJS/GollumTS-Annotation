"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reader = void 0;
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
        return Array.from(annotationsMap.clazz).concat([]).map(Reader.unCallback);
    };
    Reader.getClassAnnotation = function (clazz, annotation) {
        return this.search(this.getClassAnnotations(clazz), annotation);
    };
    Reader.getPropertyAnnotations = function (clazz, property) {
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            return [];
        }
        if (annotationsMap.properties.hasOwnProperty(property)) {
            return Array.prototype.concat.call(annotationsMap.properties[property], []).map(Reader.unCallback);
        }
        return [];
    };
    Reader.getPropertyAnnotation = function (clazz, property, annotation) {
        return this.search(this.getPropertyAnnotations(clazz, property), annotation);
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
    Reader.getParameterAnnotations = function (clazz, property, parameter) {
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            return [];
        }
        if (annotationsMap.parameters[property] && annotationsMap.parameters[property][parameter]) {
            return Array.from(annotationsMap.parameters[property][parameter]).concat([]).map(Reader.unCallback);
        }
        return [];
    };
    Reader.getParameterAnnotation = function (clazz, property, parameter, annotation) {
        return this.search(this.getParameterAnnotations(clazz, property, parameter), annotation);
    };
    Reader.getPropertiesNameWithParameterAnnotations = function (clazz) {
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (annotationsMap) {
            return Object.keys(annotationsMap.parameters)
                .filter(function (v, i, a) { return a.indexOf(v) === i; });
        }
        return [];
    };
    Reader.getParameterIndexesWithAnnotations = function (clazz, property) {
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (annotationsMap && annotationsMap.parameters.hasOwnProperty(property)) {
            return Object.keys(annotationsMap.parameters[property])
                .map(function (index) { return parseInt(index.toString(), 10); })
                .filter(function (v, i, a) { return a.indexOf(v) === i; })
                .sort();
        }
        return [];
    };
    Reader.getPropertiesNameByParameterAnnotation = function (clazz, annotation) {
        var properties = [];
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (annotationsMap) {
            for (var _i = 0, _a = Object.keys(annotationsMap.parameters); _i < _a.length; _i++) {
                var prop = _a[_i];
                for (var _b = 0, _c = Object.keys(annotationsMap.parameters[prop]); _b < _c.length; _b++) {
                    var index = _c[_b];
                    var metadatas = annotationsMap.parameters[prop][index];
                    for (var _d = 0, metadatas_2 = metadatas; _d < metadatas_2.length; _d++) {
                        var m = metadatas_2[_d];
                        if (annotation === m.annotation) {
                            properties.push(prop);
                            break;
                        }
                    }
                }
            }
        }
        return properties.filter(function (v, i, a) { return a.indexOf(v) === i; });
    };
    Reader.getParameterIndexesByAnnotation = function (clazz, property, annotation) {
        var indexs = [];
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (annotationsMap) {
            if (annotationsMap.parameters.hasOwnProperty(property)) {
                for (var _i = 0, _a = Object.keys(annotationsMap.parameters[property]); _i < _a.length; _i++) {
                    var index = _a[_i];
                    var metadatas = annotationsMap.parameters[property][index];
                    for (var _b = 0, metadatas_3 = metadatas; _b < metadatas_3.length; _b++) {
                        var m = metadatas_3[_b];
                        if (annotation == m.annotation) {
                            indexs.push(parseInt(index.toString(), 10));
                            break;
                        }
                    }
                }
            }
        }
        return indexs
            .filter(function (v, i, a) { return a.indexOf(v) === i; })
            .sort();
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
                parameters: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.clazz) {
            annotationsMap.cache.clazz = this.recurciveFind('ClassAnnotations', clazz);
        }
        return annotationsMap.cache.clazz;
    };
    Reader.findClassAnnotation = function (clazz, annotation) {
        return this.search(this.findClassAnnotations(clazz), annotation);
    };
    Reader.findPropertyAnnotations = function (clazz, property) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties) {
            annotationsMap.cache.properties = {};
        }
        if (!annotationsMap.cache.properties['__' + property]) {
            annotationsMap.cache.properties['__' + property] = this.recurciveFind('PropertyAnnotations', clazz, property);
        }
        return annotationsMap.cache.properties['__' + property];
    };
    Reader.findPropertyAnnotation = function (clazz, property, annotation) {
        return this.search(this.findPropertyAnnotations(clazz, property), annotation);
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
                parameters: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_with) {
            annotationsMap.cache.properties_with = this.recurciveFind('PropertiesNameWithAnnotations', clazz);
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
                parameters: {},
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
        var properties = this.recurciveFind('PropertiesNameByAnnotation', clazz, annotation);
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
    Reader.findParameterAnnotations = function (clazz, property, parameter) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.parameters) {
            annotationsMap.cache.parameters = {};
        }
        if (!annotationsMap.cache.parameters['__' + property]) {
            annotationsMap.cache.parameters['__' + property] = {};
        }
        if (!annotationsMap.cache.parameters['__' + property][parameter]) {
            annotationsMap.cache.parameters['__' + property][parameter] = this.recurciveFind('ParameterAnnotations', clazz, property, parameter);
        }
        return annotationsMap.cache.parameters['__' + property][parameter];
    };
    Reader.findParameterAnnotation = function (clazz, property, parameter, annotation) {
        return this.search(this.findParameterAnnotations(clazz, property, parameter), annotation);
    };
    Reader.findPropertiesNameWithParameterAnnotations = function (clazz) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_with_parameter) {
            annotationsMap.cache.properties_with_parameter = this.recurciveFind('PropertiesNameWithParameterAnnotations', clazz);
        }
        return annotationsMap.cache.properties_with_parameter;
    };
    Reader.findParameterIndexesWithAnnotations = function (clazz, property) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {},
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.parameters_with) {
            annotationsMap.cache.parameters_with = {};
        }
        if (!annotationsMap.cache.parameters_with[property]) {
            annotationsMap.cache.parameters_with[property] = this.recurciveFind('ParameterIndexesWithAnnotations', clazz, property).sort();
        }
        return annotationsMap.cache.parameters_with[property];
    };
    Reader.findPropertiesNameByParameterAnnotation = function (clazz, annotation) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_by_annotation) {
            annotationsMap.cache.properties_by_annotation = [];
        }
        var searched = annotationsMap.cache.properties_by_annotation
            .filter(function (propertiesBy) { return propertiesBy.annotation == annotation; });
        if (searched.length) {
            return searched[0].properties;
        }
        var properties = this.recurciveFind('PropertiesNameByParameterAnnotation', clazz, annotation);
        annotationsMap.cache.properties_by_annotation.push({
            annotation: annotation,
            properties: properties,
        });
        return properties;
    };
    Reader.findPropertiesNameByParameterAnnotations = function (clazz, annotations) {
        var properties = [];
        for (var _i = 0, annotations_2 = annotations; _i < annotations_2.length; _i++) {
            var a = annotations_2[_i];
            properties = properties.concat(this.findPropertiesNameByParameterAnnotation(clazz, a));
        }
        properties = properties.filter(function (v, i, a) { return a.indexOf(v) === i; });
        return properties;
    };
    Reader.findParameterIndexesByAnnotation = function (clazz, property, annotation) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        var annotationsMap = Writer_1.Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer_1.Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.parameter_by) {
            annotationsMap.cache.parameter_by = {};
        }
        if (!annotationsMap.cache.parameter_by[property]) {
            annotationsMap.cache.parameter_by[property] = [];
        }
        var searched = annotationsMap.cache.parameter_by[property]
            .filter(function (parameterBy) { return parameterBy.annotation == annotation; });
        if (searched.length) {
            return searched[0].parameters;
        }
        var parameters = this.recurciveFind('ParameterIndexesByAnnotation', clazz, property, annotation).sort();
        annotationsMap.cache.parameter_by[property].push({
            annotation: annotation,
            parameters: parameters,
        });
        return parameters;
    };
    Reader.findParameterIndexesByAnnotations = function (clazz, property, annotations) {
        var parameters = [];
        for (var _i = 0, annotations_3 = annotations; _i < annotations_3.length; _i++) {
            var a = annotations_3[_i];
            parameters = parameters.concat(this.findParameterIndexesByAnnotation(clazz, property, a));
        }
        return parameters.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
    };
    Reader.unCallback = function (metadata) {
        for (var _i = 0, _a = Object.keys(metadata.data); _i < _a.length; _i++) {
            var key = _a[_i];
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
    Reader.recurciveFind = function (functionName, target) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var result = this['get' + functionName].apply(this, [target].concat(args));
        if (typeof target.prototype !== 'undefined') {
            result = result.concat(this['find' + functionName].apply(this, [target.prototype].concat(args)));
        }
        return result
            .concat(this['find' + functionName].apply(this, [Object.getPrototypeOf(target)].concat(args)))
            .filter(function (v, i, a) { return a.indexOf(v) === i; });
    };
    return Reader;
}());
exports.Reader = Reader;
//# sourceMappingURL=Reader.js.map