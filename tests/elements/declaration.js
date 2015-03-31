module.exports = function (stylecow, assert) {
	var element, subelement, reader;

	element = new stylecow.Declaration('-moz-foo');
	subelement = new stylecow.Value();
	element.push(subelement);
	subelement.push(new stylecow.Unit(23, 'px'));
	subelement.push(new stylecow.Keyword('foo'));
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('foo', element.name);
	assert.strictEqual('-moz-foo: 23px foo;', element.toString());

	reader = stylecow.Reader.fromString('-ms-flex:    1 3 50%, var(foo)');
	element = stylecow.Declaration.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('flex', element.name);
	assert.strictEqual('ms', element.vendor);
	assert.strictEqual('Value', element[0].type);
	assert.strictEqual(3, element[0].length);
	assert.strictEqual(1, element[1].length);
	assert.strictEqual('Value', element[1].type);
	assert.strictEqual('Number', element[0][0].type);
	assert.strictEqual('Number', element[0][1].type);
	assert.strictEqual('Unit', element[0][2].type);
	assert.strictEqual('Function', element[1][0].type);
};
