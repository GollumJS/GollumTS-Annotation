import {Writer, Reader} from "..";

export function CustomAnnotation(data1, data2) {
	
	return Writer.write(CustomAnnotation, {
		data1: data1,
		data2: data2
	});
}

@CustomAnnotation('Hello', 'world')
export class MyClass {
	
	@CustomAnnotation('Every', 'body')
	public field ;
	
	public no_anno ;
	
}

console.log('Class annotation');

let myObject = new MyClass();

let annotations1 = Reader.findClassAnnotations(MyClass);
let annotations2 = Reader.findClassAnnotations(myObject.constructor);

console.log(annotations1);
console.log(annotations2);


let annotation1 = Reader.findClassAnnotation(MyClass, CustomAnnotation);
let annotation2 = Reader.findClassAnnotation(myObject.constructor, CustomAnnotation);

console.log(annotation1);
console.log(annotation2);

console.log('Property annotation');

let annotations3 = Reader.findPropertyAnnotations(MyClass, 'field');
let annotations4 = Reader.findPropertyAnnotations(myObject.constructor, 'field');

console.log(annotations3);
console.log(annotations4);

let annotation3 = Reader.findPropertyAnnotation(MyClass, 'field', CustomAnnotation);
let annotation4 = Reader.findPropertyAnnotation(myObject.constructor, 'field', CustomAnnotation);

console.log(annotation3);
console.log(annotation4);

console.log('List properties for annotations');

let properties1: string[] = Reader.findPropertiesNameWithAnnotations(MyClass);

console.log(properties1);

let properties2: string[] = Reader.findPropertiesNameByAnnotation(MyClass, CustomAnnotation);
let properties3: string[] = Reader.findPropertiesNameByAnnotations(MyClass, [ CustomAnnotation ]);

console.log(properties2);
console.log(properties3);
