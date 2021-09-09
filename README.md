# GollumTS-Annotation

Add persistent annotation on TS class.


## Install
```
npm install @gollumts/annotation
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

	public method(
	    @CustomAnnotation('param', '1') param1,
        @CustomAnnotation('param', '2') param2
    ) {}


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
//        annotation: CustomAnnotation,
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
let annotations = Reader.findPropertyAnnotations(myObject.constructor, 'field');
// annotations: Metatdata = [
//    0: {
//        annotation: CustomAnnotation,
//        data: {
//             data1: 'Hello',
//             data1: 'world'
//        }
//    }
// ]
// Property annotation //

let annotations = Reader.findParameterAnnotation(MyClass, 'field', 0);
let annotations = Reader.findParameterAnnotation(myObject.constructor, 'field', 0);
// annotations: Metatdata = [
//    0: {
//        annotation: CustomAnnotation,
//        data: {
//             data1: 'param',
//             data1: '1'
//        }
//    }
// ]

let annotations = Reader.findParameterAnnotation(MyClass, 'field', 1);
let annotations = Reader.findParameterAnnotation(myObject.constructor, 'field', 1);
// annotations: Metatdata = [
//    0: {
//        annotation: CustomAnnotation,
//        data: {
//             data1: 'param',
//             data1: '2'
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

let properties: string[] = Reader.findPropertiesNameByAnnotation(MyClass, CustomAnnotation);
let properties: string[] = Reader.findPropertiesNameByAnnotations(MyClass, [ CustomAnnotation, ... ]);
// properties = [
//  'field'
// ]


```
