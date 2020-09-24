
import {Metadata} from "./Metadata";

export class Writer {
	
	public static readonly annotations: Map<any, {
		clazz: any[],
		properties: any,
		cache: any
	}> = new Map();
	
	public static write(
		annotation: any,
		data: any = {},
		callback: (
			null |
			((target: any) => void) |
			((target: any, propertyKey: string, descriptor: PropertyDescriptor) => void)
		) = null
	) {
		
		let metadata = new Metadata(annotation, data);
		
		return function (target: any, propertyKey: string = null, descriptor: PropertyDescriptor = null) {
			
			let annotations = Writer.annotations.get(target);
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
			} else {
				annotations.clazz.push(metadata);
			}
			
			if (callback) {
				const result = (<Function>callback)(target, propertyKey, descriptor);
				if (result) {
					return result;
				}
			}
		};
	}
	
}