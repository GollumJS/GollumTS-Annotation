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

let annotations = Reader.getClassAnnotations(MyClass); // annotations = [ { data1: 'Hello', data1: 'world' } ]
let annotations = Reader.getClassAnnotations(myObject); // annotations = [ { data1: 'Hello', data1: 'world' } ]

let annotation = Reader.getClassAnnotation(MyClass, CustomAnnotation); // annotation = { data1: 'Hello', data1: 'world' }
let annotation = Reader.getClassAnnotation(myObject, CustomAnnotation); // annotation = { data1: 'Hello', data1: 'world' }

// Property annotation //

let annotations = Reader.getPropertyAnnotations(MyClass, 'field'); // annotations = [ { data1: 'Every', data1: 'body' } ]
let annotations = Reader.getPropertyAnnotations(myObject, 'field'); // annotations = [ { data1: 'Every', data1: 'body' } ]

let annotation = Reader.getPropertyAnnotation(MyClass, 'field', CustomAnnotation); // annotation = { data1: 'Every', data1: 'body' }
let annotation = Reader.getPropertyAnnotation(myObject, 'field', CustomAnnotation); // annotation = { data1: 'Every', data1: 'body' }


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