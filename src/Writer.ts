
import {Metadata} from "./Metadata";

type WriterAnnotations = {
	clazz: any[],
	properties: any,
	parameters: any,
	cache: any
};

export class Writer {
	
	public static readonly annotations: Map<any, WriterAnnotations> = new Map<any, WriterAnnotations>();
	
	public static write(
		annotation: any,
		data: any = {},
		callback: (
			null |
			((target: any, propertyKey?: string, parameter?: number) => any)
		) = null
	): any {
		
		const metadata = new Metadata(annotation, data);
		
		return function (target: any, propertyKey: string = null, parameter: number = null): any {

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
			} else
			if (propertyKey) {
				if (!annotations.properties[propertyKey]) {
					annotations.properties[propertyKey] = [];
				}
				annotations.properties[propertyKey].push(metadata);
			} else {
				annotations.clazz.push(metadata);
			}
			
			if (callback) {
				const result = (<Function>callback)(target, propertyKey, parameter);
				if (result) {
					return result;
				}
			}
		};
	}
	
}
