import { Metadata } from "./Metadata";
export class Writer {
    static write(annotation, data = {}, callback = null) {
        const metadata = new Metadata(annotation, data);
        return function (target, propertyKey = null, parameter = null) {
            parameter = isNaN(parameter) ? null : parameter;
            let annotations = Writer.annotations.get(target);
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
                const result = callback(target, propertyKey, parameter);
                if (result) {
                    return result;
                }
            }
        };
    }
}
Writer.annotations = new Map();
//# sourceMappingURL=Writer.js.map