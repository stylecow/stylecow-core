module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Value();
	element.push(new stylecow.Unit(23, 'px'));
	element.push(new stylecow.Keyword('foo'));
	element.push(new stylecow.String('p'));
	assert.strictEqual('23px foo "p"', element.toString());

	reader = stylecow.Reader.fromString('  23px     foo    "p"  bar(  ola )');
	element = stylecow.Value.create(reader);
	assert.strictEqual(4, element.length);
	assert.strictEqual('Unit', element[0].type);
	assert.strictEqual('Keyword', element[1].type);
	assert.strictEqual('String', element[2].type);
	assert.strictEqual('Function', element[3].type);
	assert.strictEqual('23px foo "p" bar(ola)', element.toString());

	reader = stylecow.Reader.fromString('@ non-valid');
	element = stylecow.Value.create(reader);
	assert.strictEqual(undefined, element);
};
