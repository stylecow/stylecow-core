module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Number(23);
	assert.strictEqual(23, element.name);
	assert.strictEqual('23', element.toString());

	reader = stylecow.Reader.fromString('.23');
	element = stylecow.Number.create(reader);
	assert.strictEqual(0.23, element.name);
	assert.strictEqual('0.23', element.toString());

	reader = stylecow.Reader.fromString('23');
	element = stylecow.Number.create(reader);
	assert.strictEqual(23, element.name);
	assert.strictEqual('23', element.toString());

	reader = stylecow.Reader.fromString('-23');
	element = stylecow.Number.create(reader);
	assert.strictEqual(-23, element.name);
	assert.strictEqual('-23', element.toString());

	reader = stylecow.Reader.fromString('_23');
	element = stylecow.Number.create(reader);
	assert.strictEqual(undefined, element);
};
