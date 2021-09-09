import {Metadata} from "./Metadata";
import {CallbackParamObject} from "./CallbackParam";
import {Writer} from "./Writer";

export class Reader {
	
	public static getClassAnnotations(clazz: any): Metadata[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			return [];
		}
		return Array.from(annotationsMap.clazz).concat([]).map(Reader.unCallback);
	}
	
	public static getClassAnnotation(clazz: any, annotation: any): any|null {
		return this.search(
			this.getClassAnnotations(clazz), annotation
		);
	}
	
	
	
	public static getPropertyAnnotations(clazz: any, property: string): Metadata[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			return [];
		}
		if (annotationsMap.properties.hasOwnProperty(property)) {
			return Array.prototype.concat.call(annotationsMap.properties[property], []).map(Reader.unCallback);
		}
		return [];
	}
	
	public static getPropertyAnnotation(clazz: any, property: string, annotation: any): any|null {
		return this.search(
			this.getPropertyAnnotations(clazz, property), annotation
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
		const properties: string[] = [];
		const annotationsMap = Writer.annotations.get(clazz);
		if (annotationsMap) {
			
			for (const prop of Object.keys(annotationsMap.properties)) {
				const metadatas: Metadata[] =  annotationsMap.properties[prop];
				for(const m of metadatas) {
					if (annotation == m.annotation) {
						properties.push(prop);
						break
					}
				}
			}
		}
		return properties.filter((v, i, a) => a.indexOf(v) === i);
	}
	
	
	
	
	public static getParameterAnnotations(clazz: any, property: string, parameter: number): Metadata[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (!annotationsMap) {
			return [];
		}
		if (annotationsMap.parameters[property] && annotationsMap.parameters[property][parameter]) {
			return Array.from(annotationsMap.parameters[property][parameter]).concat([]).map(Reader.unCallback);
		}
		return [];
	}
	
	public static getParameterAnnotation(clazz: any, property: string, parameter: number, annotation: any): any|null {
		return this.search(
			this.getParameterAnnotations(clazz, property, parameter), annotation
		);
	}
	
	
	public static getPropertiesNameWithParameterAnnotations(clazz: any): string[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (annotationsMap) {
			return Object.keys(annotationsMap.parameters)
				.filter((v, i, a) => a.indexOf(v) === i)
			;
		}
		return [];
	}
	
	public static getParameterIndexesWithAnnotations(clazz: any, property: string): number[] {
		const annotationsMap = Writer.annotations.get(clazz);
		if (annotationsMap && annotationsMap.parameters.hasOwnProperty(property)) {
			return Object.keys(annotationsMap.parameters[property])
				.map(index => parseInt(index.toString(), 10))
				.filter((v, i, a) => a.indexOf(v) === i)
				.sort()
			;
		}
		return [];
	}
	
	public static getPropertiesNameByParameterAnnotation(clazz: any, annotation: any): string[] {
		const properties: string[] = [];
		const annotationsMap = Writer.annotations.get(clazz);
		
		if (annotationsMap) {
			
			for (const prop of Object.keys(annotationsMap.parameters)) {
				for (const index of Object.keys(annotationsMap.parameters[prop])) {
					
					const metadatas: Metadata[] = annotationsMap.parameters[prop][index];
					
					for(const m of metadatas) {
						if (annotation === m.annotation) {
							properties.push(prop);
							break
						}
					}
				}
			}
		}
		return properties.filter((v, i, a) => a.indexOf(v) === i);
	}
	
	
	public static getParameterIndexesByAnnotation(clazz: any, property: string, annotation: any): number[] {
		const indexs: number[] = [];
		const annotationsMap = Writer.annotations.get(clazz);
		if (annotationsMap) {
			
			if (annotationsMap.parameters.hasOwnProperty(property)) {
				
				for (const index of Object.keys(annotationsMap.parameters[property])) {

					const metadatas: Metadata[] = annotationsMap.parameters[property][index];
					for(const m of metadatas) {
						if (annotation == m.annotation) {
							indexs.push(parseInt(index.toString(), 10));
							break
						}
					}
				}
			}
				
		}
		return indexs
			.filter((v, i, a) => a.indexOf(v) === i)
			.sort()
		;
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
	
	public static findClassAnnotation(clazz: any, annotation: any): any|null {
		return this.search(
			this.findClassAnnotations(clazz), annotation
		);
	}
	
	
	
	
	public static findPropertyAnnotations(clazz: any, property: string): Metadata[] {
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
		
		if (!annotationsMap.cache.properties['__'+property]) {
			annotationsMap.cache.properties['__'+property] = this.recurciveFind('PropertyAnnotations', clazz, property);
		}
		return annotationsMap.cache.properties['__'+property];
	}
	
	public static findPropertyAnnotation(clazz: any, property: string, annotation: any): any|null {
		return this.search(
			this.findPropertyAnnotations(clazz, property), annotation
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
	
	public static findPropertiesNameByAnnotation(clazz: any, annotation: any): string[] {
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
			.filter(propertiesBy => propertiesBy.annotation == annotation)
		;
		if (searched.length) {
			return searched[0].properties
		}
		
		const properties = this.recurciveFind('PropertiesNameByAnnotation', clazz, annotation);
		
		annotationsMap.cache.properties_by.push({
			annotation: annotation,
			properties: properties,
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
	
	
	
	
	public static findParameterAnnotations(clazz: any, property: string, parameter: number): Metadata[] {
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
		if (!annotationsMap.cache.parameters['__'+property]) {
			annotationsMap.cache.parameters['__'+property] = {};
		}
		
		if (!annotationsMap.cache.parameters['__'+property][parameter]) {
			annotationsMap.cache.parameters['__'+property][parameter] = this.recurciveFind('ParameterAnnotations', clazz, property, parameter);
		}
		return annotationsMap.cache.parameters['__'+property][parameter];
	}
	
	public static findParameterAnnotation(clazz: any, property: string, parameter: number, annotation: any): any|null {
		return this.search(
			this.findParameterAnnotations(clazz, property, parameter), annotation
		);
	}
	
	public static findPropertiesNameWithParameterAnnotations(clazz: any): string[] {
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
	
	
	
	
	public static findParameterIndexesWithAnnotations(clazz: any, property: string): number[] {
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
	
	public static findPropertiesNameByParameterAnnotation(clazz: any, annotation: any): string[] {
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
			.filter(propertiesBy => propertiesBy.annotation == annotation)
		;
		if (searched.length) {
			return searched[0].properties
		}
		
		const properties = this.recurciveFind('PropertiesNameByParameterAnnotation', clazz, annotation);
		
		annotationsMap.cache.properties_by_annotation.push({
			annotation: annotation,
			properties: properties,
		});
		
		return properties;
	}
	
	public static findPropertiesNameByParameterAnnotations(clazz: any, annotations: any[]): string[] {
		let properties: string[] = [];
		for (const a of annotations) {
			properties = properties.concat(
				this.findPropertiesNameByParameterAnnotation(clazz, a)
			);
		}
		properties = properties.filter((v, i, a) => a.indexOf(v) === i);
		return properties;
	}
	
	public static findParameterIndexesByAnnotation(clazz: any, property: string, annotation: any): number[] {
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
			.filter(parameterBy => parameterBy.annotation == annotation)
		;
		if (searched.length) {
			return searched[0].parameters
		}
		
		const parameters = this.recurciveFind('ParameterIndexesByAnnotation', clazz, property, annotation).sort();
		
		annotationsMap.cache.parameter_by[property].push({
			annotation: annotation,
			parameters: parameters,
		});
		
		return parameters;
	}
	
	public static findParameterIndexesByAnnotations(clazz: any, property: string, annotations: any[]): number[] {
		let parameters: number[] = [];
		for (const a of annotations) {
			parameters = parameters.concat(
				this.findParameterIndexesByAnnotation(clazz, property, a)
			);
		}
		return parameters.filter((v, i, a) => a.indexOf(v) === i).sort();
	}
	
	
	
	
	private static unCallback(metadata: Metadata): Metadata {
		for (const key of Object.keys(metadata.data)) {
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
		for(const metadata of list) {
			if (metadata.annotation == annotation) {
				return metadata.data;
			}
		}
		return null;
	}
	
	private static recurciveFind(functionName: string, target: any, ...args: any[]): any|null {
		
		let result = this['get'+functionName](target, ...args);
		
		if (typeof target.prototype !== 'undefined') {
			result = result.concat(this['find'+functionName](target.prototype, ...args));
		}
		return result
			.concat(
				this['find'+functionName](Object.getPrototypeOf(target), ...args)
			)
			.filter((v, i, a) => a.indexOf(v) === i)
		;
	}
	
}
