
import {Metadata} from "./Metadata";

export class Writer {
	
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
			} else {
				target.__gts_annotations__.clazz.push(metadata);
			}
			
			if (callback) {
				(<Function>callback)(target, propertyKey, descriptor);
			}
		};
	}
	
}