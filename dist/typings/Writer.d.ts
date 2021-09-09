declare type WriterAnnotations = {
    clazz: any[];
    properties: any;
    parameters: any;
    cache: any;
};
export declare class Writer {
    static readonly annotations: Map<any, WriterAnnotations>;
    static write(annotation: any, data?: any, callback?: (null | ((target: any, propertyKey?: string, parameter?: number) => any))): any;
}
export {};
