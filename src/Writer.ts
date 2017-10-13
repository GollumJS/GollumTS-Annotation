
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
			
			if (!target.hasOwnProperty('__metadata__')) {
				target.__metadata__ = {
					clazz: [],
					properties: {}
				};
			}
			if (propertyKey) {
				if (!target.__metadata__.properties.hasOwnProperty(propertyKey)) {
					target.__metadata__.properties[propertyKey] = [];
				}
				target.__metadata__.properties[propertyKey].push(metadata);
			} else {
				target.__metadata__.clazz.push(metadata);
			}
			
			if (callback) {
				(<Function>callback)(target, propertyKey, descriptor);
			}
		};
	}
	
}