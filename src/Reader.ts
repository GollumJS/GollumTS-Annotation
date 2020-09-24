import {Metadata} from "./Metadata";
import {CallbackParamObject} from "./CallbackParam";
import {Writer} from "./Writer";

export class Reader {
	
	public static getClassAnnotations(clazz: any): Metadata[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			return [];
		}
		return Array.prototype.concat.call(annotationsMap.clazz, []).map(Reader.unCallback);
	}
	
	public static getClassAnnotation(clazz: any, annotation: any): any|null {
		return this.search(
			this.getClassAnnotations(clazz), annotation
		);
	}
	
	public static getPropertyAnnotations(clazz: any, name: string): Metadata[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			return [];
		}
		if (annotationsMap.properties.hasOwnProperty(name)) {
			return Array.prototype.concat.call(annotationsMap.properties[name], []).map(Reader.unCallback);
		}
		return [];
	}
	
	public static getPropertyAnnotation(clazz: any, name: string, annotation: any): any|null {
		return this.search(
			this.getPropertyAnnotations(clazz, name), annotation
		);
	}
	
	
	public static getPropertiesNameWithAnnotations(clazz: any): string[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (annotationsMap) {
			return Object.keys(annotationsMap.properties)
				.filter((v, i, a) => a.indexOf(v) === i)
			;
		}
		return [];
	}
	
	public static getPropertiesNameByAnnotation(clazz: any, annotation: any): string[] {
		let properties: string[] = [];
		const annotationsMap = Writer.annotations.get(clazz);
		if (annotationsMap) {
			
			for (let prop of Object.keys(annotationsMap.properties)) {
				let metadatas: Metadata[] =  annotationsMap.properties[prop];
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
		let annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			annotationsMap = {
				clazz: [],
				properties: {},
				cache: {}
			};
			Writer.annotations.set(clazz, annotationsMap);
		}
		
		if (!annotationsMap.cache.clazz) {
			
			let annotations = this.getClassAnnotations(clazz);
			if (typeof clazz.prototype !== 'undefined') {
				annotations = annotations.concat(this.findClassAnnotations(clazz.prototype));
			}
			annotationsMap.cache.clazz = annotations.concat(
				this.findClassAnnotations(Object.getPrototypeOf(clazz))
			);
		}
		return annotationsMap.cache.clazz;
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
		let annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			annotationsMap = {
				clazz: [],
				properties: {},
				cache: {}
			};
			Writer.annotations.set(clazz, annotationsMap);
		}
		if (!annotationsMap.cache.properties) {
			annotationsMap.cache.properties = {};
		}
		
		if (!annotationsMap.cache.properties['__'+name]) {
			let annotations = this.getPropertyAnnotations(clazz, name);
			if (typeof clazz.prototype !== 'undefined') {
				annotations = annotations.concat(this.findPropertyAnnotations(clazz.prototype, name));
			}
			annotationsMap.cache.properties['__'+name] = annotations.concat(
				this.findPropertyAnnotations(Object.getPrototypeOf(clazz), name)
			);
		}
		return annotationsMap.cache.properties['__'+name];
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
		let annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			annotationsMap = {
				clazz: [],
				properties: {},
				cache: {}
			};
			Writer.annotations.set(clazz, annotationsMap);
		}
		
		if (!annotationsMap.cache.properties_with) {
			let properties = this.getPropertiesNameWithAnnotations(clazz);
			if (typeof clazz.prototype !== 'undefined') {
				properties = properties.concat(this.findPropertiesNameWithAnnotations(clazz.prototype));
			}
			annotationsMap.cache.properties_with =  properties
				.concat(this.findPropertiesNameWithAnnotations(Object.getPrototypeOf(clazz)))
				.filter((v, i, a) => a.indexOf(v) === i)
			;
		}
		return annotationsMap.cache.properties_with;
	}
	
	public static findPropertiesNameByAnnotation(clazz: any, annotation: any): string[] {
		if (clazz == null || clazz === Object || clazz === Object.prototype) {
			return [];
		}
		let annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			annotationsMap = {
				clazz: [],
				properties: {},
				cache: {}
			};
			Writer.annotations.set(clazz, annotationsMap);
		}
		if (!annotationsMap.cache.properties_by) {
			annotationsMap.cache.properties_by = [];
		}
		const searched = annotationsMap.cache.properties_by
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
		
		annotationsMap.cache.properties_by.push({
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
		for (let key in metadata.data) {
			if (metadata.data[key] instanceof CallbackParamObject) {
				metadata.data[key] = metadata.data[key].callback();
			} else {
				metadata.data[key] = metadata.data[key];
			}
		}
		
		return new Metadata(
			metadata.annotation,
			metadata.data
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