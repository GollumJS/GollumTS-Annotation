
export class CallbackParamObject {
	public _callback;
	
	public constructor(callback: Function) {
		this._callback = callback;
	}
	
	public get callback(): Function {
		return this._callback;
	}
}

export function Callback(callback: Function): any {
	return new CallbackParamObject(callback);
}
