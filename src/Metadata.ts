export class Metadata {
	
	private _annotation: any;
	private _data: any;
	
	public constructor (annotation: any, data: any) {
		this._annotation = annotation;
		this._data       = data;
	}
	
	public get annotation(): any {
		return this._annotation;
	}
	
	public get data(): any {
		return this._data;
	}
	
}
