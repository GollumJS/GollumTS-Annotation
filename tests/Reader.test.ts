import {Writer, Reader, Metadata, Callback, CallbackParamObject} from '../src';

describe('Reader test', () => {

	beforeEach(() => {
		Writer.annotations.clear();
	});
	
	test('getClassAnnotations', () => {
		
		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		@Annotation('aaa')
		@Annotation2()
		class A {
		}
		
		@Annotation('bbb')
		class B extends A {
		}

		const metadatas = Reader.getClassAnnotations(B);
		expect(metadatas.length).toStrictEqual(1);
		expect(metadatas[0].annotation).toStrictEqual(Annotation);
		expect(metadatas[0].data).toEqual({ paramClass: 'bbb' });
	});

	test('getClassAnnotations no annotation', () => {
		class A {
		}
		const metadatas = Reader.getClassAnnotations(A);
		expect(metadatas.length).toStrictEqual(0);
	});



	test('getClassAnnotation', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3, { hello: 'world' });
		};

		@Annotation('aaa')
		@Annotation('bbb')
		@Annotation2()
		class A {
		}

		@Annotation3()
		class B extends A {
		}

		const data1 = Reader.getClassAnnotation(B, Annotation);
		const data2 = Reader.getClassAnnotation(B, Annotation2);
		const data3 = Reader.getClassAnnotation(B, Annotation3);

		expect(data1).toBeNull();
		expect(data2).toBeNull();
		expect(data3).toEqual({ hello: 'world' });
	});

	test('getPropertyAnnotations', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			@Annotation('aaa')
			@Annotation('bbb')
			paramA;
		}

		class B extends A {
			@Annotation2()
			paramB;
		}

		const metadatasA = Reader.getPropertyAnnotations(B.prototype, 'paramA');
		const metadatasB = Reader.getPropertyAnnotations(B.prototype, 'paramB');

		expect(metadatasA.length).toStrictEqual(0);
		expect(metadatasB.length).toStrictEqual(1);

		expect(metadatasB[0].annotation).toStrictEqual(Annotation2);
		expect(metadatasB[0].data).toEqual({});
	});

	test('getPropertyAnnotations no annotation', () => {

		class A {
			paramA;
		}
		
		const metadatasA = Reader.getPropertyAnnotations(A.prototype, 'paramA');
		
		expect(metadatasA.length).toStrictEqual(0);
	});

	test('getPropertyAnnotation', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3, { hello: 'world' });
		};

		class A {
			@Annotation('aaa')
			@Annotation2()
			paramA;
		}

		class B extends A {
			@Annotation3()
			paramB;
		}

		const data1 = Reader.getPropertyAnnotation(B.prototype, 'paramA', Annotation);
		const data2 = Reader.getPropertyAnnotation(B.prototype, 'paramA', Annotation2);
		const data3 = Reader.getPropertyAnnotation(B.prototype, 'paramB', Annotation3);

		expect(data1).toBeNull();
		expect(data2).toBeNull();
		expect(data3).toEqual({ hello: 'world' });
	});

	test('getPropertyAnnotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};

		class A {
			@Annotation()
			paramA1;

			@Annotation()
			paramA2;

			paramA3;
		}

		class B extends A {
			@Annotation3()
			paramB1;

			paramB2;
		}

		const properties = Reader.getPropertiesNameWithAnnotations(B.prototype);

		expect(properties).toEqual([ 'paramB1' ]);
	});

	test('getPropertyAnnotation no param', () => {

		class A {
		}

		const properties = Reader.getPropertiesNameWithAnnotations(A.prototype);

		expect(properties).toEqual([]);
	});

	test('getParameterAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation, { hello: 'world1' });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2, { hello: 'world2' });
		};

		class A {
			methodA1(
				@Annotation() @Annotation() @Annotation2() param1,
				param2,
			) {}
			methodA2(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				@Annotation() param1,
				@Annotation2() param2,
			) {}
			methodB2(
				param1
			) {}
		}

		const metadataA1_0 = Reader.getParameterAnnotations(B.prototype, 'methodA1', 0);
		const metadataA1_1 = Reader.getParameterAnnotations(B.prototype, 'methodA1', 1);
		const metadataA2_0 = Reader.getParameterAnnotations(B.prototype, 'methodA2', 0);
		const metadataB1_0 = Reader.getParameterAnnotations(B.prototype, 'methodB1', 0);
		const metadataB1_1 = Reader.getParameterAnnotations(B.prototype, 'methodB1', 1);
		const metadataB2_0 = Reader.getParameterAnnotations(B.prototype, 'methodB2', 0);

		expect(metadataA1_0.length).toStrictEqual(0);
		expect(metadataA1_1.length).toStrictEqual(0);
		expect(metadataA2_0.length).toStrictEqual(0);
		expect(metadataB1_0.length).toStrictEqual(1);
		expect(metadataB1_1.length).toStrictEqual(1);
		expect(metadataB2_0.length).toStrictEqual(0);

		expect(metadataB1_0[0].annotation).toStrictEqual(Annotation);
		expect(metadataB1_1[0].annotation).toStrictEqual(Annotation2);

		expect(metadataB1_0[0].data).toStrictEqual({ hello: 'world1' });
		expect(metadataB1_1[0].data).toStrictEqual({ hello: 'world2' });
	});

	test('getParameterAnnotations no annotation', () => {

		class A {
			method(param) {}
		}

		const metadatas = Reader.getParameterAnnotations(A.prototype, 'method', 0);

		expect(metadatas.length).toStrictEqual(0);
	});

	test('getParameterAnnotation', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, {hello: value});
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2, {hello: 'world2'});
		};

		class A {
			methodA1(
				@Annotation('aaa') @Annotation('bbb') @Annotation2() param1,
				@Annotation('ddd') param2,
			) {
			}

			methodA2(
				param1
			) {
			}
		}

		class B extends A {
			methodB1(
				@Annotation('ccc') param1,
				@Annotation2() param2,
			) {
			}

			methodB2(
				param1
			) {
			}
		}

		const dataA1_0 = Reader.getParameterAnnotation(B.prototype, 'methodA1', 0, Annotation);
		const dataA1_1 = Reader.getParameterAnnotation(B.prototype, 'methodA1', 1, Annotation);
		const dataA2_0 = Reader.getParameterAnnotation(B.prototype, 'methodA2', 0, Annotation);
		const dataB1_0 = Reader.getParameterAnnotation(B.prototype, 'methodB1', 0, Annotation);
		const dataB1_1 = Reader.getParameterAnnotation(B.prototype, 'methodB1', 1, Annotation);
		const dataB2_0 = Reader.getParameterAnnotation(B.prototype, 'methodB2', 0, Annotation);


		expect(dataA1_0).toBeNull();
		expect(dataA1_1).toBeNull();
		expect(dataA2_0).toBeNull();
		expect(dataB1_0).toStrictEqual({hello: 'ccc'});
		expect(dataB1_1).toBeNull();
		expect(dataB2_0).toBeNull();
		
	});

	test('getPropertiesNameWithParameterAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			methodA1(
				@Annotation() @Annotation() @Annotation2() param1,
				@Annotation() param2,
			) {}
			methodA2(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				@Annotation() param1,
				@Annotation2() param2,
			) {}
			methodB2(
				param1
			) {}
		}

		const properties = Reader.getPropertiesNameWithParameterAnnotations(B.prototype);

		expect(properties).toEqual([ 'methodB1' ])
	});


	test('getPropertiesNameWithParameterAnnotations no annotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};

		class A {
			methodA1(
				param1,
				param2,
			) {}
			methodA2(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				param1,
				param2,
			) {}
			methodB2(
				param1
			) {}
		}

		const properties = Reader.getPropertiesNameWithParameterAnnotations(B.prototype);

		expect(properties).toEqual([])
	});

	test('getPropertiesNameByParameterAnnotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};

		class A {
			methodA1(
				@Annotation() @Annotation() @Annotation2() @Annotation3() param1,
				@Annotation() param2,
			) {}
			methodA2(
				@Annotation() param1
			) {}
			methodA3(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				@Annotation() @Annotation3() param1,
				@Annotation2() param2,
			) {}
			methodB2(
				@Annotation() param1
			) {}
		}

		const properties = Reader.getPropertiesNameByParameterAnnotation(B.prototype, Annotation3);

		expect(properties).toEqual([ 'methodB1' ])
	});

	test('getPropertiesNameByParameterAnnotation no annotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};

		class A {
			methodA1(
				param1,
				param2,
			) {}
			methodA2(
				param1
			) {}
			methodA3(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				param1,
				param2,
			) {}
			methodB2(
				param1
			) {}
		}

		const properties = Reader.getPropertiesNameByParameterAnnotation(B.prototype, Annotation);

		expect(properties).toEqual([])
	});

	test('getParameterIndexesWithAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			methodA1(
				@Annotation() param1,
				param2,
				@Annotation2() param3,
			) {}
			methodA2(param1) {}
		}

		class B extends A {
			methodB1(
				param1,
				param2,
				@Annotation2() param3,
			) {}
			methodB2(param1) {}
		}

		const parametersA1 = Reader.getParameterIndexesWithAnnotations(B.prototype, 'methodA1');
		const parametersA2 = Reader.getParameterIndexesWithAnnotations(B.prototype, 'methodA2');
		const parametersB1 = Reader.getParameterIndexesWithAnnotations(B.prototype, 'methodB1');
		const parametersB2 = Reader.getParameterIndexesWithAnnotations(B.prototype, 'methodB2');

		expect(parametersA1).toEqual([]);
		expect(parametersA2).toEqual([]);
		expect(parametersB1).toEqual([ 2 ]);
		expect(parametersB2).toEqual([]);
	});

	test('getParameterIndexesByAnnotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			methodA1(
				@Annotation() param1,
				param2,
				@Annotation2() param3,
			) {}
			methodA2(param1) {}
		}

		class B extends A {
			methodB1(
				param1,
				@Annotation() param2,
				@Annotation2() param3,
			) {}
			methodB2(param1) {}
		}

		const parametersA1 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodA1', Annotation2);
		const parametersA2 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodA2', Annotation2);
		const parametersB1 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodB1', Annotation2);
		const parametersB2 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodB2', Annotation2);

		expect(parametersA1).toEqual([]);
		expect(parametersA2).toEqual([]);
		expect(parametersB1).toEqual([ 2 ]);
		expect(parametersB2).toEqual([]);
	});

	test('getParameterIndexesByAnnotation no annotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};

		class A {
			methodA1(
				param1,
				param2,
				param3,
			) {}
			methodA2(param1) {}
		}

		class B extends A {
			methodB1(
				param1,
				param2,
				param3,
			) {}
			methodB2(param1) {}
		}

		const parametersA1 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodA1', Annotation);
		const parametersA2 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodA2', Annotation);
		const parametersB1 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodB1', Annotation);
		const parametersB2 = Reader.getParameterIndexesByAnnotation(B.prototype, 'methodB2', Annotation);

		expect(parametersA1).toEqual([]);
		expect(parametersA2).toEqual([]);
		expect(parametersB1).toEqual([]);
		expect(parametersB2).toEqual([]);
	});

	test('findPropertiesNameByAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};
		const Annotation4 = () => {
			return Writer.write(Annotation4);
		};

		class A {
			@Annotation()
			paramA1;

			@Annotation()
			@Annotation2()
			paramA2;

			paramA3;
		}

		class B extends A {
			@Annotation()
			@Annotation3()
			paramB1;

			paramB2;
		}

		const properties1 = Reader.getPropertiesNameByAnnotation(B.prototype, Annotation);
		const properties2 = Reader.getPropertiesNameByAnnotation(B.prototype, Annotation2);
		const properties3 = Reader.getPropertiesNameByAnnotation(B.prototype, Annotation3);
		const properties4 = Reader.getPropertiesNameByAnnotation(B.prototype, Annotation4);

		expect(properties1).toEqual([ 'paramB1' ]);
		expect(properties2).toEqual([]);
		expect(properties3).toEqual([ 'paramB1' ]);
		expect(properties4).toEqual([]);
	});

	test('findPropertiesNameByAnnotations no annotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		
		class A {
		}

		const properties = Reader.getPropertiesNameByAnnotation(A.prototype, Annotation);

		expect(properties).toEqual([]);
	});

	test('findClassAnnotations', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		@Annotation('aaa')
		@Annotation('bbb')
		class A {
		}

		@Annotation2()
		class B extends A {
		}

		const metadatas = Reader.findClassAnnotations(B);

		expect(metadatas.length).toStrictEqual(3);

		expect(metadatas[0].annotation).toStrictEqual(Annotation2);
		expect(metadatas[1].annotation).toStrictEqual(Annotation);
		expect(metadatas[2].annotation).toStrictEqual(Annotation);

		expect(metadatas[0].data).toEqual({});
		expect(metadatas[1].data).toEqual({ paramClass: 'bbb' });
		expect(metadatas[2].data).toEqual({ paramClass: 'aaa' });

	});

	test('findClassAnnotation', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3, { hello: 'world' });
		};

		@Annotation('aaa')
		@Annotation('bbb')
		@Annotation2()
		class A {
		}

		@Annotation3()
		class B extends A {
		}

		const data1 = Reader.findClassAnnotation(B, Annotation);
		const data2 = Reader.findClassAnnotation(B, Annotation2);
		const data3 = Reader.findClassAnnotation(B, Annotation3);

		expect(data1).toEqual({ paramClass: 'bbb' });
		expect(data2).toEqual({});
		expect(data3).toEqual({ hello: 'world' });
	});

	test('findPropertyAnnotations', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			@Annotation('aaa')
			@Annotation('bbb')
			paramA;
		}

		class B extends A {
			@Annotation2()
			paramB;
		}

		const metadatasA = Reader.findPropertyAnnotations(B, 'paramA');
		const metadatasB = Reader.findPropertyAnnotations(B, 'paramB');

		expect(metadatasA.length).toStrictEqual(2);
		expect(metadatasB.length).toStrictEqual(1);

		expect(metadatasA[0].annotation).toStrictEqual(Annotation);
		expect(metadatasA[1].annotation).toStrictEqual(Annotation);
		expect(metadatasB[0].annotation).toStrictEqual(Annotation2);

		expect(metadatasA[0].data).toEqual({ paramClass: 'bbb' });
		expect(metadatasA[1].data).toEqual({ paramClass: 'aaa' });
		expect(metadatasB[0].data).toEqual({});

	});

	test('findPropertyAnnotation', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3, { hello: 'world' });
		};

		class A {
			@Annotation('aaa')
			@Annotation('bbb')
			@Annotation2()
			paramA;
		}

		class B extends A {
			@Annotation3()
			paramB;
		}

		const data1 = Reader.findPropertyAnnotation(B, 'paramA', Annotation);
		const data2 = Reader.findPropertyAnnotation(B, 'paramA', Annotation2);
		const data3 = Reader.findPropertyAnnotation(B, 'paramB', Annotation3);

		expect(data1).toEqual({ paramClass: 'bbb' });
		expect(data2).toEqual({});
		expect(data3).toEqual({ hello: 'world' });
	});

	test('findPropertyAnnotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};

		class A {
			@Annotation()
			paramA1;

			@Annotation()
			paramA2;

			@Annotation2()
			paramA3;

			paramA4;
		}

		class B extends A {
			@Annotation3()
			paramB1;

			paramB2;
		}

		const properties = Reader.findPropertiesNameWithAnnotations(B);

		expect(properties).toEqual([ 'paramB1', 'paramA1', 'paramA2', 'paramA3' ]);
	});

	test('findPropertiesNameByAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};
		const Annotation4 = () => {
			return Writer.write(Annotation4);
		};

		class A {
			@Annotation()
			paramA1;

			@Annotation()
			@Annotation2()
			paramA2;

			paramA3;
		}

		class B extends A {
			@Annotation()
			@Annotation3()
			paramB1;

			paramB2;
		}

		const properties1 = Reader.findPropertiesNameByAnnotation(B, Annotation);
		const properties2 = Reader.findPropertiesNameByAnnotation(B, Annotation2);
		const properties3 = Reader.findPropertiesNameByAnnotation(B, Annotation3);
		const properties4 = Reader.findPropertiesNameByAnnotation(B, Annotation4);

		expect(properties1).toEqual([ 'paramB1', 'paramA1', 'paramA2' ]);
		expect(properties2).toEqual([ 'paramA2' ]);
		expect(properties3).toEqual([ 'paramB1' ]);
		expect(properties4).toEqual([]);
	});
	
	test('findPropertiesNameByAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};
		const Annotation4 = () => {
			return Writer.write(Annotation4);
		};

		class A {
			@Annotation()
			paramA1;

			@Annotation()
			@Annotation2()
			paramA2;

			paramA3;
		}

		class B extends A {
			@Annotation()
			@Annotation3()
			paramB1;

			paramB2;
		}

		const properties = Reader.findPropertiesNameByAnnotations(B, [ Annotation2, Annotation3 ]);

		expect(properties).toEqual([ 'paramA2', 'paramB1' ]);
	});

	test('findParameterAnnotations', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { hello: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2, { hello: 'world2' });
		};

		class A {
			methodA1(
				@Annotation('aaa') @Annotation('bbb') @Annotation2() param1,
				param2,
			) {}
			methodA2(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				@Annotation('ccc') param1,
				@Annotation2() param2,
			) {}
			methodB2(
				param1
			) {}
		}

		const metadataA1_0 = Reader.findParameterAnnotations(B.prototype, 'methodA1', 0);
		const metadataA1_1 = Reader.findParameterAnnotations(B.prototype, 'methodA1', 1);
		const metadataA2_0 = Reader.findParameterAnnotations(B.prototype, 'methodA2', 0);
		const metadataB1_0 = Reader.findParameterAnnotations(B.prototype, 'methodB1', 0);
		const metadataB1_1 = Reader.findParameterAnnotations(B.prototype, 'methodB1', 1);
		const metadataB2_0 = Reader.findParameterAnnotations(B.prototype, 'methodB2', 0);

		expect(metadataA1_0.length).toStrictEqual(3);
		expect(metadataA1_1.length).toStrictEqual(0);
		expect(metadataA2_0.length).toStrictEqual(0);
		expect(metadataB1_0.length).toStrictEqual(1);
		expect(metadataB1_1.length).toStrictEqual(1);
		expect(metadataB2_0.length).toStrictEqual(0);

		expect(metadataA1_0[0].annotation).toStrictEqual(Annotation2);
		expect(metadataA1_0[1].annotation).toStrictEqual(Annotation);
		expect(metadataA1_0[2].annotation).toStrictEqual(Annotation);
		expect(metadataB1_0[0].annotation).toStrictEqual(Annotation);
		expect(metadataB1_1[0].annotation).toStrictEqual(Annotation2);

		expect(metadataA1_0[0].data).toStrictEqual({ hello: 'world2' });
		expect(metadataA1_0[1].data).toStrictEqual({ hello: 'bbb' });
		expect(metadataA1_0[2].data).toStrictEqual({ hello: 'aaa' });
		expect(metadataB1_0[0].data).toStrictEqual({ hello: 'ccc' });
		expect(metadataB1_1[0].data).toStrictEqual({ hello: 'world2' });
	});

	test('findParameterAnnotations no annotation', () => {

		class A {
			method(param) {}
		}
		
		class B extends A {
			method2(param) {}
		}

		const metadatas1 = Reader.findParameterAnnotations(B, 'method', 0);
		const metadatas2 = Reader.findParameterAnnotations(B, 'method2', 0);

		expect(metadatas1.length).toStrictEqual(0);
		expect(metadatas2.length).toStrictEqual(0);
	});

	test('findParameterAnnotation', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { hello: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2, { hello: 'world2' });
		};

		class A {
			methodA1(
				@Annotation('aaa') @Annotation('bbb') @Annotation2() param1,
				@Annotation('ddd') param2,
			) {}
			methodA2(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				@Annotation('ccc') param1,
				@Annotation2() param2,
			) {}
			methodB2(
				param1
			) {}
		}

		const dataA1_0 = Reader.findParameterAnnotation(B, 'methodA1', 0, Annotation);
		const dataA1_1 = Reader.findParameterAnnotation(B, 'methodA1', 1, Annotation);
		const dataA2_0 = Reader.findParameterAnnotation(B, 'methodA2', 0, Annotation);
		const dataB1_0 = Reader.findParameterAnnotation(B, 'methodB1', 0, Annotation);
		const dataB1_1 = Reader.findParameterAnnotation(B, 'methodB1', 1, Annotation);
		const dataB2_0 = Reader.findParameterAnnotation(B, 'methodB2', 0, Annotation);


		expect(dataA1_0).toStrictEqual({ hello: 'bbb' });
		expect(dataA1_1).toStrictEqual({ hello: 'ddd' });
		expect(dataA2_0).toBeNull();
		expect(dataB1_0).toStrictEqual({ hello: 'ccc' });
		expect(dataB1_1).toBeNull();
		expect(dataB2_0).toBeNull();
		
	});

	test('findPropertiesNameWithParameterAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			methodA1(
				@Annotation() @Annotation() @Annotation2() param1,
				@Annotation() param2,
			) {}
			methodA2(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				@Annotation() param1,
				@Annotation2() param2,
			) {}
			methodB2(
				param1
			) {}
		}

		const properties = Reader.findPropertiesNameWithParameterAnnotations(B);
		
		expect(properties).toEqual([ 'methodB1', 'methodA1' ])
	});

	test('findPropertiesNameByParameterAnnotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};

		class A {
			methodA1(
				@Annotation() @Annotation() @Annotation2() @Annotation3() param1,
				@Annotation() param2,
			) {}
			methodA2(
				@Annotation() param1
			) {}
			methodA3(
				param1
			) {}
		}

		class B extends A {
			methodB1(
				@Annotation() @Annotation3() param1,
				@Annotation2() param2,
			) {}
			methodB2(
				@Annotation() param1
			) {}
		}

		const properties = Reader.findPropertiesNameByParameterAnnotation(B.prototype, Annotation3);
		expect(properties).toEqual([ 'methodB1', 'methodA1' ]);

		const properties2 = Reader.findPropertiesNameByParameterAnnotation(B.prototype, Annotation3);
		expect(properties2).toEqual([ 'methodB1', 'methodA1' ]);
	});


	test('findPropertiesNameByParameterAnnotation no annotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};

		class A {
		}

		class B extends A {
		}

		const properties = Reader.findPropertiesNameByParameterAnnotation(B.prototype, Annotation);
		expect(properties).toEqual([]);

	});

	test('findParameterIndexesWithAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			methodA1(
				@Annotation() param1,
				param2,
				@Annotation2() param3,
			) {}
			methodA2(param1) {}
		}

		class B extends A {
			methodB1(
				param1,
				param2,
				@Annotation2() param3,
			) {}
			methodB2(param1) {}
		}

		const parametersA1 = Reader.findParameterIndexesWithAnnotations(B, 'methodA1');
		const parametersA2 = Reader.findParameterIndexesWithAnnotations(B, 'methodA2');
		const parametersB1 = Reader.findParameterIndexesWithAnnotations(B, 'methodB1');
		const parametersB2 = Reader.findParameterIndexesWithAnnotations(B, 'methodB2');

		expect(parametersA1).toEqual([ 0, 2 ]);
		expect(parametersA2).toEqual([]);
		expect(parametersB1).toEqual([ 2 ]);
		expect(parametersB2).toEqual([]);
	});

	test('findPropertiesNameByParameterAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};

		class A {
			methodA1(
				@Annotation() @Annotation3() param1,
				param2,
				@Annotation2() param3,
			) {}
			methodA2(param1) {}
		}

		class B extends A {
			methodB1(
				param1,
				param2,
				@Annotation2() param3,
			) {}
			methodB2(
				@Annotation3() param1
			) {}
		}

		const properties = Reader.findPropertiesNameByParameterAnnotations(B, [ Annotation, Annotation3 ]);

		expect(properties).toEqual([ 'methodA1', 'methodB2' ]);
	});

	test('findParameterIndexesByAnnotation', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};

		class A {
			methodA1(
				@Annotation() @Annotation3() param1,
				param2,
				@Annotation() param3,
			) {}
			methodA2(param1) {}
		}

		class B extends A {
			methodB1(
				param1,
				param2,
				@Annotation() @Annotation2() param3,
			) {}
			methodB2(
				@Annotation3() param1
			) {}
		}

		const propertiesA1 = Reader.findParameterIndexesByAnnotation(B, 'methodA1', Annotation);
		const propertiesA2 = Reader.findParameterIndexesByAnnotation(B, 'methodA2', Annotation);
		const propertiesB1 = Reader.findParameterIndexesByAnnotation(B, 'methodB1', Annotation);
		const propertiesB2 = Reader.findParameterIndexesByAnnotation(B, 'methodB2', Annotation);

		expect(propertiesA1).toEqual([ 0, 2 ]);
		expect(propertiesA2).toEqual([]);
		expect(propertiesB1).toEqual([ 2 ]);
		expect(propertiesB2).toEqual([]);
	});

	test('findParameterIndexesByAnnotations', () => {

		const Annotation = () => {
			return Writer.write(Annotation);
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};
		const Annotation3 = () => {
			return Writer.write(Annotation3);
		};

		class A {
			methodA1(
				@Annotation() @Annotation3() param1,
				@Annotation2() param2,
				@Annotation() param3,
			) {}
			methodA2(param1) {}
		}

		class B extends A {
			methodB1(
				@Annotation3() param1,
				param2,
				@Annotation() @Annotation2() param3,
			) {}
			methodB2(
				@Annotation3() param1
			) {}
		}

		const propertiesA1 = Reader.findParameterIndexesByAnnotations(B, 'methodA1', [ Annotation2, Annotation3 ]);
		const propertiesA2 = Reader.findParameterIndexesByAnnotations(B, 'methodA2', [ Annotation2, Annotation3 ]);
		const propertiesB1 = Reader.findParameterIndexesByAnnotations(B, 'methodB1', [ Annotation2, Annotation3 ]);
		const propertiesB2 = Reader.findParameterIndexesByAnnotations(B, 'methodB2', [ Annotation2, Annotation3 ]);

		expect(propertiesA1).toEqual([ 0, 1 ]);
		expect(propertiesA2).toEqual([]);
		expect(propertiesB1).toEqual([ 0, 2 ]);
		expect(propertiesB2).toEqual([ 0 ]);
	});

	test('unCallback', () => {

		const metadata = new Metadata({}, {
			data1: 'data1',
			data2: Callback(() => 'data'+'2'),
			data3: 'data3'
		});
		
		expect(metadata.data.data2).toBeInstanceOf(CallbackParamObject);
		
		const result = Reader['unCallback'](metadata);

		expect(metadata.data.data2).not.toBeInstanceOf(CallbackParamObject);
		
		expect(result.data).toEqual({
			data1: 'data1',
			data2: 'data2',
			data3: 'data3'
		})
	});
	
});
