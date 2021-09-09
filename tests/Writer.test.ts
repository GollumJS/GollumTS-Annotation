import {Writer} from '../src';

describe('Writer test', () => {

	beforeEach(() => {
		Writer.annotations.clear();
	});
	
	test('write class', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		@Annotation('aaa')
		@Annotation('bbb')
		@Annotation2()
		class A {
		}

		const entries = Array.from(Writer.annotations.entries());
		expect(entries.length).toStrictEqual(1);

		const [ key, metadata ] = entries[0] as any[];

		expect(key).toStrictEqual(A);
		expect(metadata.clazz.length).toStrictEqual(3);

		expect(metadata.clazz[0].annotation).toStrictEqual(Annotation2);
		expect(metadata.clazz[1].annotation).toStrictEqual(Annotation);
		expect(metadata.clazz[2].annotation).toStrictEqual(Annotation);

		expect(metadata.clazz[0].data).toEqual({});
		expect(metadata.clazz[1].data).toEqual({ paramClass: 'bbb' });
		expect(metadata.clazz[2].data).toEqual({ paramClass: 'aaa' });

		expect(metadata.properties).toEqual({});
		expect(metadata.parameters).toEqual({});
		expect(metadata.cache).toEqual({});
	});

	test('write property', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			@Annotation('aaa')
			@Annotation('bbb')
			@Annotation2()
			property;
		}

		const entries = Array.from(Writer.annotations.entries());
		expect(entries.length).toStrictEqual(1);

		const [ key, metadata ] = entries[0] as any[];

		expect(key).toStrictEqual(A.prototype);

		expect(metadata.clazz).toEqual([]);

		expect(Object.keys(metadata.properties)).toEqual(['property']);
		expect(metadata.properties['property'].length).toStrictEqual(3);

		expect(metadata.properties['property'][0].annotation).toStrictEqual(Annotation2);
		expect(metadata.properties['property'][1].annotation).toStrictEqual(Annotation);
		expect(metadata.properties['property'][2].annotation).toStrictEqual(Annotation);

		expect(metadata.properties['property'][0].data).toEqual({});
		expect(metadata.properties['property'][1].data).toEqual({ paramClass: 'bbb' });
		expect(metadata.properties['property'][2].data).toEqual({ paramClass: 'aaa' });

		expect(metadata.parameters).toEqual({});
		expect(metadata.cache).toEqual({});
	});

	test('write property', () => {

		const Annotation = (value) => {
			return Writer.write(Annotation, { paramClass: value });
		};
		const Annotation2 = () => {
			return Writer.write(Annotation2);
		};

		class A {
			method(
				@Annotation('aaa')
				@Annotation('bbb')
				@Annotation2()
				param1,
				@Annotation2()
				param2,
			) {};
		}

		const entries = Array.from(Writer.annotations.entries());
		expect(entries.length).toStrictEqual(1);

		const [ key, metadata ] = entries[0] as any[];

		expect(key).toStrictEqual(A.prototype);

		expect(metadata.clazz).toEqual([]);
		expect(metadata.properties).toEqual({})

		expect(Object.keys(metadata.parameters)).toEqual(['method']);
		expect(Object.keys(metadata.parameters['method'])).toEqual([ '0', '1' ]);
		expect(metadata.parameters['method'][0].length).toStrictEqual(3);
		expect(metadata.parameters['method'][1].length).toStrictEqual(1);

		expect(metadata.parameters['method'][0][0].annotation).toStrictEqual(Annotation2);
		expect(metadata.parameters['method'][0][1].annotation).toStrictEqual(Annotation);
		expect(metadata.parameters['method'][0][2].annotation).toStrictEqual(Annotation);
		expect(metadata.parameters['method'][1][0].annotation).toStrictEqual(Annotation2);

		expect(metadata.parameters['method'][0][0].data).toEqual({});
		expect(metadata.parameters['method'][0][1].data).toEqual({ paramClass: 'bbb' });
		expect(metadata.parameters['method'][0][2].data).toEqual({ paramClass: 'aaa' });
		expect(metadata.parameters['method'][1][0].data).toEqual({});

		expect(metadata.cache).toEqual({});
	});

	test('write with callback', () => {
		
		const result = [];
		
		const Annotation = () => {
			return Writer.write(Annotation, {}, (target, property, parameter) => {
				result.push({
					target,
					property,
					parameter
				})
			});
		};

		@Annotation()
		class A {
			
			@Annotation()
			property;

			@Annotation()
			method(
				@Annotation() param1,
				@Annotation() param2
			){}

		}
		
		expect(result.length).toStrictEqual(5);
		
		expect(result[0].target).toStrictEqual(A.prototype);
		expect(result[1].target).toStrictEqual(A.prototype);
		expect(result[2].target).toStrictEqual(A.prototype);
		expect(result[3].target).toStrictEqual(A.prototype);
		expect(result[4].target).toStrictEqual(A);

		expect(result[0].property).toStrictEqual('property');
		expect(result[1].property).toStrictEqual('method');
		expect(result[2].property).toStrictEqual('method');
		expect(result[3].property).toStrictEqual('method');
		expect(result[4].property).toStrictEqual(null);

		expect(result[0].parameter).toStrictEqual(null);
		expect(result[1].parameter).toStrictEqual(1);
		expect(result[2].parameter).toStrictEqual(0);
		expect(result[3].parameter).toStrictEqual(null);
		expect(result[4].parameter).toStrictEqual(null);
	});

	test('write with callback class return', () => {

		class A {
		}

		const Annotation = () => {
			return Writer.write(Annotation, {}, (target, property, parameter) => {
				return A;
			});
		};
		
		@Annotation()
		class B {
		}

		const b = new B;
		expect(b.constructor).toStrictEqual(A);
	});
	
});
