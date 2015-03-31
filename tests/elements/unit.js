module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Unit(23, 'px');
	assert.strictEqual('px', element.name);
	assert.strictEqual(23, element.value);
	assert.strictEqual('23px', element.toString());

	reader = stylecow.Reader.fromString('23em');
	element = stylecow.Unit.create(reader);
	assert.strictEqual('em', element.name);
	assert.strictEqual(23, element.value);
	assert.strictEqual('23em', element.toString());

	reader = stylecow.Reader.fromString('.23em');
	element = stylecow.Unit.create(reader);
	assert.strictEqual('em', element.name);
	assert.strictEqual(0.23, element.value);
	assert.strictEqual('0.23em', element.toString());

	reader = stylecow.Reader.fromString('23%');
	element = stylecow.Unit.create(reader);
	assert.strictEqual('%', element.name);
	assert.strictEqual(23, element.value);
	assert.strictEqual('23%', element.toString());

	reader = stylecow.Reader.fromString('23');
	element = stylecow.Unit.create(reader);
	assert.strictEqual(undefined, element);
};
