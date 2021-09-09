import { Metadata } from "./Metadata";
import { CallbackParamObject } from "./CallbackParam";
import { Writer } from "./Writer";
export class Reader {
    static getClassAnnotations(clazz) {
        const annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            return [];
        }
        return Array.from(annotationsMap.clazz).concat([]).map(Reader.unCallback);
    }
    static getClassAnnotation(clazz, annotation) {
        return this.search(this.getClassAnnotations(clazz), annotation);
    }
    static getPropertyAnnotations(clazz, property) {
        const annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            return [];
        }
        if (annotationsMap.properties.hasOwnProperty(property)) {
            return Array.prototype.concat.call(annotationsMap.properties[property], []).map(Reader.unCallback);
        }
        return [];
    }
    static getPropertyAnnotation(clazz, property, annotation) {
        return this.search(this.getPropertyAnnotations(clazz, property), annotation);
    }
    static getPropertiesNameWithAnnotations(clazz) {
        const annotationsMap = Writer.annotations.get(clazz);
        if (annotationsMap) {
            return Object.keys(annotationsMap.properties)
                .filter((v, i, a) => a.indexOf(v) === i);
        }
        return [];
    }
    static getPropertiesNameByAnnotation(clazz, annotation) {
        const properties = [];
        const annotationsMap = Writer.annotations.get(clazz);
        if (annotationsMap) {
            for (const prop of Object.keys(annotationsMap.properties)) {
                const metadatas = annotationsMap.properties[prop];
                for (const m of metadatas) {
                    if (annotation == m.annotation) {
                        properties.push(prop);
                        break;
                    }
                }
            }
        }
        return properties.filter((v, i, a) => a.indexOf(v) === i);
    }
    static getParameterAnnotations(clazz, property, parameter) {
        const annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            return [];
        }
        if (annotationsMap.parameters[property] && annotationsMap.parameters[property][parameter]) {
            return Array.from(annotationsMap.parameters[property][parameter]).concat([]).map(Reader.unCallback);
        }
        return [];
    }
    static getParameterAnnotation(clazz, property, parameter, annotation) {
        return this.search(this.getParameterAnnotations(clazz, property, parameter), annotation);
    }
    static getPropertiesNameWithParameterAnnotations(clazz) {
        const annotationsMap = Writer.annotations.get(clazz);
        if (annotationsMap) {
            return Object.keys(annotationsMap.parameters)
                .filter((v, i, a) => a.indexOf(v) === i);
        }
        return [];
    }
    static getParameterIndexesWithAnnotations(clazz, property) {
        const annotationsMap = Writer.annotations.get(clazz);
        if (annotationsMap && annotationsMap.parameters.hasOwnProperty(property)) {
            return Object.keys(annotationsMap.parameters[property])
                .map(index => parseInt(index.toString(), 10))
                .filter((v, i, a) => a.indexOf(v) === i)
                .sort();
        }
        return [];
    }
    static getPropertiesNameByParameterAnnotation(clazz, annotation) {
        const properties = [];
        const annotationsMap = Writer.annotations.get(clazz);
        if (annotationsMap) {
            for (const prop of Object.keys(annotationsMap.parameters)) {
                for (const index of Object.keys(annotationsMap.parameters[prop])) {
                    const metadatas = annotationsMap.parameters[prop][index];
                    for (const m of metadatas) {
                        if (annotation === m.annotation) {
                            properties.push(prop);
                            break;
                        }
                    }
                }
            }
        }
        return properties.filter((v, i, a) => a.indexOf(v) === i);
    }
    static getParameterIndexesByAnnotation(clazz, property, annotation) {
        const indexs = [];
        const annotationsMap = Writer.annotations.get(clazz);
        if (annotationsMap) {
            if (annotationsMap.parameters.hasOwnProperty(property)) {
                for (const index of Object.keys(annotationsMap.parameters[property])) {
                    const metadatas = annotationsMap.parameters[property][index];
                    for (const m of metadatas) {
                        if (annotation == m.annotation) {
                            indexs.push(parseInt(index.toString(), 10));
                            break;
                        }
                    }
                }
            }
        }
        return indexs
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort();
    }
    static findClassAnnotations(clazz) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.clazz) {
            annotationsMap.cache.clazz = this.recurciveFind('ClassAnnotations', clazz);
        }
        return annotationsMap.cache.clazz;
    }
    static findClassAnnotation(clazz, annotation) {
        return this.search(this.findClassAnnotations(clazz), annotation);
    }
    static findPropertyAnnotations(clazz, property) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties) {
            annotationsMap.cache.properties = {};
        }
        if (!annotationsMap.cache.properties['__' + property]) {
            annotationsMap.cache.properties['__' + property] = this.recurciveFind('PropertyAnnotations', clazz, property);
        }
        return annotationsMap.cache.properties['__' + property];
    }
    static findPropertyAnnotation(clazz, property, annotation) {
        return this.search(this.findPropertyAnnotations(clazz, property), annotation);
    }
    static findPropertiesNameWithAnnotations(clazz) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_with) {
            annotationsMap.cache.properties_with = this.recurciveFind('PropertiesNameWithAnnotations', clazz);
        }
        return annotationsMap.cache.properties_with;
    }
    static findPropertiesNameByAnnotation(clazz, annotation) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_by) {
            annotationsMap.cache.properties_by = [];
        }
        const searched = annotationsMap.cache.properties_by
            .filter(propertiesBy => propertiesBy.annotation == annotation);
        if (searched.length) {
            return searched[0].properties;
        }
        const properties = this.recurciveFind('PropertiesNameByAnnotation', clazz, annotation);
        annotationsMap.cache.properties_by.push({
            annotation: annotation,
            properties: properties,
        });
        return properties;
    }
    static findPropertiesNameByAnnotations(clazz, annotations) {
        let properties = [];
        for (const a of annotations) {
            properties = properties.concat(this.findPropertiesNameByAnnotation(clazz, a));
        }
        properties = properties.filter((v, i, a) => a.indexOf(v) === i);
        return properties;
    }
    static findParameterAnnotations(clazz, property, parameter) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
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
    }
    static findParameterAnnotation(clazz, property, parameter, annotation) {
        return this.search(this.findParameterAnnotations(clazz, property, parameter), annotation);
    }
    static findPropertiesNameWithParameterAnnotations(clazz) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_with_parameter) {
            annotationsMap.cache.properties_with_parameter = this.recurciveFind('PropertiesNameWithParameterAnnotations', clazz);
        }
        return annotationsMap.cache.properties_with_parameter;
    }
    static findParameterIndexesWithAnnotations(clazz, property) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {},
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.parameters_with) {
            annotationsMap.cache.parameters_with = {};
        }
        if (!annotationsMap.cache.parameters_with[property]) {
            annotationsMap.cache.parameters_with[property] = this.recurciveFind('ParameterIndexesWithAnnotations', clazz, property).sort();
        }
        return annotationsMap.cache.parameters_with[property];
    }
    static findPropertiesNameByParameterAnnotation(clazz, annotation) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.properties_by_annotation) {
            annotationsMap.cache.properties_by_annotation = [];
        }
        const searched = annotationsMap.cache.properties_by_annotation
            .filter(propertiesBy => propertiesBy.annotation == annotation);
        if (searched.length) {
            return searched[0].properties;
        }
        const properties = this.recurciveFind('PropertiesNameByParameterAnnotation', clazz, annotation);
        annotationsMap.cache.properties_by_annotation.push({
            annotation: annotation,
            properties: properties,
        });
        return properties;
    }
    static findPropertiesNameByParameterAnnotations(clazz, annotations) {
        let properties = [];
        for (const a of annotations) {
            properties = properties.concat(this.findPropertiesNameByParameterAnnotation(clazz, a));
        }
        properties = properties.filter((v, i, a) => a.indexOf(v) === i);
        return properties;
    }
    static findParameterIndexesByAnnotation(clazz, property, annotation) {
        if (clazz == null || clazz === Object || clazz === Object.prototype) {
            return [];
        }
        let annotationsMap = Writer.annotations.get(clazz);
        if (!annotationsMap) {
            annotationsMap = {
                clazz: [],
                properties: {},
                parameters: {},
                cache: {}
            };
            Writer.annotations.set(clazz, annotationsMap);
        }
        if (!annotationsMap.cache.parameter_by) {
            annotationsMap.cache.parameter_by = {};
        }
        if (!annotationsMap.cache.parameter_by[property]) {
            annotationsMap.cache.parameter_by[property] = [];
        }
        const searched = annotationsMap.cache.parameter_by[property]
            .filter(parameterBy => parameterBy.annotation == annotation);
        if (searched.length) {
            return searched[0].parameters;
        }
        const parameters = this.recurciveFind('ParameterIndexesByAnnotation', clazz, property, annotation).sort();
        annotationsMap.cache.parameter_by[property].push({
            annotation: annotation,
            parameters: parameters,
        });
        return parameters;
    }
    static findParameterIndexesByAnnotations(clazz, property, annotations) {
        let parameters = [];
        for (const a of annotations) {
            parameters = parameters.concat(this.findParameterIndexesByAnnotation(clazz, property, a));
        }
        return parameters.filter((v, i, a) => a.indexOf(v) === i).sort();
    }
    static unCallback(metadata) {
        for (const key of Object.keys(metadata.data)) {
            if (metadata.data[key] instanceof CallbackParamObject) {
                metadata.data[key] = metadata.data[key].callback();
            }
            else {
                metadata.data[key] = metadata.data[key];
            }
        }
        return new Metadata(metadata.annotation, metadata.data);
    }
    static search(list, annotation) {
        for (const metadata of list) {
            if (metadata.annotation == annotation) {
                return metadata.data;
            }
        }
        return null;
    }
    static recurciveFind(functionName, target, ...args) {
        let result = this['get' + functionName].apply(this, [target].concat(args));
        if (typeof target.prototype !== 'undefined') {
            result = result.concat(this['find' + functionName].apply(this, [target.prototype].concat(args)));
        }
        return result
            .concat(this['find' + functionName].apply(this, [Object.getPrototypeOf(target)].concat(args)))
            .filter((v, i, a) => a.indexOf(v) === i);
    }
}
//# sourceMappingURL=Reader.js.map