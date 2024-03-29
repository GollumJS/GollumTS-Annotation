import { Metadata } from "./Metadata";
export declare class Reader {
    static getClassAnnotations(clazz: any): Metadata[];
    static getClassAnnotation(clazz: any, annotation: any): any | null;
    static getPropertyAnnotations(clazz: any, property: string): Metadata[];
    static getPropertyAnnotation(clazz: any, property: string, annotation: any): any | null;
    static getPropertiesNameWithAnnotations(clazz: any): string[];
    static getPropertiesNameByAnnotation(clazz: any, annotation: any): string[];
    static getParameterAnnotations(clazz: any, property: string, parameter: number): Metadata[];
    static getParameterAnnotation(clazz: any, property: string, parameter: number, annotation: any): any | null;
    static getPropertiesNameWithParameterAnnotations(clazz: any): string[];
    static getParameterIndexesWithAnnotations(clazz: any, property: string): number[];
    static getPropertiesNameByParameterAnnotation(clazz: any, annotation: any): string[];
    static getParameterIndexesByAnnotation(clazz: any, property: string, annotation: any): number[];
    static findClassAnnotations(clazz: any): Metadata[];
    static findClassAnnotation(clazz: any, annotation: any): any | null;
    static findPropertyAnnotations(clazz: any, property: string): Metadata[];
    static findPropertyAnnotation(clazz: any, property: string, annotation: any): any | null;
    static findPropertiesNameWithAnnotations(clazz: any): string[];
    static findPropertiesNameByAnnotation(clazz: any, annotation: any): string[];
    static findPropertiesNameByAnnotations(clazz: any, annotations: any[]): string[];
    static findParameterAnnotations(clazz: any, property: string, parameter: number): Metadata[];
    static findParameterAnnotation(clazz: any, property: string, parameter: number, annotation: any): any | null;
    static findPropertiesNameWithParameterAnnotations(clazz: any): string[];
    static findParameterIndexesWithAnnotations(clazz: any, property: string): number[];
    static findPropertiesNameByParameterAnnotation(clazz: any, annotation: any): string[];
    static findPropertiesNameByParameterAnnotations(clazz: any, annotations: any[]): string[];
    static findParameterIndexesByAnnotation(clazz: any, property: string, annotation: any): number[];
    static findParameterIndexesByAnnotations(clazz: any, property: string, annotations: any[]): number[];
    private static unCallback;
    private static search;
    private static recurciveFind;
}
