# GollumTS-Annotation

[![Build Status](https://travis-ci.com/GollumJS/gollumts-annotation.svg?branch=master)](https://app.travis-ci.com/github/GollumJS/GollumTS-Annotation)
[![Coverage](https://coveralls.io/repos/github/GollumJS/GollumTS-Annotation/badge.svg?branch=master)](https://coveralls.io/github/GollumJS/GollumTS-Annotation)
[![Licence](https://img.shields.io/npm/l/@gollum-ts/annotation.svg?colorB=4B9081)](https://github.com/GollumJS/GollumTS-Annotation/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@gollum-ts/annotation.svg)](https://www.npmjs.com/package/@gollum-ts/annotation)
[![Discord](https://img.shields.io/discord/671741944149573687?color=purple&label=discord)](https://discord.gg/xMBc5SQ)

Add persistent annotation on TS class.


## Install
```
npm install @gollum-ts/annotation
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
