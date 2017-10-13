# GollumTS-Annotation

Add persistant annotation on TS class.


## Install
```
npm install gollumts-annotation
```



## Create annotation

```typescript
import {Writer} from "gollumts-annotation";


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
	
}

```

## Read annotation


```typescript
import {Reader} from "gollumts-annotation";

let myObject = new MyClass();

// Class annotation //

let annotations = Reader.findClassAnnotations(MyClass);
let annotations = Reader.findClassAnnotations(myObject.constructor); 
// annotations: Metatdata = [ 
//    0: { 
//        annotation: 
//        data: { 
//             data1: 'Hello', 
//             data1: 'world' 
//        } 
//    }
// ]

let annotation = Reader.findClassAnnotation(MyClass, CustomAnnotation);
let annotation = Reader.findClassAnnotation(myObject.constructor, CustomAnnotation); 
// annotation = { data1: 'Hello', data1: 'world' }

// Property annotation //

let annotations = Reader.findPropertyAnnotations(MyClass, 'field');
let annotations = Reader.findPropertyAnnotations(myObject, 'field');
// annotations: Metatdata = [ 
//    0: { 
//        annotation: 
//        data: { 
//             data1: 'Hello', 
//             data1: 'world' 
//        } 
//    }
// ]

let annotation = Reader.findPropertyAnnotation(MyClass, 'field', CustomAnnotation);
let annotation = Reader.findPropertyAnnotation(myObject.constructor, 'field', CustomAnnotation);
// annotation = { data1: 'Every', data1: 'body' }

```

## Create annotation with callback

```typescript
import {Writer} from "gollumts-annotation";

export function CustomAnnotationCallback(data1, data2) {
	return Writer.write(CustomAnnotationCallback, {
		data1: data1,
		data2: data2
	}, (target: any, propertyKey: string = null, descriptor: PropertyDescriptor = null) => {
		// Your implementation
	});
}
```


## List properties for annotations

```typescript
import {Reader} from "gollumts-annotation";

let properties: string[] = Reader.findPropertiesNameByAnnotations(MyClass, CustomAnnotation);
let properties: string[] = Reader.findPropertiesNameByAnnotations(MyClass, [ CustomAnnotation, ... ]);
// properties = [
//  'field'
// ]


```