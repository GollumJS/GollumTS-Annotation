import {Metadata} from "./Metadata";
import {CallbackParamObject} from "./CallbackParam";

export class Reader {
	
	public static getClassAnnotations(clazz: any): Metadata[] {
		if (!clazz.hasOwnProperty('__metadata__')) {
			return [];
		}
		return Array.prototype.concat.call(clazz.__metadata__.clazz, []).map(Reader.unCallback);
	}
	
	public static getClassAnnotation(clazz: any, annotation: any): any|null {
		return this.search(
			this.getClassAnnotations(clazz), annotation
		);
	}
	
	public static getPropertyAnnotations(clazz: any, name: string): Metadata[] {
		if (!clazz.hasOwnProperty('__metadata__')) {
			return [];
		}
		if (clazz.__metadata__.properties.hasOwnProperty(name)) {
			return Array.prototype.concat.call(clazz.__metadata__.properties[name], []).map(Reader.unCallback);
		}
		return [];
	}
	
	public static getPropertyAnnotation(clazz: any, name: string, annotation: any): any|null {
		return this.search(
			this.getPropertyAnnotations(clazz, name), annotation
		);
	}
	
	public static getPropertiesNameByAnnotations(clazz: any, annotations: any[]|any): string[] {
		if (!Array.isArray(annotations)) {
			annotations = [annotations];
		}
		let properties: string[] = [];
		if (clazz.hasOwnProperty('__metadata__')) {
			for (let prop in clazz.__metadata__.properties) {
				let metadatas: Metadata[] =  clazz.__metadata__.properties[prop];
				for(let m of metadatas) {
					if (annotations.indexOf(m.annotation) != -1) {
						if(properties.indexOf(prop) == -1) {
							properties.push(prop);
						}
						break
					}
				}
			}
		}
		return properties;
	}
	
	public static findClassAnnotations(clazz: any): Metadata[] {
		if (clazz == null) {
			return [];
		}
		
		let annotations = this.getClassAnnotations(clazz);
		if (typeof clazz.prototype !== 'undefined') {
			annotations = annotations.concat(this.findClassAnnotations(clazz.prototype));
		}
		return annotations.concat(
			this.findClassAnnotations(Object.getPrototypeOf(clazz))
		);
	}
	
	public static findClassAnnotation(clazz: any, annotation: any): any|null {
		return this.search(
			this.findClassAnnotations(clazz), annotation
		);
	}
	
	public static findPropertyAnnotations(clazz: any, name: string): Metadata[] {
		if (clazz == null) {
			return [];
		}
		
		let annotations = this.getPropertyAnnotations(clazz, name);
		if (typeof clazz.prototype !== 'undefined') {
			annotations = annotations.concat(this.findPropertyAnnotations(clazz.prototype, name));
		}
		return annotations.concat(
			this.findPropertyAnnotations(Object.getPrototypeOf(clazz), name)
		);
	}
	
	public static findPropertyAnnotation(clazz: any, name: string, annotation: any): any|null {
		return this.search(
			this.findPropertyAnnotations(clazz, name), annotation
		);
	}
	
	public static findPropertiesNameByAnnotations(clazz: any, annotations: any[]|any): string[] {
		if (clazz == null) {
			return [];
		}
		
		let properties = this.getPropertiesNameByAnnotations(clazz, annotations);
		if (typeof clazz.prototype !== 'undefined') {
			properties = properties.concat(this.findPropertiesNameByAnnotations(clazz.prototype, annotations));
		}
		return properties.concat(
			this.findPropertiesNameByAnnotations(Object.getPrototypeOf(clazz), annotations)
		);
	}
	
	
	private static unCallback(metadata: Metadata): Metadata {
		let data = {};
		
		for (let key in metadata.data) {
			if (metadata.data[key] instanceof CallbackParamObject) {
				data[key] = metadata.data[key].callback();
			} else {
				data[key] = metadata.data[key];
			}
		}
		
		return new Metadata(
			metadata.annotation,
			data
		);
	}
	
	private static search(list: Metadata[], annotation: any): any|null {
		for(let metadata of list) {
			if (metadata.annotation == annotation) {
				return metadata.data;
			}
		}
		return null;
	}
	
}