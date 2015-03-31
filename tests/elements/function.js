module.exports = function (stylecow, assert) {
	var element, subelement, reader;

	element = new stylecow.Function('-moz-calc');
	subelement = new stylecow.Value();
	element.push(subelement);
	subelement.push(new stylecow.Unit(23, 'px'));
	subelement.push(new stylecow.Keyword('foo'));
	subelement.push(new stylecow.String('p'));
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('calc', element.name);
	assert.strictEqual('-moz-calc(23px foo "p")', element.toString());

	reader = stylecow.Reader.fromString('-moz-foo(13px, 15px 16px ola(ola))');
	element = stylecow.Function.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('foo', element.name);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('Value', element[0].type);
	assert.strictEqual('Value', element[0].type);
	assert.strictEqual('Unit', element[0][0].type);
	assert.strictEqual('Unit', element[1][0].type);
	assert.strictEqual('Unit', element[1][1].type);
	assert.strictEqual('Function', element[1][2].type);
};
