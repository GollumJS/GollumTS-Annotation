"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
function CustomAnnotation(data1, data2) {
    return __1.Writer.write(CustomAnnotation, {
        data1: data1,
        data2: data2
    });
}
exports.CustomAnnotation = CustomAnnotation;
var MyClass = (function () {
    function MyClass() {
    }
    __decorate([
        CustomAnnotation('Every', 'body')
    ], MyClass.prototype, "field", void 0);
    MyClass = __decorate([
        CustomAnnotation('Hello', 'world')
    ], MyClass);
    return MyClass;
}());
exports.MyClass = MyClass;
console.log('Class annotation');
var myObject = new MyClass();
var annotations1 = __1.Reader.findClassAnnotations(MyClass);
var annotations2 = __1.Reader.findClassAnnotations(myObject.constructor);
console.log(annotations1);
console.log(annotations2);
var annotation1 = __1.Reader.findClassAnnotation(MyClass, CustomAnnotation);
var annotation2 = __1.Reader.findClassAnnotation(myObject.constructor, CustomAnnotation);
console.log(annotation1);
console.log(annotation2);
console.log('Property annotation');
var annotations3 = __1.Reader.findPropertyAnnotations(MyClass, 'field');
var annotations4 = __1.Reader.findPropertyAnnotations(myObject.constructor, 'field');
console.log(annotations3);
console.log(annotations4);
var annotation3 = __1.Reader.findPropertyAnnotation(MyClass, 'field', CustomAnnotation);
var annotation4 = __1.Reader.findPropertyAnnotation(myObject.constructor, 'field', CustomAnnotation);
console.log(annotation3);
console.log(annotation4);
console.log('List properties for annotations');
var properties1 = __1.Reader.findPropertiesNameWithAnnotations(MyClass);
console.log(properties1);
var properties2 = __1.Reader.findPropertiesNameByAnnotation(MyClass, CustomAnnotation);
var properties3 = __1.Reader.findPropertiesNameByAnnotations(MyClass, [CustomAnnotation]);
console.log(properties2);
console.log(properties3);
//# sourceMappingURL=hello-world.js.map