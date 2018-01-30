import {Metadata} from "./Metadata";
import {CallbackParamObject} from "./CallbackParam";

export class Reader {
	
	public static getClassAnnotations(clazz: any): Metadata[] {
		if (!clazz.hasOwnProperty('__gts_annotations__')) {
			return [];
		}
		return Array.prototype.concat.call(clazz.__gts_annotations__.clazz, []).map(Reader.unCallback);
	}
	
	public static getClassAnnotation(clazz: any, annotation: any): any|null {
		return this.search(
			this.getClassAnnotations(clazz), annotation
		);
	}
	
	public static getPropertyAnnotations(clazz: any, name: string): Metadata[] {
		if (!clazz.hasOwnProperty('__gts_annotations__')) {
			return [];
		}
		if (clazz.__gts_annotations__.properties.hasOwnProperty(name)) {
			return Array.prototype.concat.call(clazz.__gts_annotations__.properties[name], []).map(Reader.unCallback);
		}
		return [];
	}
	
	public static getPropertyAnnotation(clazz: any, name: string, annotation: any): any|null {
		return this.search(
			this.getPropertyAnnotations(clazz, name), annotation
		);
	}
	
	
	public static getPropertiesNameWithAnnotations(clazz: any): string[] {
		if (clazz.hasOwnProperty('__gts_annotations__')) {
			return Object.keys(clazz.__gts_annotations__.properties)
				.filter((v, i, a) => a.indexOf(v) === i)
			;
		}
		return [];
	}
	
	public static getPropertiesNameByAnnotation(clazz: any, annotation: any): string[] {
		let properties: string[] = [];
		if (clazz.hasOwnProperty('__gts_annotations__')) {
			
			for (let prop of Object.keys(clazz.__gts_annotations__.properties)) {
				let metadatas: Metadata[] =  clazz.__gts_annotations__.properties[prop];
				for(let m of metadatas) {
					if (annotation == m.annotation) {
						properties.push(prop);
						break
					}
				}
			}
		}
		return properties.filter((v, i, a) => a.indexOf(v) === i);
	}
	
	public static findClassAnnotations(clazz: any): Metadata[] {
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
			
			let annotations = this.getClassAnnotations(clazz);
			if (typeof clazz.prototype !== 'undefined') {
				annotations = annotations.concat(this.findClassAnnotations(clazz.prototype));
			}
			clazz.__gts_annotations__.cache.clazz = annotations.concat(
				this.findClassAnnotations(Object.getPrototypeOf(clazz))
			);
		}
		return clazz.__gts_annotations__.cache.clazz;
	}
	
	public static findClassAnnotation(clazz: any, annotation: any): any|null {
		return this.search(
			this.findClassAnnotations(clazz), annotation
		);
	}
	
	public static findPropertyAnnotations(clazz: any, name: string): Metadata[] {
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
			let annotations = this.getPropertyAnnotations(clazz, name);
			if (typeof clazz.prototype !== 'undefined') {
				annotations = annotations.concat(this.findPropertyAnnotations(clazz.prototype, name));
			}
			clazz.__gts_annotations__.cache.properties[name] = annotations.concat(
				this.findPropertyAnnotations(Object.getPrototypeOf(clazz), name)
			);
		}
		return clazz.__gts_annotations__.cache.properties[name];
	}
	
	public static findPropertyAnnotation(clazz: any, name: string, annotation: any): any|null {
		return this.search(
			this.findPropertyAnnotations(clazz, name), annotation
		);
	}
	
	public static findPropertiesNameWithAnnotations(clazz: any): string[] {
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
			let properties = this.getPropertiesNameWithAnnotations(clazz);
			if (typeof clazz.prototype !== 'undefined') {
				properties = properties.concat(this.findPropertiesNameWithAnnotations(clazz.prototype));
			}
			clazz.__gts_annotations__.cache.properties_with =  properties
				.concat(this.findPropertiesNameWithAnnotations(Object.getPrototypeOf(clazz)))
				.filter((v, i, a) => a.indexOf(v) === i)
			;
		}
		return clazz.__gts_annotations__.cache.properties_with;
	}
	
	public static findPropertiesNameByAnnotation(clazz: any, annotation: any): string[] {
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
		const searched = clazz.__gts_annotations__.cache.properties_by
			.filter(propertiesBy => propertiesBy.annotation == annotation)
		;
		if (searched.length) {
			return searched[0].properties
		}
		
		let properties = this.getPropertiesNameByAnnotation(clazz, annotation);
		if (typeof clazz.prototype !== 'undefined') {
			properties = properties
				.concat(this.findPropertiesNameByAnnotation(clazz.prototype, annotation))
			;
		}
		properties = properties.concat(
			this.findPropertiesNameByAnnotation(Object.getPrototypeOf(clazz), annotation)
				.filter((v, i, a) => a.indexOf(v) === i)
		);
		
		clazz.__gts_annotations__.cache.properties_by.push({
			annotation: annotation,
			properties:properties,
		});
		
		return properties;
	}
	
	public static findPropertiesNameByAnnotations(clazz: any, annotations: any[]): string[] {
		let properties = [];
		for (const a of annotations) {
			properties = properties.concat(
				this.findPropertiesNameByAnnotation(clazz, a)
			);
		}
		properties = properties.filter((v, i, a) => a.indexOf(v) === i);
		return properties;
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